import { useState } from "react";
import {
  ShoppingBag,
  Star,
  Store,
  Sparkles,
  CheckCircle2,
  XCircle,
  MoveHorizontal,
  Coffee,
  UtensilsCrossed,
  Cake,
} from "lucide-react";

const COMPARISON_ITEMS = [
  {
    id: "cafe-feed",
    title: "Feed Instagram & Promosi Coffee Shop",
    niche: "Coffee Shop",
    icon: Coffee,
    before: {
      image:
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=40",
      tag: "Sebelum: Foto HP Biasa",
      title: "Tanpa Identitas Brand",
      points: [
        "Pencahayaan redup dan tanpa grid terencana",
        "Font sistem standar yang kaku dan monoton",
        "Waktu pembuatan 3-4 jam per postingan",
        "Tingkat likes & interaksi pelanggan rendah",
      ],
    },
    after: {
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      tag: "Sesudah: Aksara.Laku Standard",
      title: "Artisan Aesthetic Agency",
      points: [
        "Palet warna hangat khas coffee shop estetik",
        "Tipografi berkelas dengan highlight menu & promo",
        "Edit cepat di Canva dalam waktu 10 menit",
        "Meningkatkan impresi dan daya tarik pelanggan",
      ],
    },
  },
  {
    id: "resto-menu",
    title: "Buku Menu & Promo Restoran / Bistro",
    niche: "Restoran & Bistro",
    icon: UtensilsCrossed,
    before: {
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=40",
      tag: "Sebelum: Menu Polos & Berjejal",
      title: "Susah Dibaca Pelanggan",
      points: [
        "Daftar menu padat tanpa hierarki visual",
        "Foto menu terpotong dan tidak menggugah selera",
        "Sulit menonjolkan menu terlaris (signature)",
        "Tampilan terlihat seperti warung fotokopian",
      ],
    },
    after: {
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      tag: "Sesudah: Aksara.Laku Standard",
      title: "Katalog Menu Menggugah Selera",
      points: [
        "Tata letak bersih dengan 'Chef Recommendation' badge",
        "Foto gourmet high-res yang menaikkan selera makan",
        "Mendorong pemesanan menu signature beromzet tinggi",
        "Siap cetak & siap share via WhatsApp / Instagram",
      ],
    },
  },
  {
    id: "bakery-story",
    title: "Story & Flash Sale Artisan Bakery",
    niche: "Artisan Bakery",
    icon: Cake,
    before: {
      image:
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=40",
      tag: "Sebelum: Story Cepat Sederhana",
      title: "Kurang Menarik Perhatian",
      points: [
        "Stiker bawaan Instagram yang bertumpuk acak",
        "Informasi diskon dan batas waktu tidak terbaca",
        "Warna kontras yang melelahkan mata audiens",
        "Banyak penonton langsung 'swipe next' (skip)",
      ],
    },
    after: {
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      tag: "Sesudah: Aksara.Laku Standard",
      title: "Story Konversi Tinggi (Urgency)",
      points: [
        "Frame estetik dengan countdown & badge 'Fresh Baked'",
        "Hierarki harga diskon yang langsung mencuri fokus",
        "Hook naskah copywriting siap pakai yang memicu FOMO",
        "Konversi DM dan pesanan langsung melonjak",
      ],
    },
  },
];

