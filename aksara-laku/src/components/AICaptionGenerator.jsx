import { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RotateCcw,
  MessageSquareQuote,
  Flame,
  CheckCircle2,
  Tag,
  Smile,
  Loader2,
} from "lucide-react";
import { useToast } from "./common/Toast";
import Button from "./common/Button";

const PROMO_OPTIONS = [
  { id: "Diskon", label: "Diskon / Promo Hemat", icon: Tag },
  { id: "Launching", label: "Launching Menu Baru", icon: Flame },
  { id: "Weekend Promo", label: "Weekend Special / Santai", icon: Smile },
  { id: "Bundling", label: "Paket Bundling Hemat", icon: Sparkles },
];

const TONE_OPTIONS = [
  { id: "Santai", label: "Santai & Friendly", desc: "Bahasa gaul, akrab, seru" },
  { id: "Aesthetic", label: "Aesthetic & Poetic", desc: "Puitis, hangat, artisan" },
  { id: "Persuasif", label: "Persuasif & FOMO", desc: "Mendorong langsung pesan" },
];

const QUICK_PRESETS = [
  "Es Kopi Susu Gula Aren",
  "Almond Butter Croissant",
  "Smash Beef Gourmet Burger",
  "Artisan Matcha Latte",
  "Ayam Bakar Madu Nusantara",
];

