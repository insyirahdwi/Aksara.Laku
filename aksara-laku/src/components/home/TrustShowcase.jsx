import {
  Coffee,
  UtensilsCrossed,
  Croissant,
  CupSoda,
  ChefHat,
  Store,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";

const FNB_NICHES = [
  {
    id: "coffee",
    name: "Coffee Shop & Kafe",
    subtext: "Feed minimalis, menu board & happy hour promo",
    icon: Coffee,
    badge: "340+ Klien",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    iconColor: "text-amber-700",
  },
  {
    id: "resto",
    name: "Resto & Rumah Makan",
    subtext: "Katalog menu cetak, promo paket & banner delivery",
    icon: UtensilsCrossed,
    badge: "520+ Klien",
    color: "bg-red-50 text-red-800 border-red-200",
    iconColor: "text-red-600",
  },
  {
    id: "bakery",
    name: "Bakery & Toko Roti",
    subtext: "Label stiker box, branding kit & konten musiman",
    icon: Croissant,
    badge: "280+ Klien",
    color: "bg-orange-50 text-orange-800 border-orange-200",
    iconColor: "text-orange-600",
  },
  {
    id: "beverage",
    name: "Boba & Minuman Segar",
    subtext: "Standing banner, promo BOGO & hook video Reels",
    icon: CupSoda,
    badge: "430+ Klien",
    color: "bg-sky-50 text-sky-800 border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    id: "catering",
    name: "Katering & Prasmanan",
    subtext: "Proposal digital PDF, portofolio & script WhatsApp",
    icon: ChefHat,
    badge: "190+ Klien",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    id: "streetfood",
    name: "Street Food & Warung",
    subtext: "Spanduk gerobak, poster menu & promo GoFood",
    icon: Store,
    badge: "310+ Klien",
    color: "bg-purple-50 text-purple-800 border-purple-200",
    iconColor: "text-purple-600",
  },
];

const TRUST_METRICS = [
  {
    value: "1.200+",
    label: "Usaha F&B Terbantu",
    desc: "Di 28+ kota di seluruh Indonesia",
    icon: Store,
  },
  {
    value: "4.9 / 5.0",
    label: "Skor Kepuasan Klien",
    desc: "Berdasarkan 850+ ulasan pemilik resto & kafe",
    icon: Star,
  },
  {
    value: "10 Menit",
    label: "Rata-rata Waktu Edit",
    desc: "Tinggal ganti teks & foto langsung dari HP",
    icon: Clock,
  },
  {
    value: "100%",
    label: "Lisensi Komersial Permanen",
    desc: "Bebas royalti seumur hidup tanpa biaya langganan",
    icon: ShieldCheck,
  },
];

export default function TrustShowcase() {
  return (
    <section className="bg-white border-b border-[#77642e]/15 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#77642e]/10 text-[#77642e] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Spesialisasi Industri F&amp;B</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold tracking-tight">
            Dirancang Khusus untuk Berbagai Niche Usaha F&amp;B
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-2 leading-relaxed">
            Bukan template grafis umum. Setiap aset disesuaikan dengan psikologi pelanggan kuliner,
            skema warna menggugah selera, dan struktur promosi siap closing.
          </p>
        </div>

        {/* Niche Icons / Logos Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12">
          {FNB_NICHES.map((niche) => {
            const Icon = niche.icon;
            return (
              <div
                key={niche.id}
                className="group p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/15 hover:border-[#D9534F]/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 shadow-2xs border ${niche.color}`}
                >
                  <Icon size={24} className={niche.iconColor} />
                </div>
                <h3 className="font-display text-xs sm:text-sm font-bold text-[#162740] group-hover:text-[#D9534F] transition-colors line-clamp-1">
                  {niche.name}
                </h3>
                <p className="text-[10px] text-ink-soft/75 mt-1 line-clamp-2 leading-snug">
                  {niche.subtext}
                </p>
                <span className="mt-3 text-[9px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  {niche.badge}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trust & Performance Metrics Banner */}
        <div className="rounded-3xl bg-[#162740] text-white p-6 sm:p-8 shadow-xl border border-[#77642e]/30 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9534F]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {TRUST_METRICS.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
                      <Icon size={16} />
                    </div>
                    <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#FDFBF7] font-mono tracking-tight">
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1">
                    {metric.label}
                  </p>
                  <p className="text-[11px] text-white/70 leading-snug">
                    {metric.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
