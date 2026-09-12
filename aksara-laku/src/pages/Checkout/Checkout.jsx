import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { isValidEmail, isValidWhatsApp, generateOrderId } from "../../utils/helpers";
import { ORDER_STATUS } from "../../utils/constants";
import CustomerForm from "../../components/checkout/CustomerForm";
import PaymentGatewayOptions from "../../components/checkout/PaymentGatewayOptions";
import OrderSummary from "../../components/checkout/OrderSummary";
import PaymentSimulationModal from "../../components/checkout/PaymentSimulationModal";
import AuthModal from "../../components/auth/AuthModal";
import { useToast } from "../../components/common/Toast";
import { Lock, LogIn, AlertTriangle, UserCheck } from "lucide-react";
import SEOHead from "../../components/common/SEOHead";
import { trackEvent } from "../../utils/analytics";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function Checkout() {
  const { cartItems, totalPrice, discountAmount, finalPrice, clearCart } = useCart();
  const { user, isLoggedIn, recordOrder } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: "", email: "", whatsapp: "" });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPaymentSimulationOpen, setIsPaymentSimulationOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState("");

  // Track checkout initiation
  useEffect(() => {
    if (cartItems.length > 0) {
      trackEvent("checkout_start", {
        itemCount: cartItems.length,
        total: finalPrice,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reactive customer data derived from user account if not manually overridden
  const effectiveCustomer = {
    name: customer.name || user?.businessName || user?.name || "",
    email: customer.email || user?.email || "",
    whatsapp: customer.whatsapp || user?.whatsapp || "",
  };

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  function handleFieldChange(field, value) {
    setCustomer((prev) => ({
      ...prev,
      // If user starts typing, initialize other fields from effectiveCustomer
      name: field === "name" ? value : (prev.name || user?.businessName || user?.name || ""),
      email: field === "email" ? value : (prev.email || user?.email || ""),
      whatsapp: field === "whatsapp" ? value : (prev.whatsapp || user?.whatsapp || ""),
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const nameVal = effectiveCustomer.name.trim();
    const emailVal = effectiveCustomer.email.trim();
    const waRaw = effectiveCustomer.whatsapp.trim();
    const waClean = waRaw.replace(/[\s-]/g, "");

    if (!nameVal) {
      nextErrors.name = "Nama usaha atau pemesan wajib diisi.";
    }

    // 1. Validasi format email menggunakan RegEx (harus ada '@' dan '.com')
    if (!emailVal) {
      nextErrors.email = "Alamat email wajib diisi.";
    } else if (!isValidEmail(emailVal)) {
      nextErrors.email = "Format email tidak valid. Wajib menyertakan '@' dan domain '.com' (contoh: owner@domain.com).";
    }

    // 2. Validasi nomor WhatsApp (harus berupa angka dan minimal 10 digit)
    if (!waRaw) {
      nextErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!/^[0-9]+$/.test(waClean) && !/^\+[0-9]+$/.test(waClean)) {
      nextErrors.whatsapp = "Nomor WhatsApp harus berupa angka.";
    } else if (waClean.replace(/^\+/, "").length < 10 || !isValidWhatsApp(waRaw)) {
      nextErrors.whatsapp = "Nomor WhatsApp minimal 10 digit angka.";
    }

    setErrors(nextErrors);

    let paymentOk = true;
    if (!paymentMethod) {
      setPaymentError("Pilih salah satu metode pembayaran.");
      paymentOk = false;
    } else {
      setPaymentError(null);
    }

    const isValid = Object.keys(nextErrors).length === 0 && paymentOk;
    if (!isValid) {
      showToast("Mohon periksa dan lengkapi field yang berwarna merah.", "warning");
    }

    return isValid;
  }

  function handlePlaceOrder() {
    // Safety check: protect against proceeding if not logged in
    if (!isLoggedIn) {
      showToast("Silakan login terlebih dahulu untuk melanjutkan.", "warning");
      setIsAuthModalOpen(true);
      return;
    }

    if (!validate()) return;

    setIsProcessing(true);

    const nextOrderId = generateOrderId();
    setPendingOrderId(nextOrderId);

    // Brief processing delay to show button loading spinner before modal reveals
    window.setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentSimulationOpen(true);
    }, 400);
  }

  async function handlePaymentSuccess(paymentResult) {
    const orderId = paymentResult?.orderId || pendingOrderId || generateOrderId();
    const order = {
      orderId,
      items: cartItems.map((item) => item.product),
      total: finalPrice,
      date: new Date().toISOString(),
      status: ORDER_STATUS.SUCCESS, // 'SUCCESS'
      paymentMethod: paymentResult?.paymentMethod || paymentMethod || "QRIS",
      customer: effectiveCustomer,
    };

    // Simpan data transaksi ke Supabase Database (tabel orders dan order_items)
    if (isSupabaseConfigured) {
      try {
        let activeUserId = user?.id || "guest_user";
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id) {
          activeUserId = authData.user.id;
        }

        const { error: orderError } = await supabase.from("orders").insert({
          order_id: orderId,
          user_id: String(activeUserId),
          customer_name: effectiveCustomer.name,
          customer_email: effectiveCustomer.email,
          customer_whatsapp: effectiveCustomer.whatsapp,
          total_amount: finalPrice,
          payment_method: paymentResult?.paymentMethod || paymentMethod || "QRIS",
          status: ORDER_STATUS.SUCCESS,
          created_at: new Date().toISOString(),
        });

        if (orderError) {
          console.warn("Supabase orders insert notice:", orderError.message);
        } else {
          const itemsPayload = cartItems.map((item) => ({
            order_id: orderId,
            product_id: String(item.product.id),
            price: item.product.price,
            product_title: item.product.title,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(itemsPayload);

          if (itemsError) {
            console.warn("Supabase order_items insert notice:", itemsError.message);
          }
        }
      } catch (err) {
        console.warn("Koneksi Supabase saat checkout gagal:", err);
      }
    }

    trackEvent("checkout_success", {
      orderId,
      total: finalPrice,
      itemCount: cartItems.length,
      paymentMethod: paymentResult?.paymentMethod || paymentMethod || "QRIS",
      products: cartItems.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        niche: item.product.niche || item.product.category,
      })),
    });

    recordOrder(order);
    clearCart();
    setIsPaymentSimulationOpen(false);
    navigate(`/payment-success?orderId=${orderId}`);
  }

  return (
    <>
      <SEOHead
        title="Checkout & Pembayaran Aman | Aksara.Laku"
        description="Selesaikan pemesanan aset digital dan template Canva F&B Anda dengan pembayaran aman melalui QRIS atau Virtual Account."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-8">
          Checkout &amp; Penerbitan Lisensi
        </h1>

        {/* Responsive 2-Column Split Layout: 60% Kiri, 40% Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-10 items-start">
          {/* Kolom Kiri (60%): Banner Proteksi, Form Data Pembeli, Metode Pembayaran */}
          <div className="flex flex-col gap-6">
            {/* Banner Peringatan Proteksi Login (Paling Atas jika user belum login) */}
            {!isLoggedIn ? (
              <div className="p-5 bg-white border border-[#77642e]/25 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all duration-300 ease-in-out">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#77642e]/10 text-[#77642e] shrink-0 mt-0.5">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-ink flex items-center gap-1.5">
                      <Lock size={15} className="text-[#77642e]" />
                      Wajib Masuk (Login) Sebelum Melanjutkan
                    </h4>
                    <p className="text-xs text-ink-soft/80 mt-1 leading-relaxed">
                      Demi keamanan verifikasi kepemilikan dan penerbitan lisensi komersial aset digital F&amp;B, Anda wajib masuk atau mendaftar terlebih dahulu.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast("Silakan login terlebih dahulu untuk melanjutkan.", "warning");
                    setIsAuthModalOpen(true);
                  }}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] text-white text-xs font-bold shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <LogIn size={15} />
                  <span>Login / Daftar</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-white border border-basil/30 rounded-2xl flex items-center gap-3 text-xs text-basil shadow-2xs transition-all duration-300 ease-in-out">
                <div className="p-2 rounded-xl bg-basil/10 text-basil shrink-0">
                  <UserCheck size={18} />
                </div>
                <span>
                  Masuk sebagai <strong className="font-bold text-ink">{user?.businessName || user?.name || user?.email}</strong>. Aset yang dibeli akan langsung masuk ke pustaka akun ini.
                </span>
              </div>
            )}

            {/* Form Data Pembeli (Nama Usaha, Email Pengiriman File, No. WhatsApp) */}
            <CustomerForm
              values={effectiveCustomer}
              errors={errors}
              onChange={handleFieldChange}
            />

            {/* Pilihan Metode Pembayaran (QRIS, Bank Transfer, E-Wallet) */}
            <PaymentGatewayOptions
              selected={paymentMethod}
              onSelect={(m) => {
                setPaymentMethod(m);
                setPaymentError(null);
              }}
              error={paymentError}
            />
          </div>

          {/* Kolom Kanan (40% - Sticky Box): Order Summary + Promo + Action Button */}
          <aside className="w-full">
            <OrderSummary
              items={cartItems}
              totalPrice={totalPrice}
              discountAmount={discountAmount}
              finalPrice={finalPrice}
              isLoggedIn={isLoggedIn}
              isProcessing={isProcessing}
              onPay={handlePlaceOrder}
              onRequireLogin={() => {
                showToast("Silakan login terlebih dahulu untuk melanjutkan.", "warning");
                setIsAuthModalOpen(true);
              }}
            />
          </aside>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
      />

      {isPaymentSimulationOpen && (
        <PaymentSimulationModal
          isOpen={isPaymentSimulationOpen}
          onClose={() => setIsPaymentSimulationOpen(false)}
          totalAmount={finalPrice}
          customer={effectiveCustomer}
          orderId={pendingOrderId}
          initialMethod={paymentMethod || "qris"}
          onSuccessPayment={handlePaymentSuccess}
        />
      )}
    </>
  );
}