export default function VisualImpact() {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100

  const currentItem = COMPARISON_ITEMS[activeTab];

  return (
    <section className="bg-white py-16 sm:py-24 border-y border-[#77642e]/15 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D9534F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#77642e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#77642e]/10 border border-[#77642e]/20 text-[#77642e] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#D9534F]" />
            <span>Visual Impact &amp; Transformasi F&amp;B</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#162740] font-bold tracking-tight mb-4 leading-tight">
            Perbandingan Nyata: Sebelum &amp; Sesudah Sentuhan Aksara.Laku
          </h2>
          <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
            Perbedaan visual bukan hanya soal estetika &mdash; ini adalah pembeda antara promosi yang dilewati begitu saja dan promosi yang langsung mendatangkan pesanan.
          </p>
        </div>

        {/* 1. Counter Statistik: '500+ Aset Terjual', '4.9/5 Rating Kepuasan', '100+ UMKM F&B Terbantu' */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16">
          {/* Counter 1 */}
          <div className="bg-[#FDFBF7] rounded-2xl border border-[#77642e]/20 p-6 sm:p-7 flex items-center gap-5 shadow-xs hover:shadow-md hover:border-[#77642e]/40 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/20 flex items-center justify-center text-[#D9534F] shrink-0 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#162740] tracking-tight">
                500+
              </p>
              <p className="text-sm font-bold text-[#D9534F] mt-0.5">
                Aset Terjual
              </p>
              <p className="text-xs text-ink-soft/80 mt-1">
                Template Canva, naskah promo &amp; branding kit
              </p>
            </div>
          </div>

          {/* Counter 2 */}
          <div className="bg-[#FDFBF7] rounded-2xl border border-[#77642e]/20 p-6 sm:p-7 flex items-center gap-5 shadow-xs hover:shadow-md hover:border-[#77642e]/40 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-[#E67E22]/10 border border-[#E67E22]/20 flex items-center justify-center text-[#E67E22] shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Star size={28} className="fill-[#E67E22]" />
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#162740] tracking-tight">
                4.9 / 5
              </p>
              <p className="text-sm font-bold text-[#E67E22] mt-0.5">
                Rating Kepuasan
              </p>
              <p className="text-xs text-ink-soft/80 mt-1">
                Berdasarkan review terverifikasi pemilik bisnis
              </p>
            </div>
          </div>

          {/* Counter 3 */}
          <div className="bg-[#FDFBF7] rounded-2xl border border-[#77642e]/20 p-6 sm:p-7 flex items-center gap-5 shadow-xs hover:shadow-md hover:border-[#77642e]/40 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-basil/10 border border-basil/20 flex items-center justify-center text-basil shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Store size={28} />
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-[#162740] tracking-tight">
                100+
              </p>
              <p className="text-sm font-bold text-basil mt-0.5">
                UMKM F&amp;B Terbantu
              </p>
              <p className="text-xs text-ink-soft/80 mt-1">
                Kafe, bakery, resto nusantara &amp; street food
              </p>
            </div>
          </div>
        </div>

        {/* 2. Skenario Tab Switcher */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {COMPARISON_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(index);
                  setSliderPosition(50);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#162740] text-white shadow-md ring-2 ring-[#162740]/25 scale-102"
                    : "bg-[#FDFBF7] text-ink-soft hover:bg-white border border-[#77642e]/20 hover:border-[#77642e]/40"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#E67E22]" : "text-[#77642e]"} />
                <span>{item.niche}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Interactive Split Comparison Slider Box */}
        <div className="bg-[#FDFBF7] rounded-3xl border border-[#77642e]/20 p-5 sm:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-[#77642e]/15">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9534F]">
                Kasus Nyata: {currentItem.niche}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#162740] mt-0.5">
                {currentItem.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-soft bg-white px-3.5 py-1.5 rounded-xl border border-[#77642e]/20">
              <MoveHorizontal size={15} className="text-[#77642e]" />
              <span>Geser slider untuk melihat transformasi</span>
            </div>
          </div>

          {/* The Interactive Visual Slider Canvas */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-[#77642e]/20 select-none">
            {/* 1. AFTER Image (Full Background) */}
            <img
              src={currentItem.after.image}
              alt={currentItem.after.tag}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* AFTER Badge Overlay */}
            <div className="absolute top-4 right-4 z-10 bg-[#162740]/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AFTER (Aksara.Laku Agency)</span>
            </div>

            {/* 2. BEFORE Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentItem.before.image}
                alt={currentItem.before.tag}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-90"
                style={{
                  width: "100%",
                  minWidth: "100%",
                  height: "100%",
                }}
              />
              {/* BEFORE Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>BEFORE (Foto Polos Biasa)</span>
              </div>
            </div>

            {/* 3. Divider Line & Draggable Knob */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] relative">
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#162740] shadow-xl border-2 border-[#162740] flex items-center justify-center text-xs font-bold">
                  <MoveHorizontal size={18} />
                </div>
              </div>
            </div>

            {/* 4. Invisible Range Input Covering the Container for Smooth Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Geser untuk membandingkan Before dan After"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          {/* Quick Slider Preset Controls */}
          <div className="flex items-center justify-between mt-4 px-1">
            <button
              type="button"
              onClick={() => setSliderPosition(20)}
              className="text-xs font-semibold text-ink-soft hover:text-[#162740] transition-colors cursor-pointer"
            >
              &larr; Fokus Before (20%)
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSliderPosition(50)}
                className="px-3 py-1 bg-white hover:bg-paper-dim border border-[#77642e]/30 rounded-lg text-xs font-bold text-[#162740] shadow-2xs transition-all cursor-pointer"
              >
                Tengah (50:50)
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSliderPosition(80)}
              className="text-xs font-semibold text-[#D9534F] hover:underline transition-colors cursor-pointer"
            >
              Fokus After (80%) &rarr;
            </button>
          </div>

          {/* 4. Detail Breakdown Cards: Sebelum vs Sesudah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-8 border-t border-[#77642e]/15">
            {/* Card Before */}
            <div className="p-5 rounded-2xl bg-white border border-line flex flex-col">
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-2">
                <XCircle size={16} />
                <span>SEBELUM MENGGUNAKAN AKSARA.LAKU</span>
              </div>
              <h4 className="font-display text-lg font-bold text-[#162740] mb-3">
                {currentItem.before.title}
              </h4>
              <ul className="space-y-2 mt-auto">
                {currentItem.before.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-ink-soft"
                  >
                    <span className="text-red-500 mt-0.5">&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card After */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#D9534F]/30 shadow-xs flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#D9534F]/10 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-bold text-basil mb-2">
                <CheckCircle2 size={16} className="text-basil" />
                <span>SESUDAH SENTUHAN TEMPLATE KAMI</span>
              </div>
              <h4 className="font-display text-lg font-bold text-[#162740] mb-3">
                {currentItem.after.title}
              </h4>
              <ul className="space-y-2 mt-auto">
                {currentItem.after.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-ink font-medium"
                  >
                    <CheckCircle2 size={13} className="text-basil shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
