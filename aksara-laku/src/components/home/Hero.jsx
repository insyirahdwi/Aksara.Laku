import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Flame,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import BrandLogo from "../common/BrandLogo";

// Animasi stagger untuk teks dan CTA kolom kiri
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Hero({ onExploreClick, onMatcherClick }) {
  return (
    <section className="bg-[#162740] text-white relative overflow-hidden border-b border-[#77642e]/20">
      {/* Subtle background texture / glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#77642e]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#D9534F]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Kolom Kiri: Headline, Value Proposition, 2 CTA Buttons (Stagger Fade-In) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left z-10"
        >
          {/* Brand Logo Resmi Aksara.Laku (Megah & Eksklusif) */}
          <motion.div variants={itemVariants} className="mb-6">
            <BrandLogo
              variant="light"
              size="hero"
              withLink={false}
              className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          {/* Badge Kategori */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide mb-5 backdrop-blur-xs shadow-xs"
          >
            <Sparkles size={14} className="text-[#E67E22]" />
            <span className="text-white">Pustaka Aset Digital F&amp;B No. 1 di Indonesia</span>
          </motion.div>

          {/* Headline Utama */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.15] mb-5 tracking-tight text-white"
          >
            Konten &amp; Branding F&amp;B, <span className="text-[#E67E22] italic">Siap Saji</span> Seperti Menu Andalanmu.
          </motion.h1>

          {/* Subteks Deskripsi */}
          <motion.p
            variants={itemVariants}
            className="text-white/85 text-base sm:text-lg mb-8 max-w-xl leading-relaxed font-light"
          >
            Kumpulan template Canva siap edit, branding kit komprehensif, kalender konten, dan naskah promosi praktis. Dirancang khusus bagi pemilik coffee shop, resto nusantara, bakery, hingga kedai boba untuk melipatgandakan omzet tanpa repot hire desainer.
          </motion.p>

          {/* Tombol CTA */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8">
            <a href="#catalog" onClick={onExploreClick} className="inline-block">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="!bg-[#D9534F] hover:!bg-[#c9433f] text-white font-bold shadow-lg shadow-[#D9534F]/30 cursor-pointer"
              >
                Jelajahi Aset
              </Button>
            </a>

            <a href="#matcher" onClick={onMatcherClick} className="inline-block">
              <Button
                variant="secondary"
                size="lg"
                icon={Sparkles}
                className="!border-white/40 !text-white hover:!bg-white hover:!text-[#162740] font-semibold shadow-sm cursor-pointer"
              >
                Coba Niche Matcher
              </Button>
            </a>
          </motion.div>

          {/* Value proposition badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-white/80 pt-2 border-t border-white/15 w-full"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#E67E22]" /> Edit Langsung di Canva Gratis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#E67E22]" /> Lisensi Komersial Permanen
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[#E67E22]" /> Unduh Instan Setelah Bayar
            </span>
          </motion.div>
        </motion.div>

        {/* Kolom Kanan: Collage / Grid Image Mockup F&B Tumpang Tindih (Floating Loops) */}
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none pt-4 sm:pt-6">
          {/* Ambient Glow behind collage */}
          <div className="absolute -top-6 -right-6 w-60 h-60 bg-[#D9534F]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-60 h-60 bg-[#E67E22]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Badge 1 (Atas Kiri): ✨ 100+ Template Siap Pakai */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3 left-2 sm:-top-4 sm:left-4 z-30 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-[#162740] font-extrabold text-xs sm:text-sm shadow-2xl border border-white/60 hover:scale-105 transition-transform"
          >
            <Sparkles size={16} className="text-[#E67E22]" />
            <span>✨ 100+ Template Siap Pakai</span>
          </motion.div>

          {/* Floating Badge 2 (Atas Kanan): 🔥 Khusus Industri F&B */}
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute -top-3 right-2 sm:-top-4 sm:right-4 z-30 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#D9534F] text-white font-extrabold text-xs sm:text-sm shadow-2xl shadow-[#D9534F]/40 hover:scale-105 transition-transform"
          >
            <Flame size={16} className="text-amber-300 fill-amber-300" />
            <span>🔥 Khusus Industri F&amp;B</span>
          </motion.div>

          {/* Collage Layout Container */}
          <div className="relative z-10 pt-4 pb-6">
            {/* 1. Main Central Card: Aesthetic Coffee & Cafe Menu Showcase */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl bg-white text-[#162740] p-4 sm:p-5 border-2 border-white/25 shadow-2xl overflow-hidden group transition-shadow duration-300 hover:shadow-black/50"
            >
              {/* Canva Window Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[10px] sm:text-xs font-mono font-bold text-gray-500">
                    CANVA PRO MOCKUP &bull; COFFEE SHOP KIT
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Export
                </span>
              </div>

              {/* Main Image Banner with gradient overlay */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                  alt="Aesthetic Coffee Shop Mockup"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#D9534F] w-max mb-1.5 shadow-sm">
                    Feed 1:1 &bull; 30-Day Planner
                  </span>
                  <h4 className="font-display text-base sm:text-xl font-bold leading-snug">
                    Artisan Coffee Shop &amp; Roastery Social Kit
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    Template feed, story countdown promo, &amp; menu standing board
                  </p>
                </div>
              </div>

              {/* Sub Mockup Footer */}
              <div className="mt-3.5 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-ink-soft">
                  <Palette size={15} className="text-[#77642e]" />
                  <span className="font-semibold text-ink">Format Canva &bull; Siap Pakai di HP &amp; PC</span>
                </div>
                <span className="font-bold text-emerald-600 font-mono">100% Editable</span>
              </div>
            </motion.div>

            {/* 2. Floating Overlapping Card (Top-Right / Tilted): Gourmet Burger & Bistro */}
            <motion.div
              animate={{ y: [7, -7, 7] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-4 -right-3 sm:-right-8 w-44 sm:w-56 rounded-2xl bg-white p-2.5 border-2 border-white shadow-2xl rotate-3 sm:rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20 hidden sm:block"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
                  alt="Gourmet Burger Menu Mockup"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 bg-[#162740]/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Katalog Menu Resto
                </div>
              </div>
              <div className="p-1.5">
                <p className="text-[11px] font-bold text-[#162740] truncate">Burger &amp; Bistro Menu Kit</p>
                <p className="text-[9px] text-emerald-600 font-semibold font-mono">Promo Cetak &amp; Digital</p>
              </div>
            </motion.div>

            {/* 3. Floating Overlapping Card (Bottom-Left / Tilted): Bakery & Pastry Kit */}
            <motion.div
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              className="absolute -bottom-6 -left-3 sm:-left-8 w-48 sm:w-60 rounded-2xl bg-white p-2.5 border-2 border-white shadow-2xl -rotate-3 sm:-rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
                  alt="Bakery Croissant Branding"
                  loading="lazy"
                  decoding="async"
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mb-0.5">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                    <span className="text-gray-400 font-normal">(97 ulasan)</span>
                  </div>
                  <p className="text-xs font-bold text-[#162740] truncate">Bakery Branding Kit</p>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Canva + AI Editable
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 4. Floating Rating & Social Proof Pill (Bottom-Right) */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 right-2 sm:right-4 z-30 inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#162740]/95 backdrop-blur-md text-white font-semibold text-xs border border-white/20 shadow-2xl hover:scale-105 transition-transform"
            >
              <div className="flex items-center text-amber-400">
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
                <Star size={13} className="fill-amber-400" />
              </div>
              <span className="font-bold text-xs text-white">4.9/5 dari 850+ Usaha F&amp;B</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
