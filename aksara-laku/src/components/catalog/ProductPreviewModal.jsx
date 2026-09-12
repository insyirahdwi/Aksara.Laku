import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Star,
  Sparkles,
  Maximize2,
  Type,
  Laptop,
  ShieldCheck,
  ArrowRight,
  Palette,
  RotateCcw,
  Sliders,
  Eye,
} from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { formatIDR, calcDiscountPercent } from "../../utils/helpers";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../common/Toast";

// Pilihan Palet Warna Khas F&B
const FNB_COLOR_PALETTES = [
  { id: "terracotta", name: "Terracotta Red", color: "#D9534F", label: "Artisan & Grill", textColor: "#FFFFFF" },
  { id: "coffee", name: "Warm Caramel", color: "#77642E", label: "Coffee & Kafe", textColor: "#FFFFFF" },
  { id: "navy", name: "Classic Navy", color: "#162740", label: "Bistro & Resto", textColor: "#FFFFFF" },
  { id: "matcha", name: "Fresh Matcha", color: "#2F6B45", label: "Healthy & Bakery", textColor: "#FFFFFF" },
  { id: "amber", name: "Sunset Amber", color: "#E67E22", label: "Street & Boba", textColor: "#FFFFFF" },
  { id: "taro", name: "Taro & Berry", color: "#8E44AD", label: "Dessert & Sweet", textColor: "#FFFFFF" },
];

