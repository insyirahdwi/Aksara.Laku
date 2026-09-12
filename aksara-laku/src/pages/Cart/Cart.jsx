import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingCart, Sparkles, Store } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../components/common/Toast";
import { formatIDR } from "../../utils/helpers";
import Button from "../../components/common/Button";
import SEOHead from "../../components/common/SEOHead";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    totalPrice,
    discountCode,
    discountAmount,
    discountError,
    finalPrice,
    applyDiscount,
    clearDiscount,
  } = useCart();
  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  function handleApplyPromo() {
    const success = applyDiscount(promoInput);
    if (success) showToast("Kode promo berhasil diterapkan!", "success");
  }

  // Empty State: Tampilan saat keranjang belanja masih kosong
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-16 bg-[#FDFBF7]">
        <SEOHead
          title="Keranjang Belanja | Aksara.Laku"
          description="Keranjang belanja Anda di Aksara.Laku - Digital Branding Kit & Template Canva Industri F&B."
        />
        <div className="max-w-md w-full mx-auto text-center rounded-3xl border border-[#77642e]/20 bg-white p-8 sm:p-12 shadow-sm transition-all duration-300 ease-in-out">
          {/* Ilustrasi / Ikon Keranjang Kosong Sederhana */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#162740]/5 border-2 border-dashed border-[#77642e]/30 flex items-center justify-center text-[#77642e] shadow-inner transition-transform duration-300 hover:scale-105">
              <ShoppingCart size={38} className="text-[#77642e]" />
            </div>
            <span className="absolute top-1 right-2 w-6 h-6 rounded-full bg-[#D9534F] text-white text-xs font-bold flex items-center justify-center shadow-sm">
              0
            </span>
          </div>

          {/* Pesan: 'Keranjang Anda masih kosong' */}
          <h1 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold mb-3">
            Keranjang Anda masih kosong
          </h1>
          <p className="text-sm text-ink-soft mb-8 leading-relaxed max-w-sm mx-auto">
            Belum ada template Canva, kalender konten, atau branding kit F&amp;B yang ditambahkan. Mulai eksplorasi aset terbaik untuk melejitkan promosi usaha kuliner Anda.
          </p>

          {/* Tombol CTA: 'Mulai Cari Aset F&B' */}
          <div className="flex flex-col gap-3">
            <Link to="/catalog">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
              >
                <Sparkles size={18} />
                <span>Mulai Cari Aset F&amp;B</span>
              </button>
            </Link>

            <Link
              to="/matcher"
              className="text-xs text-[#77642e] hover:text-[#162740] font-semibold py-2 transition-colors flex items-center justify-center gap-1.5"
            >
              <Store size={14} />
              <span>Bingung memilih? Coba F&amp;B Niche Matcher</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Keranjang Belanja | Aksara.Laku"
        description="Periksa aset digital dan template Canva pilihan Anda di keranjang belanja Aksara.Laku."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#77642e]/15">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold">
              Keranjang Belanja
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Periksa aset digital pilihan Anda sebelum melanjutkan ke pembayaran aman.
            </p>
          </div>
          <span className="text-xs bg-white border border-[#77642e]/20 px-3 py-1 rounded-full font-semibold text-[#162740] shadow-2xs">
            {cartItems.length} Aset
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Item Keranjang */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-[#77642e]/20 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 border border-[#77642e]/15"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-bold text-[#162740] hover:text-[#D9534F] text-sm sm:text-base line-clamp-1 transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-ink-soft/80 mt-0.5">{item.product.type}</p>
                  <p className="font-display font-bold text-ink text-sm sm:text-base mt-1 font-mono">
                    {formatIDR(item.product.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  aria-label={`Hapus ${item.product.title}`}
                  className="p-2 rounded-xl text-ink-soft/60 hover:text-[#D9534F] hover:bg-[#D9534F]/10 transition-colors cursor-pointer"
                  title="Hapus aset"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77642e] hover:text-[#162740] transition-colors"
              >
                <span>&larr; Tambah aset digital lainnya</span>
              </Link>
            </div>
          </div>

          {/* Rincian Pesanan & Checkout Box */}
          <div className="lg:col-span-5 rounded-2xl border border-[#77642e]/20 bg-white p-6 sm:p-7 shadow-md flex flex-col gap-5 sticky top-24 transition-all duration-300 ease-in-out">
            <h3 className="font-display text-lg sm:text-xl text-[#162740] font-bold pb-3 border-b border-[#77642e]/15">
              Ringkasan Belanja
            </h3>

            {/* Input Promo */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Kode promo (cth: AKSARAFNB)"
                  className="flex-1 bg-[#FDFBF7] border border-[#77642e]/25 px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider text-ink placeholder:text-ink-soft/50 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent"
                />
                <Button
                  variant="secondary"
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl shrink-0"
                >
                  Terapkan
                </Button>
              </div>
              {discountError && (
                <p className="text-xs text-[#D9534F] mt-2 font-medium">{discountError}</p>
              )}
              {discountCode && (
                <div className="flex items-center justify-between text-xs text-basil mt-2 font-semibold">
                  <span>Kode promo "{discountCode.code}" aktif</span>
                  <button onClick={clearDiscount} className="underline cursor-pointer">
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Rincian Total */}
            <div className="pt-4 border-t border-[#77642e]/15 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-mono">{formatIDR(totalPrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-basil font-medium">
                  <span>Diskon Promo</span>
                  <span className="font-mono">-{formatIDR(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between font-display text-[#162740] pt-3 border-t border-[#77642e]/15">
                <span className="text-base font-bold">Total Pembayaran</span>
                <span className="text-2xl font-extrabold text-[#D9534F] font-mono">
                  {formatIDR(finalPrice)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer"
            >
              <span>Lanjut ke Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
