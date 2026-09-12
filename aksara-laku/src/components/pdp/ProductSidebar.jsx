import { useNavigate } from "react-router-dom";
import {
  Star,
  Zap,
  ShoppingCart,
  Check,
  DownloadCloud,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { formatIDR, calcDiscountPercent } from "../../utils/helpers";
import { useCart } from "../../context/CartContext";
import { useToast } from "../common/Toast";

const NICHE_EMOJIS = {
  Coffee: { label: "Kafe & Kopi", emoji: "☕" },
  Resto: { label: "Resto Nusantara", emoji: "🍽️" },
  Bakery: { label: "Bakery & Kue", emoji: "🥐" },
  Beverage: { label: "Boba & Minuman", emoji: "🧋" },
  Catering: { label: "Katering Harian", emoji: "🍱" },
};

export default function ProductSidebar({ product }) {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const discount = calcDiscountPercent(product.originalPrice, product.price);
  const inCart = isInCart(product.id);
  const niche = NICHE_EMOJIS[product.category] || {
    label: product.category,
    emoji: "🏷️",
  };

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart(product);
      showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
    }
  };

  const handleDirectCheckout = () => {
    if (!inCart) {
      addToCart(product);
    }
    navigate("/checkout");
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-7 shadow-md flex flex-col gap-6 lg:sticky lg:top-24 transition-all duration-300 ease-in-out">
      {/* 1. Niche Badge & Tipe Aset */}
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turmeric/15 text-ink text-xs font-semibold border border-turmeric/30">
            <span>{niche.emoji}</span>
            <span>{niche.label}</span>
          </span>
          <Badge tone="outline" className="text-xs font-semibold text-ink">
            {product.type}
          </Badge>
        </div>

        {/* Judul Produk */}
        <h1 className="font-display text-2xl sm:text-3xl text-ink font-bold leading-tight">
          {product.title}
        </h1>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 text-xs text-ink-soft mt-3">
          <div className="flex items-center text-turmeric">
            <Star size={14} className="fill-turmeric" />
          </div>
          <span className="font-bold text-ink">{product.rating}</span>
          <span>·</span>
          <span>{product.reviewCount} ulasan pembeli terverifikasi</span>
        </div>
      </div>

      {/* 2. Label Harga & Promo */}
      <div className="p-4 bg-paper-dim/60 border border-line rounded-xl flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl font-extrabold text-ink">
            {formatIDR(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-sm text-ink-soft/60 line-through">
              {formatIDR(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <Badge tone="chili" className="font-bold text-xs">
              Hemat {discount}%
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-turmeric-dark font-medium flex items-center gap-1 mt-1">
          <Sparkles size={12} />
          Harga promo spesial — akses permanen tanpa langganan bulanan.
        </p>
      </div>

      {/* 3. Tombol Aksi: Beli Sekarang & Tambah ke Keranjang */}
      <div className="flex flex-col gap-3">
        {/* Tombol Beli Sekarang (Direct Checkout) */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          icon={Zap}
          onClick={handleDirectCheckout}
          className="shadow-sm font-bold text-base py-3.5 bg-chili hover:bg-[#c9433f]"
        >
          Beli Sekarang
        </Button>

        {/* Tombol Tambah ke Keranjang */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          icon={inCart ? Check : ShoppingCart}
          onClick={handleAddToCart}
          className={`py-2.5 font-semibold text-sm transition-all duration-300 ease-in-out ${
            inCart
              ? "!bg-basil/15 !text-basil !border-basil hover:!bg-basil/20"
              : "!border-ink hover:!bg-ink hover:!text-white"
          }`}
        >
          {inCart ? "Sudah di Keranjang" : "Tambah ke Keranjang"}
        </Button>
      </div>

      {/* 4. Box Informasi Singkat: Instant Download & Garansi Lisensi Komersial */}
      <div className="pt-5 border-t border-dashed border-line flex flex-col gap-3.5 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-turmeric/20 text-ink rounded shrink-0 mt-0.5">
            <DownloadCloud size={16} className="text-turmeric-dark" />
          </div>
          <div>
            <p className="font-bold text-ink">Instant Download Guarantee</p>
            <p className="text-ink-soft text-[11px] leading-relaxed mt-0.5">
              Link template Canva &amp; file PDF langsung tersedia segera setelah pembayaran berhasil diverifikasi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-basil/15 text-basil rounded shrink-0 mt-0.5">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="font-bold text-ink">Garansi Lisensi Komersial</p>
            <p className="text-ink-soft text-[11px] leading-relaxed mt-0.5">
              Bebas dipakai untuk promosi bisnis sendiri seumur hidup, cetak banner, katalog menu, dan iklan berbayar.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-paper-dim text-ink-soft rounded shrink-0 mt-0.5">
            <RefreshCw size={16} />
          </div>
          <div>
            <p className="font-bold text-ink">Akses Update Selamanya</p>
            <p className="text-ink-soft text-[11px] leading-relaxed mt-0.5">
              Tersimpan aman di profil &amp; pustaka digital Anda tanpa batas waktu kadaluarsa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