export default function ProductPreviewModal({ isOpen, onClose, product }) {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [currentProductId, setCurrentProductId] = useState(product?.id);
  const [activeSlide, setActiveSlide] = useState(0);

  // Live Customizer states
  const [brandName, setBrandName] = useState(user?.businessName || user?.name || "Kopi Senja Bersua");
  const [selectedColor, setSelectedColor] = useState("#D9534F");
  const [isLiveCustomizerActive, setIsLiveCustomizerActive] = useState(true);

  // Reset slide & brand if product changes
  if (product?.id !== currentProductId) {
    setCurrentProductId(product?.id);
    setActiveSlide(0);
  }

  if (!product) return null;

  const inCart = isInCart(product.id);
  const discount = calcDiscountPercent(product.originalPrice, product.price);

  // Gallery array fallback
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.thumbnail];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % gallery.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleAddToCart = () => {
    addToCart(product);
    showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
  };

  const handleResetCustomizer = () => {
    setBrandName(user?.businessName || user?.name || "Kopi Senja Bersua");
    setSelectedColor("#D9534F");
    setIsLiveCustomizerActive(true);
    showToast("Live Customizer dikembalikan ke setelan awal.", "info");
  };

  // Resolve specs dynamically based on category / type / format
  const isMenu =
    product.categoryBadge?.includes("Menu") ||
    product.title.toLowerCase().includes("menu");
  const isBranding =
    product.type?.includes("Branding") ||
    product.title.toLowerCase().includes("branding");
  const isStory =
    product.categoryBadge?.includes("Story") ||
    product.title.toLowerCase().includes("story");

  const specifications = [
    {
      icon: Maximize2,
      label: "Ukuran & Dimensi File",
      value: isMenu
        ? "Rasio Cetak A4 / A5 (300 DPI) + Format Digital 1080 x 1920 px"
        : isStory
        ? "Rasio 9:16 (1080 x 1920 px) & 1:1 (1080 x 1080 px)"
        : isBranding
        ? "Multi-Resolution (Vector AI, SVG, 2000x2000 px, 1080x1350 px)"
        : "Rasio 4:5 (1080 x 1350 px) & 1:1 (1080 x 1080 px)",
    },
    {
      icon: Type,
      label: "Font yang Dipakai",
      value:
        "Fraunces Display, Plus Jakarta Sans, & Playfair (100% Free Canva & Google Fonts)",
    },
    {
      icon: Laptop,
      label: "Aplikasi yang Dibutuhkan",
      value: product.formatBadge?.includes("PSD")
        ? "Canva (Gratis / Pro) & Adobe Photoshop (.PSD)"
        : product.formatBadge?.includes("AI")
        ? "Canva (Gratis / Pro) & Adobe Illustrator (.AI)"
        : "Canva (Bisa akun Free / Gratis maupun Pro) + Google Sheets",
    },
    {
      icon: ShieldCheck,
      label: "Lisensi & Hak Cipta",
      value: "Lisensi Komersial Seumur Hidup (Bebas untuk Usaha Sendiri & Klien)",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.title}
      size="xl"
      overlayClassName="bg-black/65 backdrop-blur-md"
      cardClassName="rounded-3xl max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8 items-start">
        {/* 1. Kiri: Gallery Slider (Carousel) dengan DYNAMIC LIVE MOCKUP OVERLAY */}
        <div className="flex flex-col gap-3">
          {/* Main Slide Box with Dynamic Overlay */}
          <div className="relative aspect-[4/3] sm:aspect-square bg-[#162740]/5 rounded-2xl overflow-hidden border border-[#77642e]/20 group shadow-inner">
            <img
              src={gallery[activeSlide]}
              alt={`${product.title} - preview ${activeSlide + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-all duration-300 ease-out"
            />

            {/* DYNAMIC LIVE CUSTOMIZER OVERLAY (SVG & CSS STYLING) */}
            {isLiveCustomizerActive && (
              <div className="absolute inset-0 z-15 flex flex-col justify-between p-3.5 sm:p-4.5 pointer-events-none transition-all duration-300">
                {/* 1. Dynamic Color Wash / Atmosphere Tint */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-multiply transition-colors duration-500 pointer-events-none"
                  style={{ backgroundColor: selectedColor }}
                />

                {/* 2. Top Header Brand Bar (SVG + CSS) */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md border border-white/30 transition-all duration-300"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <svg
                      className="w-3.5 h-3.5 text-white animate-pulse"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="font-display font-bold text-xs text-white tracking-wide drop-shadow-xs">
                      {brandName.trim() || "Nama Brand Anda"}
                    </span>
                  </div>

                  <span className="bg-black/70 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-mono border border-white/20 shadow-sm">
                    ✨ Live Mockup
                  </span>
                </div>

                {/* 3. Bottom Template Overlay Card (Simulasi Format Canva) */}
                <div
                  className="relative z-10 p-3 sm:p-3.5 rounded-2xl shadow-xl backdrop-blur-md border border-white/60 transition-all duration-300"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.94)",
                    borderLeft: `5px solid ${selectedColor}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate"
                        style={{ color: selectedColor }}
                      >
                        {product.categoryBadge || "Artisan Culinary Template"}
                      </p>
                      <h4 className="font-display text-sm sm:text-base font-bold text-[#162740] leading-tight truncate mt-0.5">
                        {brandName.trim() || "Nama Usaha Anda"}
                      </h4>
                      <p className="text-[10px] text-ink-soft/80 mt-0.5 hidden sm:block">
                        Disimulasikan dengan palet warna brand Anda
                      </p>
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-xs shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: selectedColor }}
                    >
                      Canva Ready
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Standard Gradient Overlay (if customizer disabled) */}
            {!isLiveCustomizerActive && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            )}

            {/* Top Badges (Only visible when customizer is off to prevent clutter) */}
            {!isLiveCustomizerActive && (
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                {discount > 0 ? (
                  <span className="bg-[#D9534F] text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    Hemat {discount}%
                  </span>
                ) : (
                  <span />
                )}
                <span className="bg-[#162740]/85 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full shadow-md border border-white/20">
                  {product.formatBadge || "Canva Editable"}
                </span>
              </div>
            )}

            {/* Slide Navigation Arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Slide sebelumnya"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#162740] shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-20"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Slide berikutnya"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#162740] shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-20"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Bottom Info: Counter */}
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
              <span className="bg-black/65 text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                {activeSlide + 1} / {gallery.length}
              </span>
            </div>
          </div>

          {/* Toggle Live Mockup on/off button & Thumbnails */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsLiveCustomizerActive((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isLiveCustomizerActive
                  ? "bg-[#77642e]/10 border-[#77642e]/30 text-[#77642e] hover:bg-[#77642e]/20"
                  : "bg-white border-line text-ink-soft hover:text-ink"
              }`}
            >
              <Eye size={13} />
              <span>{isLiveCustomizerActive ? "Simulasi Mockup: AKTIF" : "Lihat Desain Asli"}</span>
            </button>

            {/* Thumbnail Preview Strip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeSlide === index
                        ? "border-[#D9534F] scale-105 shadow-xs"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`thumb ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Kanan: Kontrol Interaktif Live Customizer, Spesifikasi File, & CTA */}
        <div className="flex flex-col gap-4">
          {/* Header & Rating */}
          <div>
            <div className="flex items-center gap-2 text-xs text-ink-soft mb-1 flex-wrap">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-ink-soft/40">&bull;</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {product.salesCount || "340+ Terjual"}
              </span>
              <span className="text-ink-soft/70">
                ({product.reviewCount} ulasan)
              </span>
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740] leading-snug">
              {product.title}
            </h3>

            {/* Price Box */}
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="font-display text-2xl font-bold text-[#162740] font-mono">
                {formatIDR(product.price)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-ink-soft/60 line-through font-mono">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* KONTROL INTERAKTIF: LIVE BRAND CUSTOMIZER */}
          <div className="bg-[#FDFBF7] rounded-2xl border-2 border-[#77642e]/25 p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-dashed border-[#77642e]/20">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#162740]">
                <Palette size={15} className="text-[#D9534F]" />
                <span>Live Customizer Brand Anda</span>
              </div>
              <button
                type="button"
                onClick={handleResetCustomizer}
                className="text-[11px] text-ink-soft hover:text-[#D9534F] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                title="Reset nama & warna"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Input Text "Nama Usaha Anda" */}
            <div>
              <label className="block text-[11px] font-bold text-[#162740] mb-1">
                Nama Usaha Anda:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ketik nama resto / kafe Anda..."
                  maxLength={35}
                  className="w-full bg-white border border-[#77642e]/30 px-3.5 py-2 text-xs text-[#162740] font-semibold rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft/50 font-mono">
                  {brandName.length}/35
                </span>
              </div>
            </div>

            {/* 2. Color Picker (Pilihan Warna Palette F&B) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#162740]">
                  Palet Warna Brand F&amp;B:
                </label>
                <span className="text-[10px] font-mono text-ink-soft font-semibold">
                  HEX: {selectedColor.toUpperCase()}
                </span>
              </div>

              {/* Preset Swatches */}
              <div className="grid grid-cols-6 gap-1.5">
                {FNB_COLOR_PALETTES.map((palette) => {
                  const isSelected = selectedColor.toLowerCase() === palette.color.toLowerCase();
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setSelectedColor(palette.color)}
                      title={`${palette.name} (${palette.label})`}
                      className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs relative ${
                        isSelected
                          ? "ring-2 ring-offset-1 ring-[#162740] scale-105"
                          : "hover:scale-105 opacity-85 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: palette.color }}
                    >
                      {isSelected && (
                        <Check size={14} className="text-white drop-shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Picker Input */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-[#77642e]/15">
                <input
                  type="color"
                  id="custom-color-picker"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border border-[#77642e]/30 cursor-pointer p-0 bg-transparent shrink-0"
                />
                <label
                  htmlFor="custom-color-picker"
                  className="text-[11px] text-ink-soft hover:text-ink cursor-pointer flex items-center gap-1 font-medium"
                >
                  <Sliders size={12} />
                  <span>Pilih Warna Kustom Lainnya</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. Daftar Spesifikasi File */}
          <div className="bg-white rounded-2xl border border-[#77642e]/15 p-3.5 flex flex-col gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#162740] flex items-center gap-1.5 pb-1 border-b border-[#77642e]/15">
              <Sparkles size={12} className="text-[#D9534F]" />
              <span>Spesifikasi File Template</span>
            </h4>

            <div className="space-y-1.5 text-[11px]">
              {specifications.map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="p-1 rounded-md bg-[#77642e]/10 text-[#77642e] shrink-0 mt-0.5">
                      <Icon size={11} />
                    </div>
                    <div>
                      <span className="font-semibold text-[#162740]">
                        {spec.label}:{" "}
                      </span>
                      <span className="text-ink-soft">{spec.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Tombol CTA Langsung 'Tambah ke Keranjang' */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <Button
              type="button"
              variant={inCart ? "secondary" : "primary"}
              size="lg"
              fullWidth
              icon={inCart ? Check : ShoppingCart}
              onClick={handleAddToCart}
              className={`font-bold py-3.5 shadow-md hover:shadow-lg transition-all duration-300 text-sm rounded-xl cursor-pointer ${
                inCart
                  ? "!bg-basil/15 !text-basil !border-basil hover:!bg-basil/20"
                  : "!bg-[#D9534F] hover:!bg-[#c9433f] text-white"
              }`}
            >
              {inCart ? "Sudah di Keranjang (Tambah Lagi)" : "Tambah ke Keranjang"}
            </Button>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl border border-[#162740]/25 hover:border-[#162740] text-[#162740] bg-white hover:bg-[#FDFBF7] text-xs font-bold whitespace-nowrap shadow-2xs transition-all cursor-pointer"
            >
              <span>Detail</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