export default function AICaptionGenerator() {
  const { showToast } = useToast();

  // Form states
  const [menuName, setMenuName] = useState("Es Kopi Susu Gula Aren");
  const [promoType, setPromoType] = useState("Diskon");
  const [tone, setTone] = useState("Aesthetic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Generate captions based on inputs
  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!menuName.trim()) {
      showToast("Harap masukkan nama menu F&B terlebih dahulu!", "warning");
      return;
    }

    setIsGenerating(true);
    setCopiedIndex(null);

    // Realistic processing delay for AI feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const name = menuName.trim();

    // Contextual Hashtags
    const slugName = name.replace(/[^a-zA-Z0-9]/g, "");
    const baseTags = [
      `#${slugName}`,
      "#KulinerIndonesia",
      "#FoodPorn",
      "#JktFoodBang",
      "#FoodiesID",
      "#RekomendasiKuliner",
      "#MakanEnak",
      promoType === "Diskon"
        ? "#PromoKuliner #DiskonMakanan"
        : promoType === "Launching"
        ? "#MenuBaru #NewMenuAlert"
        : "#WeekendVibes #NongkrongAsik",
    ].join(" ");

    let options = [];

    if (tone === "Santai") {
      options = [
        {
          title: "Opsi 1: Relatable & Casual Hook",
          toneLabel: "Santai & Ramah",
          content: `Lagi butuh asupan mood booster hari ini? Kenalin nih: ${name} yang siap nemenin harimu biar nggak suntuk lagi! ✨\n\nRasanya tuh pas banget, manisnya nggak lebay dan wanginya auto bikin nagih. Apalagi pas lagi ada ${promoType} spesial buat kamu minggu ini. Masa iya mau kamu lewatin gitu aja? 👀\n\nYuk mampir ke outlet atau tinggal sat-set order lewat aplikasi online kesayanganmu sekarang juga! Siapa yang mau kamu ajak nyobain bareng? Tag orangnya di komen ya! 👇\n\n${baseTags}`,
        },
        {
          title: "Opsi 2: Singkat & Nendang (Story/Reels Hook)",
          toneLabel: "Story Hook",
          content: `Definisi bahagia sederhana: ketemu ${name} yang dingin & seger pas cuaca lagi terik-teriknya. 🤤\n\nKabar baiknya, spesial ${promoType}, kamu bisa dapetin menu ini dengan penawaran paling cuan! Jangan sampai kehabisan, langsung amankan sebelum jam istirahat yaa!\n\n🛵 Tersedia di GrabFood / GoFood / ShopeeFood\n📍 Dine-in & Takeaway ready\n\n${baseTags}`,
        },
        {
          title: "Opsi 3: Interaktif & Ajak Teman",
          toneLabel: "Engagement Booster",
          content: `Jujur, dari skala 1 sampai 10, seberapa butuh kamu sama ${name} sekarang? 🙋‍♂️\n\nDaripada cuma ngebayangin di feed, mending langsung checkout sekarang! Mumpung ada promo ${promoType} yang bikin jajan tetep aman di dompet.\n\nKlik link di bio buat order instan atau langsung serbu outlet terdekat sebelum kehabisan kuota promo hari ini ya gengs! 🔥\n\n${baseTags}`,
        },
      ];
    } else if (tone === "Aesthetic") {
      options = [
        {
          title: "Opsi 1: Warm & Sensory Storytelling",
          toneLabel: "Aesthetic Artisan",
          content: `Ada cerita di balik setiap racikan ${name}.\n\nPerpaduan bahan pilihan yang diproses dengan dedikasi penuh, menghadirkan aroma yang menenangkan dan cita rasa lembut di setiap sesapan. Sebuah jeda yang pantas kamu nikmati di tengah riuhnya harimu. 🍃\n\nDalam rangka merayakan ${promoType}, kami mempersembahkan menu istimewa ini untuk menemani momen santaimu hari ini. Luangkan waktu sejenak, dan biarkan kehangatan rasa menyapa.\n\n✨ Tersedia untuk dine-in & takeaway\n${baseTags}`,
        },
        {
          title: "Opsi 2: Minimalist & Poetic",
          toneLabel: "Minimalist Poetry",
          content: `Secangkir ketenangan, seribu keteduhan rasa.\n\n${name} hadir bukan sekadar pengisi hari, melainkan teman berbincang dan pereda lelah yang paling jujur. ☕\n\nSpesial momen ${promoType}, mari bersua dan rasakan pengalaman rasa yang tak terlupakan di sudut nyaman kami.\n\nSampai bertemu di meja favoritmu.\n\n${baseTags}`,
        },
        {
          title: "Opsi 3: Visual & Flavor Focus",
          toneLabel: "Cozy Ambiance",
          content: `Warna keemasan, tekstur yang lembut, dan sentuhan rasa yang membekas indah. Inilah ${name}.\n\nDirancang khusus bagi kamu yang mengapresiasi kualitas rasa dan keindahan momen. Jangan lewatkan kesempatan istimewa dalam promo ${promoType} kali ini.\n\nSimpan postingan ini untuk kunjungan serumu akhir pekan nanti, atau pesan langsung ke mejamu hari ini. 🤍\n\n${baseTags}`,
        },
      ];
    } else {
      // Persuasif & Hard Selling
      options = [
        {
          title: "Opsi 1: Urgency & High Conversion (FOMO)",
          toneLabel: "Hard Selling & FOMO",
          content: `🚨 JANGAN SAMPAI NYESEL KETINGGALAN! 🚨\n\nSpesial promo ${promoType}! Kamu bisa nikmati ${name} terbaik dengan penawaran harga paling heboh yang pernah ada!\n\nKenapa harus coba sekarang?\n✅ Cita rasa signature yang sudah dibuktikan ribuan pelanggan\n✅ Dibuat dari bahan baku premium dan fresh setiap hari\n✅ Promo TERBATAS hanya untuk 50 pemesan pertama hari ini!\n\nAmbil promo sebelum kehabisan! Klik link di bio akun kami sekarang juga atau kirim DM: "MAU PROMO ${name.toUpperCase()}"! ⚡\n\n${baseTags}`,
        },
        {
          title: "Opsi 2: Problem - Agitate - Solution (PAS)",
          toneLabel: "Formula Copywriting PAS",
          content: `Lagi suntuk kerjaan numpuk tapi tenggorokan kering dan butuh yang seger-seger? Jangan biarkan harimu makin drop!\n\nSolusinya cuma satu: ${name} yang manis, gurih, dan segarnya bikin semangat balik 100%! 🚀\n\nKabar baiknya: lagi ada promo ${promoType}! Hemat sampai puas, kenyang tanpa bikin kantong tipis.\n\nPesan sekarang via link di bio sebelum jam istirahat selesai! Pesan 2 lebih hemat buat traktiran temen kantor!\n\n${baseTags}`,
        },
        {
          title: "Opsi 3: Direct Call-To-Action (Promo Khusus)",
          toneLabel: "Direct Action",
          content: `PROMO SPESIAL: ${name} Siap Meluncur ke Meja Kamu! 📦✨\n\nBuat kamu yang cari teman makan/ngemil paling pas, ini saat yang paling tepat. Kami siapkan penawaran ${promoType} eksklusif untuk hari ini saja.\n\nCara dapetin promonya gampang banget:\n1. Follow akun @kami\n2. Tunjukkan postingan ini ke kasir / masukkan kode kupon di aplikasi\n3. Nikmati lezatnya ${name}!\n\nYuk pesan sekarang sebelum antrean makin panjang!\n\n${baseTags}`,
        },
      ];
    }

    setGeneratedCaptions(options);
    setIsGenerating(false);
    showToast("3 Opsi Caption AI berhasil diracik! Silakan pilih & salin.", "success");
  };

  const handleCopyCaption = (text, index) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedIndex(index);
          showToast("Caption Instagram berhasil disalin ke clipboard! ✨", "success");
          setTimeout(() => {
            setCopiedIndex((prev) => (prev === index ? null : prev));
          }, 2500);
        })
        .catch(() => {
          showToast("Caption berhasil disalin! ✨", "success");
        });
    } else {
      showToast("Caption berhasil disalin! ✨", "success");
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FDFBF7] border-y border-[#77642e]/15 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D9534F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162740] text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Wand2 size={13} className="text-[#E67E22]" />
            <span>AI Copywriting Studio</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#162740] tracking-tight mb-2">
            AI Caption Generator untuk Bisnis F&amp;B
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            Kehabisan ide caption promosi? Masukkan nama menu Anda, pilih jenis promo, dan biarkan sistem AI kami meracik naskah Instagram estetik siap posting dalam hitungan detik.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-[#77642e]/20 p-6 sm:p-8 shadow-md mb-8">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            {/* 1. Input Nama Menu F&B */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#162740] mb-2">
                1. Nama Menu F&amp;B Andalan:
              </label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="Contoh: Es Kopi Gula Aren, Croissant Nutella, Ayam Bakar Taliwang..."
                className="w-full bg-[#FDFBF7] border border-[#77642e]/25 px-4 py-3 text-sm text-[#162740] placeholder:text-ink-soft/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent transition-all"
                required
              />

              {/* Quick Sample Presets */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                <span className="text-[11px] text-ink-soft/70 font-medium mr-1">
                  Pilihan Cepat:
                </span>
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMenuName(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      menuName === preset
                        ? "bg-[#77642e]/15 border-[#77642e] text-[#162740] font-bold"
                        : "bg-white hover:bg-paper-dim border-[#77642e]/20 text-ink-soft"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pilihan Jenis Promosi */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#162740] mb-2">
                2. Jenis Promosi:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PROMO_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = promoType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPromoType(opt.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#D9534F] text-white border-[#D9534F] shadow-sm scale-101"
                          : "bg-[#FDFBF7] hover:bg-white text-ink-soft border-[#77642e]/20"
                      }`}
                    >
                      <Icon size={14} className={isSelected ? "text-white" : "text-[#77642e]"} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Pilihan Tone of Voice */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#162740] mb-2">
                3. Tone of Voice (Gaya Bahasa):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TONE_OPTIONS.map((t) => {
                  const isSelected = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                        isSelected
                          ? "bg-[#162740] text-white border-[#162740] shadow-sm scale-101"
                          : "bg-[#FDFBF7] hover:bg-white text-[#162740] border-[#77642e]/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm">{t.label}</span>
                        {isSelected && <CheckCircle2 size={15} className="text-[#E67E22]" />}
                      </div>
                      <span
                        className={`text-[11px] ${
                          isSelected ? "text-white/80" : "text-ink-soft/70"
                        }`}
                      >
                        {t.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Tombol Generate Caption AI */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isGenerating}
                className="py-4 bg-[#D9534F] hover:bg-[#c9433f] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin text-white" />
                    <span>AI Sedang Meracik 3 Opsi Caption Estetik...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles size={18} className="text-amber-300" />
                    <span>Generate Caption AI Sekarang &rarr;</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* 5. Tampilan Hasil 3 Opsi Caption AI */}
        {generatedCaptions && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740] flex items-center gap-2">
                <MessageSquareQuote size={20} className="text-[#D9534F]" />
                <span>3 Opsi Caption Instagram Siap Posting</span>
              </h3>
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 text-xs text-[#77642e] hover:text-[#162740] font-bold underline cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Generate Ulang</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {generatedCaptions.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#77642e]/20 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-dashed border-[#77642e]/15">
                      <span className="text-[11px] font-bold text-[#D9534F] bg-[#D9534F]/10 px-2 py-0.5 rounded-md">
                        {item.toneLabel}
                      </span>
                      <span className="text-[10px] font-mono text-ink-soft/70">
                        Opsi #{index + 1}
                      </span>
                    </div>

                    {/* Konten Naskah Caption */}
                    <p className="text-xs text-ink leading-relaxed whitespace-pre-line font-sans select-all bg-[#FDFBF7] p-3.5 rounded-xl border border-[#77642e]/10 mb-4 max-h-72 overflow-y-auto scrollbar-thin">
                      {item.content}
                    </p>
                  </div>

                  {/* Tombol Salin Caption */}
                  <button
                    type="button"
                    onClick={() => handleCopyCaption(item.content, index)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-2xs ${
                      copiedIndex === index
                        ? "bg-basil/15 border border-basil text-basil"
                        : "bg-[#162740] hover:bg-[#162740]/90 text-white"
                    }`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={14} className="text-basil" />
                        <span>Caption Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-amber-300" />
                        <span>Salin Caption Lengkap</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
