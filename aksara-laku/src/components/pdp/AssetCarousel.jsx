import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Badge from "../common/Badge";

export default function AssetCarousel({ product }) {
  // Generate multi-slide mockup gallery based on product details and high-res gallery
  const gallery = product.gallery && product.gallery.length > 0
    ? [
        {
          url: product.gallery[0] || product.thumbnail,
          label: "Preview Utama Aset & Mockup",
          badge: "Utama",
        },
        {
          url: product.gallery[1] || product.thumbnail,
          label: "Mockup Feed Instagram (Rasio 1:1)",
          badge: "Feed 1:1",
        },
        {
          url: product.gallery[2] || product.thumbnail,
          label: "Mockup Instagram & TikTok Story (Rasio 9:16)",
          badge: "Story 9:16",
        },
        {
          url: product.gallery[3] || product.thumbnail,
          label: "Mockup Promo Menu & Banner Cetak",
          badge: "Cetak & Banner",
        },
      ]
    : [
        {
          url: product.thumbnail,
          label: "Preview Utama Aset",
          badge: "Utama",
        },
        {
          url: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80`,
          label: "Mockup Tampilan Feed Instagram",
          badge: "Feed 1:1",
        },
        {
          url: `https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80`,
          label: "Mockup Instagram & TikTok Story",
          badge: "Story 9:16",
        },
        {
          url: `https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80`,
          label: "Mockup Promo Menu & Cetak",
          badge: "Cetak & Banner",
        },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  // Keyboard shortcut listener: Escape to close preview modal, Arrow keys to cycle
  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPreviewOpen, gallery.length]);

  const currentItem = gallery[currentIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Preview Slide */}
      <div
        className="rounded-2xl border border-[#77642e]/20 bg-white overflow-hidden relative aspect-[4/3] sm:aspect-square group select-none shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-zoom-in"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={currentItem.url}
          alt={`${product.title} - ${currentItem.label}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
          <Badge tone="turmeric" className="shadow-sm font-semibold text-xs">
            {currentItem.badge}
          </Badge>
          <span className="bg-ink/80 text-paper text-[11px] font-medium px-2 py-0.5 rounded-sm backdrop-blur-sm">
            {currentIndex + 1} / {gallery.length}
          </span>
        </div>

        {/* Zoom / Preview Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-ink text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-[#77642e]/20 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
            title="Klik untuk perbesar preview (Esc untuk menutup)"
          >
            <Maximize2 size={13} className="text-[#D9534F]" />
            <span>Perbesar Preview</span>
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Slide sebelumnya"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-ink border border-[#77642e]/20 flex items-center justify-center shadow-md hover:bg-white hover:text-chili transition-all duration-300 ease-in-out cursor-pointer z-10"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Slide berikutnya"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-ink border border-[#77642e]/20 flex items-center justify-center shadow-md hover:bg-white hover:text-chili transition-all duration-300 ease-in-out cursor-pointer z-10"
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/85 via-ink/50 to-transparent p-4 text-white flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium">{currentItem.label}</p>
          <span className="text-[11px] text-white/75 font-mono hidden sm:inline">
            Klik gambar untuk perbesar
          </span>
        </div>
      </div>

      {/* Thumbnails Strip */}
      <div className="grid grid-cols-4 gap-2.5">
        {gallery.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out cursor-pointer ${
                isActive
                  ? "border-chili ring-2 ring-chili/30 opacity-100 scale-[0.98] shadow-sm"
                  : "border-line hover:border-ink-soft opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-0 inset-x-0 bg-ink/75 text-white text-[9px] text-center font-bold py-0.5 truncate px-1">
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modal Preview Produk: Tutup jika pengguna menekan Esc atau klik backdrop overlay */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsPreviewOpen(false)}
          role="presentation"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#77642e]/25 transition-all duration-300 ease-in-out flex flex-col max-h-[92vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Preview Produk"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Preview */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-[#77642e]/20 bg-[#FDFBF7]">
              <div>
                <h3 className="font-display text-lg sm:text-xl text-[#162740] font-bold">
                  {product.title}
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  {currentItem.label} &bull; Mockup Canva ({currentIndex + 1} dari {gallery.length})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-xl text-ink-soft hover:text-[#D9534F] hover:bg-white transition-all cursor-pointer"
                title="Tutup preview (Esc)"
                aria-label="Tutup preview (Esc)"
              >
                <X size={22} />
              </button>
            </div>

            {/* Media Viewer */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#162740]/5 flex items-center justify-center overflow-hidden p-4">
              <img
                src={currentItem.url}
                alt={currentItem.label}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain rounded-xl shadow-md"
              />

              {/* Prev / Next Nav Buttons */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Slide sebelumnya"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-ink hover:bg-white hover:text-[#D9534F] flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slide berikutnya"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-ink hover:bg-white hover:text-[#D9534F] flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Bottom Bar */}
            <div className="p-3.5 bg-[#FDFBF7] border-t border-dashed border-[#77642e]/20 flex items-center justify-center gap-2.5 overflow-x-auto">
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shrink-0 ${
                    idx === currentIndex
                      ? "border-[#D9534F] ring-2 ring-[#D9534F]/30 scale-105 shadow-sm"
                      : "border-[#77642e]/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={item.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
