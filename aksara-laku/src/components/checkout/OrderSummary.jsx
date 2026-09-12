import { useState } from "react";
import { Lock, LogIn, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { formatIDR } from "../../utils/helpers";

export default function OrderSummary({
  items,
  totalPrice,
  discountAmount,
  finalPrice,
  isLoggedIn,
  isProcessing,
  onPay,
  onRequireLogin,
  onApplyPromo,
}) {
  const [inputCode, setInputCode] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [promoError, setPromoError] = useState("");

  const handleApply = (e) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = inputCode.trim().toUpperCase();

    if (!cleaned) return;

    if (cleaned === "AKSARAFNB" || cleaned === "DISKON10" || cleaned === "HEMATKAFE") {
      setAppliedCode(cleaned);
      onApplyPromo?.(cleaned);
    } else {
      setPromoError("Kode promo tidak valid atau sudah kedaluwarsa.");
    }
  };

  const calculatedTotal = Math.max(0, finalPrice - (appliedCode ? 10000 : 0));

  return (
    <div className="rounded-2xl border border-[#77642e]/20 bg-[#FDFBF7] p-6 sm:p-7 shadow-md flex flex-col gap-5 lg:sticky lg:top-24 transition-all duration-300 ease-in-out">
      {/* Header dengan border pemisah rapi */}
      <div className="flex items-center justify-between pb-3 border-b border-[#77642e]/20">
        <h3 className="font-display text-lg sm:text-xl text-ink font-bold">
          Ringkasan Pesanan
        </h3>
        <span className="text-xs bg-white border border-[#77642e]/20 px-2.5 py-0.5 rounded-full font-semibold text-ink shadow-2xs">
          {items.length} Aset Digital
        </span>
      </div>

      {/* List Aset Digital dengan Thumbnail Kecil & Harga */}
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#77642e]/15 shadow-2xs transition-all duration-300 ease-in-out hover:border-[#77642e]/35"
          >
            {/* Thumbnail Kecil */}
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#77642e]/15 bg-[#FDFBF7]">
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Produk */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-ink truncate">
                {item.product.title}
              </p>
              <span className="text-[10px] text-ink-soft/70 block truncate">
                {item.product.type || "Digital Template"}
              </span>
            </div>

            {/* Harga */}
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-ink font-mono">
                {formatIDR(item.product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Kode Promo / Voucher Diskon dengan fokus ring Grey Brown */}
      <div className="pt-3 border-t border-dashed border-[#77642e]/20">
        <form onSubmit={handleApply} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Kode promo (cth: AKSARAFNB)"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setPromoError("");
              }}
              disabled={Boolean(appliedCode)}
              className="w-full bg-white border border-[#77642e]/25 px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider text-ink placeholder:text-ink-soft/50 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={Boolean(appliedCode) || !inputCode.trim()}
            className="px-4 py-2.5 bg-ink text-white text-xs font-semibold rounded-xl hover:bg-ink/90 disabled:opacity-40 transition-all duration-300 ease-in-out shrink-0 cursor-pointer shadow-xs"
          >
            {appliedCode ? "Terpasang" : "Gunakan"}
          </button>
        </form>

        {appliedCode && (
          <p className="text-[11px] text-basil font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} />
            Kupon {appliedCode} aktif (-Rp10.000)
          </p>
        )}
        {promoError && (
          <p className="text-[11px] text-[#D9534F] mt-2 font-medium">{promoError}</p>
        )}
      </div>

      {/* Rincian Subtotal, Promo, & Total dengan border pemisah rapi */}
      <div className="pt-4 border-t border-[#77642e]/20 flex flex-col gap-2.5 text-xs">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal Aset</span>
          <span className="font-mono">{formatIDR(totalPrice)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-[#D9534F] font-medium">
            <span>Potongan Bundling</span>
            <span className="font-mono">-{formatIDR(discountAmount)}</span>
          </div>
        )}

        {appliedCode && (
          <div className="flex justify-between text-basil font-medium">
            <span>Diskon Kode Promo</span>
            <span className="font-mono">-Rp10.000</span>
          </div>
        )}

        <div className="flex items-baseline justify-between font-display pt-3 border-t border-[#77642e]/20 text-ink">
          <span className="text-base font-bold">Total Pembayaran</span>
          <span className="text-2xl font-extrabold text-[#D9534F] font-mono">
            {formatIDR(calculatedTotal)}
          </span>
        </div>
      </div>

      {/* Tombol Aksi Utama: Tombol Bayar Terracotta Besar + Glow Icon & Disabled State */}
      <div className="flex flex-col gap-2.5">
        {isLoggedIn ? (
          <button
            type="button"
            disabled={isProcessing}
            onClick={onPay}
            className="group relative w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-base sm:text-lg shadow-lg shadow-[#D9534F]/25 hover:shadow-xl hover:shadow-[#D9534F]/35 transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isProcessing ? (
              <>
                <Loader2 size={22} className="animate-spin text-white" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <>
                <Lock
                  size={20}
                  className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] group-hover:scale-110"
                />
                <span>Bayar Sekarang</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onRequireLogin}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-gray-300 hover:bg-gray-300/80 text-gray-500 font-bold text-base sm:text-lg border border-gray-300 shadow-none cursor-pointer transition-all duration-300 ease-in-out"
              title="Silakan login terlebih dahulu untuk melanjutkan"
            >
              <Lock size={20} className="text-gray-400" />
              <span>Bayar Sekarang</span>
            </button>
            <button
              type="button"
              onClick={onRequireLogin}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#77642e]/30 bg-white hover:bg-[#FDFBF7] text-[#162740] text-sm font-semibold shadow-xs hover:border-[#77642e] transition-all duration-300 ease-in-out cursor-pointer"
            >
              <LogIn
                size={16}
                className="text-[#77642e] group-hover:scale-110 transition-transform duration-300"
              />
              <span>Login untuk Melanjutkan</span>
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <p className="text-[11px] text-center text-ink-soft/80 flex items-center justify-center gap-1 mt-1">
            <Lock size={12} className="text-[#77642e]" />
            Wajib login agar aset digital tersimpan di My Library Anda.
          </p>
        )}
      </div>

      {/* Guarantee Badges */}
      <div className="pt-3 border-t border-dashed border-[#77642e]/20 flex flex-col gap-1.5 text-[11px] text-ink-soft/75">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-basil shrink-0" />
          Lisensi komersial seumur hidup bebas royalti
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#77642e] shrink-0" />
          Link download otomatis permanen tanpa kadaluarsa
        </span>
      </div>
    </div>
  );
}
