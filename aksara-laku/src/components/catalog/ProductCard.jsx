import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import Button from "../common/Button";
import { formatIDR, calcDiscountPercent } from "../../utils/helpers";
import { useCart } from "../../context/CartContext";
import { useToast } from "../common/Toast";
import ProductPreviewModal from "./ProductPreviewModal";

// Helper for niche label & emoji
const NICHE_DETAILS = {
  Coffee: { label: "Kafe & Kopi", emoji: "☕" },
  Resto: { label: "Resto Nusantara", emoji: "🍽️" },
  Bakery: { label: "Bakery & Kue", emoji: "🥐" },
  Beverage: { label: "Boba & Minuman", emoji: "🧋" },
  Catering: { label: "Katering Harian", emoji: "🍱" },
};

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const discount = calcDiscountPercent(product.originalPrice, product.price);
  const inCart = isInCart(product.id);

  const niche = NICHE_DETAILS[product.category] || {
    label: product.category,
    emoji: "🏷️",
  };

  const categoryBadge =
    product.categoryBadge ||
    (product.type?.includes("Planner")
      ? "Feed & Story"
      : product.type?.includes("Kit")
      ? "Branding Kit"
      : "Katalog Menu");

  const formatBadge = product.formatBadge || "Canva Editable";
  const salesCount =
    product.salesCount || `${product.reviewCount ? product.reviewCount + 50 : 120}+ Terjual`;

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    addToCart(product);
    showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -8, transition: { duration: 0.22, ease: "easeOut" } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col overflow-hidden group h-full rounded-2xl bg-white border border-[#77642e]/20 shadow-sm hover:shadow-[0_20px_35px_-10px_rgba(119,100,46,0.18),0_10px_15px_-5px_rgba(22,39,64,0.08)] hover:border-[#77642e]/40 transition-colors duration-300"
    >
      {/* 1. Gambar Preview di Atas dengan efek hover zoom + overlay gradient lembut */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#162740]/5"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay gradient lembut di atas gambar */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#162740]/80 via-[#162740]/20 to-transparent pointer-events-none opacity-85 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges: Discount & Format Badge (Canva Editable / PSD / AI) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
          {discount > 0 ? (
            <span className="bg-[#D9534F] text-white font-bold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
              Diskon {discount}%
            </span>
          ) : (
            <span />
          )}
          <span className="bg-white/95 backdrop-blur-xs text-[#162740] font-bold text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-md border border-white/40">
            {formatBadge}
          </span>
        </div>

        {/* Hover Quick Action: Preview Detail */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPreviewOpen(true);
            }}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/95 hover:bg-white text-[#162740] font-bold text-xs rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer border border-[#162740]/10"
          >
            <Eye size={14} className="text-[#D9534F]" />
            <span>Preview Detail</span>
          </button>
        </div>

        {/* Bottom Overlay Info: Category Badge (misal: "Katalog Menu", "Feed IG") */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#77642e] text-white text-[10px] font-semibold tracking-wide shadow-sm">
            <span>{categoryBadge}</span>
          </span>
          <span className="text-white/85 text-[10px] font-mono hidden sm:inline drop-shadow-xs">
            Canva Template
          </span>
        </div>
      </Link>

      {/* 2. Informasi Konten & Rating di Bawah Gambar */}
      <div className="flex flex-col gap-2 p-4 sm:p-5 flex-1">
        {/* Niche Tag */}
        <div className="flex items-center gap-1.5 text-xs text-[#77642e] font-semibold">
          <span>{niche.emoji}</span>
          <span>{niche.label}</span>
        </div>

        {/* Judul Produk */}
        <Link to={`/product/${product.id}`} className="group-hover:text-[#D9534F] transition-colors">
          <h3 className="font-display text-base font-bold text-[#162740] leading-snug line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating Bintang & Jumlah Aset Terjual di Bawah Judul */}
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-[#162740] text-xs font-mono">{product.rating}</span>
          </div>
          <span className="text-ink-soft/40">&bull;</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {salesCount}
          </span>
          <span className="text-[11px] text-ink-soft/70 hidden sm:inline">
            ({product.reviewCount} ulasan)
          </span>
        </div>

        {/* 3. Harga + Tombol Preview Detail & Tambah ke Keranjang */}
        <div className="mt-auto pt-3.5 border-t border-dashed border-[#77642e]/15 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-xl font-bold text-[#162740] font-mono">
              {formatIDR(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-ink-soft/60 line-through font-mono">
                {formatIDR(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-[1fr_1.25fr] gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#162740]/25 bg-[#FDFBF7] hover:bg-white text-[#162740] text-xs font-bold hover:border-[#162740] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <Eye size={14} className="text-[#77642e]" />
              <span>Preview Detail</span>
            </button>

            <Button
              size="sm"
              variant={inCart ? "secondary" : "primary"}
              onClick={handleAdd}
              icon={inCart ? Check : ShoppingCart}
              className={`text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs ${
                inCart
                  ? "!bg-basil/15 !text-basil !border-basil hover:!bg-basil/20"
                  : "!bg-[#D9534F] hover:!bg-[#c9433f] text-white"
              }`}
            >
              {inCart ? "Di Keranjang" : "+ Keranjang"}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Popup Preview Detail Produk */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        product={product}
      />
    </motion.div>
  );
}
