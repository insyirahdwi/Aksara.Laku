import { useState, useEffect } from "react";
import {
  QrCode,
  Landmark,
  Timer,
  Copy,
  Check,
  Zap,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";
import { formatIDR } from "../../utils/helpers";
import { useToast } from "../common/Toast";
import { ORDER_STATUS } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

const VA_NUMBERS = {
  bca: {
    name: "BCA Virtual Account",
    code: "8801 2345 6789 0123",
  },
  mandiri: {
    name: "Mandiri Virtual Account",
    code: "8912 3456 7890 1234",
  },
  bri: {
    name: "BRI Virtual Account",
    code: "1280 4567 8901 2345",
  },
  bni: {
    name: "BNI Virtual Account",
    code: "9881 5678 9012 3456",
  },
};

export default function PaymentSimulationModal({
  isOpen,
  onClose,
  totalAmount,
  customer,
  orderId,
  initialMethod = "qris",
  onSuccessPayment,
}) {
  const { showToast } = useToast();

  // Tab: 'qris' or 'bank_transfer'
  const [activeTab, setActiveTab] = useState(
    initialMethod === "bank_transfer" ? "bank_transfer" : "qris"
  );
  const [selectedBank, setSelectedBank] = useState("bca");
  const [isCopiedVA, setIsCopiedVA] = useState(false);
  const [isCopiedAmount, setIsCopiedAmount] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // 5-minute (300 seconds) countdown timer
  const [timeLeft, setTimeLeft] = useState(300);

  // Countdown tick
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  // Format timer MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Keyboard shortcut listener: Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSimulating) {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSimulating, onClose]);


  const handleCopyVA = () => {
    const rawNumber = VA_NUMBERS[selectedBank].code.replace(/\s+/g, "");
    navigator.clipboard?.writeText(rawNumber);
    setIsCopiedVA(true);
    showToast(`Nomor ${VA_NUMBERS[selectedBank].name} berhasil disalin!`, "info");
    setTimeout(() => setIsCopiedVA(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard?.writeText(String(totalAmount));
    setIsCopiedAmount(true);
    showToast("Nominal tagihan berhasil disalin!", "info");
    setTimeout(() => setIsCopiedAmount(false), 2000);
  };

  const handleSimulatePayment = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    try {
      // Realistic simulation delay (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      showToast("Pembayaran berhasil diverifikasi! Status transaksi: SUCCESS.", "success");
      onSuccessPayment?.({
        orderId,
        status: ORDER_STATUS.SUCCESS,
        paymentMethod: activeTab === "qris" ? "QRIS Digital" : `${VA_NUMBERS[selectedBank].name}`,
      });
    } catch {
      setIsSimulating(false);
      showToast("Gagal memproses simulasi pembayaran.", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="payment-simulation-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => {
            if (!isSimulating) onClose?.();
          }}
          role="presentation"
        >
          <motion.div
            key="payment-simulation-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            className="relative w-full max-w-xl bg-white border border-[#77642e]/20 rounded-3xl shadow-2xl overflow-hidden my-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Simulasi Pembayaran"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header Modal */}
        <div className="bg-[#162740] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#77642e]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#77642e]/40 border border-[#77642e]/50 text-[#FDFBF7]">
                Sandbox Gateway
              </span>
              <span className="text-xs font-mono text-white/75">{orderId}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold mt-1">
              Instruksi &amp; Simulasi Pembayaran
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isSimulating) onClose?.();
            }}
            disabled={isSimulating}
            aria-label="Tutup"
            className="p-2 rounded-xl text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timer Bar & Ringkasan Total Tagihan */}
        <div className="bg-[#FDFBF7] px-6 py-4 border-b border-dashed border-[#77642e]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-ink-soft block font-medium">
              Total Tagihan {customer?.name ? `(${customer.name})` : ""}:
            </span>
            <span className="font-display text-2xl font-extrabold text-[#D9534F] font-mono">
              {formatIDR(totalAmount)}
            </span>
          </div>

          {/* Countdown Timer 5 Menit */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono border transition-colors ${
              timeLeft < 60
                ? "bg-[#D9534F]/15 text-[#D9534F] border-[#D9534F]/30 animate-pulse"
                : "bg-white text-[#162740] border-[#77642e]/25 shadow-2xs"
            }`}
          >
            <Timer size={16} className={timeLeft < 60 ? "text-[#D9534F]" : "text-[#77642e]"} />
            <span>Sisa Waktu: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Tab Switcher: QRIS vs Bank Transfer (VA) */}
        <div className="p-6">
          <div className="grid grid-cols-2 p-1.5 bg-[#FDFBF7] border border-[#77642e]/15 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("qris")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "qris"
                  ? "bg-[#162740] text-white shadow-sm"
                  : "text-[#162740] hover:text-[#D9534F]"
              }`}
            >
              <QrCode size={16} />
              <span>QRIS (Digital)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bank_transfer")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === "bank_transfer"
                  ? "bg-[#162740] text-white shadow-sm"
                  : "text-[#162740] hover:text-[#D9534F]"
              }`}
            >
              <Landmark size={16} />
              <span>Bank Transfer (VA)</span>
            </button>
          </div>

          {/* Content: QRIS View */}
          {activeTab === "qris" && (
            <div className="flex flex-col items-center text-center">
              {/* Dummy QR Code Card */}
              <div className="relative p-4 bg-white border-2 border-dashed border-[#77642e]/30 rounded-2xl shadow-sm mb-4">
                {/* QRIS Header Banner */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black tracking-widest text-[#162740] border-b-2 border-[#D9534F]">
                      QRIS
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium">GPN</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-400">NMID: ID1020304050607</span>
                </div>

                {/* SVG Dummy QR Code */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 bg-white flex items-center justify-center p-2">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-[#162740]"
                    fill="currentColor"
                  >
                    {/* Corner Position Detection Squares */}
                    <rect x="5" y="5" width="26" height="26" rx="3" />
                    <rect x="9" y="9" width="18" height="18" fill="white" />
                    <rect x="13" y="13" width="10" height="10" rx="1" />

                    <rect x="69" y="5" width="26" height="26" rx="3" />
                    <rect x="73" y="9" width="18" height="18" fill="white" />
                    <rect x="77" y="13" width="10" height="10" rx="1" />

                    <rect x="5" y="69" width="26" height="26" rx="3" />
                    <rect x="9" y="73" width="18" height="18" fill="white" />
                    <rect x="13" y="77" width="10" height="10" rx="1" />

                    {/* QR Code Matrix Dots & Alignment */}
                    <rect x="36" y="8" width="5" height="5" />
                    <rect x="46" y="8" width="8" height="5" />
                    <rect x="58" y="8" width="5" height="5" />
                    <rect x="36" y="18" width="8" height="5" />
                    <rect x="48" y="18" width="5" height="5" />
                    <rect x="58" y="18" width="6" height="5" />

                    <rect x="8" y="36" width="5" height="8" />
                    <rect x="18" y="36" width="5" height="5" />
                    <rect x="26" y="36" width="5" height="8" />
                    <rect x="8" y="48" width="8" height="5" />
                    <rect x="20" y="48" width="5" height="8" />
                    <rect x="8" y="58" width="5" height="5" />

                    {/* Central pattern & logo badge */}
                    <rect x="36" y="36" width="28" height="28" fill="#162740" rx="4" />
                    <rect x="39" y="39" width="22" height="22" fill="white" rx="2" />
                    <text
                      x="50"
                      y="53"
                      fontSize="7"
                      fontWeight="bold"
                      fill="#D9534F"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      AKX
                    </text>

                    {/* Right & Bottom Data dots */}
                    <rect x="69" y="36" width="6" height="6" />
                    <rect x="80" y="36" width="5" height="8" />
                    <rect x="89" y="36" width="5" height="5" />
                    <rect x="69" y="48" width="8" height="5" />
                    <rect x="82" y="48" width="5" height="5" />
                    <rect x="74" y="58" width="7" height="6" />
                    <rect x="87" y="58" width="7" height="5" />

                    <rect x="36" y="69" width="6" height="6" />
                    <rect x="47" y="69" width="6" height="5" />
                    <rect x="57" y="69" width="7" height="6" />
                    <rect x="69" y="69" width="6" height="5" />
                    <rect x="80" y="69" width="5" height="6" />
                    <rect x="36" y="80" width="8" height="5" />
                    <rect x="48" y="80" width="6" height="6" />
                    <rect x="60" y="80" width="5" height="5" />
                    <rect x="74" y="80" width="6" height="5" />
                    <rect x="85" y="80" width="7" height="7" />
                    <rect x="36" y="90" width="5" height="5" />
                    <rect x="46" y="89" width="7" height="6" />
                    <rect x="58" y="90" width="6" height="5" />
                    <rect x="70" y="89" width="8" height="6" />
                    <rect x="83" y="90" width="6" height="5" />
                  </svg>
                </div>

                <div className="pt-2 border-t border-gray-100 text-center">
                  <p className="text-xs font-bold text-[#162740]">Aksara.Laku Official Store</p>
                  <p className="text-[10px] text-gray-400">Merchant F&amp;B Solutions</p>
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-[#77642e]/15 rounded-xl p-3 text-xs text-ink-soft text-left w-full mb-2">
                <p className="font-semibold text-ink mb-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-basil" />
                  Cara Pembayaran QRIS:
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                  <li>Buka aplikasi m-Banking atau E-Wallet (GoPay, OVO, DANA, BCA, Livin).</li>
                  <li>Pilih menu <strong>Scan / Bayar QRIS</strong> dan arahkan kamera ke barcode.</li>
                  <li>Pastikan nama merchant adalah <strong>Aksara.Laku</strong>.</li>
                  <li>Konfirmasi nominal <strong>{formatIDR(totalAmount)}</strong> lalu bayar.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Content: Bank Transfer (Virtual Account) View */}
          {activeTab === "bank_transfer" && (
            <div className="flex flex-col gap-4">
              {/* Bank Selector Pills */}
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(VA_NUMBERS).map((bankKey) => {
                  const isSelected = selectedBank === bankKey;
                  return (
                    <button
                      key={bankKey}
                      type="button"
                      onClick={() => setSelectedBank(bankKey)}
                      className={`py-2 px-1 text-center font-mono font-bold text-xs uppercase rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#D9534F] bg-[#D9534F]/10 text-[#D9534F] ring-1 ring-[#D9534F]"
                          : "border-[#77642e]/20 bg-[#FDFBF7] text-ink hover:border-[#77642e]"
                      }`}
                    >
                      {bankKey}
                    </button>
                  );
                })}
              </div>

              {/* VA Detail Box */}
              <div className="rounded-2xl border border-[#77642e]/20 bg-[#FDFBF7] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    {VA_NUMBERS[selectedBank].name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-basil/15 text-basil">
                    Verifikasi Otomatis
                  </span>
                </div>

                {/* VA Number with Copy Button */}
                <div className="flex items-center justify-between p-3 bg-white border border-[#77642e]/20 rounded-xl shadow-2xs">
                  <div>
                    <span className="text-[10px] text-ink-soft block">Nomor Virtual Account:</span>
                    <span className="font-mono text-base sm:text-lg font-bold text-[#162740] tracking-wider">
                      {VA_NUMBERS[selectedBank].code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#162740] hover:bg-[#162740]/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    {isCopiedVA ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin VA</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Amount with Copy Button */}
                <div className="flex items-center justify-between p-3 bg-white border border-[#77642e]/20 rounded-xl shadow-2xs">
                  <div>
                    <span className="text-[10px] text-ink-soft block">Nominal Transfer:</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#D9534F]">
                      {formatIDR(totalAmount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#77642e]/30 bg-white hover:bg-[#FDFBF7] text-ink text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {isCopiedAmount ? (
                      <>
                        <Check size={14} className="text-basil" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-[#77642e]/15 rounded-xl p-3 text-xs text-ink-soft">
                <p className="font-semibold text-ink mb-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-basil" />
                  Instruksi Singkat:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Lakukan transfer melalui ATM atau Mobile Banking ke nomor Virtual Account di atas.
                  Status transaksi akan langsung terverifikasi secara instan tanpa perlu unggah bukti
                  pembayaran.
                </p>
              </div>
            </div>
          )}

          {/* Action Simulation Box (Testing) */}
          <div className="mt-6 pt-5 border-t border-dashed border-[#77642e]/20 flex flex-col gap-3">
            <div className="p-3 bg-[#77642e]/10 border border-[#77642e]/25 rounded-xl flex items-start gap-2 text-xs text-[#77642e]">
              <Zap size={16} className="shrink-0 mt-0.5 text-[#77642e]" />
              <p className="leading-relaxed">
                <strong>Mode Simulasi Pengujian:</strong> Untuk mempercepat pengujian alur pesanan,
                klik tombol di bawah. Sistem akan memverifikasi status pembayaran menjadi{" "}
                <span className="font-mono font-bold text-[#162740]">SUCCESS</span> dan mengarahkan ke pustaka aset.
              </p>
            </div>

            {/* Tombol "Simulasi Bayar (Testing)" */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulating || timeLeft <= 0}
              className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#D9534F]/25 hover:shadow-xl hover:shadow-[#D9534F]/35 hover:scale-[1.01] transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {isSimulating ? (
                <>
                  <Loader2 size={18} className="animate-spin text-white" />
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="group-hover:scale-110 transition-transform text-amber-300" />
                  <span>Simulasi Bayar (Testing) &rarr; Berhasil</span>
                </>
              )}
            </button>

            {/* Secondary cancel button */}
            <button
              type="button"
              onClick={() => {
                if (!isSimulating) onClose?.();
              }}
              disabled={isSimulating}
              className="text-center text-xs text-ink-soft hover:text-[#162740] font-semibold py-1.5 transition-colors cursor-pointer"
            >
              Kembali ke Halaman Checkout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
}
