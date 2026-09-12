import { ShoppingBag, RotateCcw, Check } from "lucide-react";
import Button from "../common/Button";
import { formatIDR, calcDiscountPercent } from "../../utils/helpers";

export default function Step3Result({ bundle, onAddToCart, onReset }) {
  if (!bundle) {
    return (
      <div className="text-center py-10">
        <p className="text-ink-soft">
          Belum ada rekomendasi yang cocok. Coba ubah pilihan kategori atau tujuanmu.
        </p>
        <Button variant="secondary" onClick={onReset} icon={RotateCcw} className="mt-4">
          Ulangi Kuis
        </Button>
      </div>
    );
  }

  const discount = calcDiscountPercent(bundle.originalTotal, bundle.bundleTotal);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-ink-soft font-medium">Langkah 3 dari 3</p>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2f6b45] bg-[#2f6b45]/10 px-2.5 py-0.5 rounded-full">
          <Check size={13} /> Rekomendasi Sesuai Niche
        </span>
      </div>
      <h3 className="font-display text-2xl sm:text-3xl text-ink font-bold mb-2">
        {bundle.title}
      </h3>
      <p className="text-xs sm:text-sm text-ink-soft mb-6 leading-relaxed">
        {bundle.description}
      </p>

      {/* List Kartu Produk dengan Efek Reveal (Muncul Satu per Satu / Stagger) */}
      <div className="flex flex-col gap-3 mb-6">
        {bundle.products.map((p, idx) => (
          <div
            key={p.id}
            style={{
              animationDelay: `${idx * 150}ms`,
              animationFillMode: "backwards",
            }}
            className="animate-stagger-card flex items-center gap-3.5 p-3 sm:p-3.5 bg-white border border-[#77642e]/15 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-[#77642e]/35"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#77642e]/15 bg-paper-dim">
              <img
                src={p.thumbnail}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Produk */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#77642e]/10 text-[#77642e] uppercase tracking-wider mb-1 inline-block">
                {p.type || "Template Digital"}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-ink truncate">
                {p.title}
              </h4>
            </div>

            {/* Harga */}
            <div className="text-right shrink-0">
              {p.originalPrice > p.price && (
                <span className="text-[10px] text-ink-soft/60 line-through block">
                  {formatIDR(p.originalPrice)}
                </span>
              )}
              <span className="text-xs sm:text-sm font-bold text-[#D9534F] font-mono">
                {formatIDR(p.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rincian Total Bundling */}
      <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/20 flex items-center justify-between mb-6 shadow-2xs">
        <div>
          <span className="text-xs text-ink-soft block mb-0.5 font-medium">Harga Spesial Paket Rekomendasi:</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold text-[#D9534F] font-mono">
              {formatIDR(bundle.bundleTotal)}
            </span>
            {bundle.originalTotal > bundle.bundleTotal && (
              <span className="text-xs text-ink-soft/60 line-through font-mono">
                {formatIDR(bundle.originalTotal)}
              </span>
            )}
          </div>
        </div>
        {discount > 0 && (
          <span className="text-xs font-bold text-white bg-[#D9534F] px-3 py-1 rounded-full shadow-xs">
            Hemat {discount}%
          </span>
        )}
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onReset} icon={RotateCcw} className="shrink-0 px-5">
          Ulangi
        </Button>
        <Button
          onClick={onAddToCart}
          icon={ShoppingBag}
          fullWidth
          className="font-bold py-3.5 text-base shadow-md bg-[#D9534F] hover:bg-[#c9433f]"
        >
          Tambahkan Semua ke Keranjang
        </Button>
      </div>
    </div>
  );
}
