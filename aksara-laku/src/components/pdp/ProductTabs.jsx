import { useState } from "react";
import {
  PackageCheck,
  FileCode,
  HelpCircle,
  CheckCircle2,
  Download,
  Palette,
  FileText,
  Sheet,
} from "lucide-react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("deliverables");

  const tabs = [
    { id: "deliverables", label: "Apa yang Anda Dapatkan", icon: PackageCheck },
    { id: "formats", label: "Format File", icon: FileCode },
    { id: "usage", label: "Cara Pakai", icon: HelpCircle },
  ];

  return (
    <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 mt-8 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      {/* Tabs Header */}
      <div className="flex border-b border-line mb-6 overflow-x-auto scrollbar-none gap-2 sm:gap-6">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 pb-3.5 px-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ease-in-out cursor-pointer ${
                isActive
                  ? "border-chili text-chili font-bold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Apa yang Anda Dapatkan */}
      {activeTab === "deliverables" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            Setiap pembelian paket ini menyertakan seluruh aset digital berikut dengan akses instan tanpa biaya langganan tambahan:
          </p>

          <div className="grid sm:grid-cols-2 gap-3.5 mt-2">
            {(product.packageContents || [
              "30 Template Canva Feed (1:1 & 4:5)",
              "15 Template Instagram Story (9:16)",
              "Naskah Copywriting Promosi Siap Pakai",
              "Kalender Konten 30 Hari Terstruktur",
              "Panduan Pemilihan Font & Palet Warna",
              "Lisensi Komersial Permanen",
            ]).map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-paper-dim/60 border border-line/80 transition-all duration-300 ease-in-out hover:bg-paper-dim/80"
              >
                <CheckCircle2 size={18} className="text-basil shrink-0 mt-0.5" />
                <span className="text-sm text-ink font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-turmeric/10 border border-turmeric/30 flex items-center justify-between text-xs text-ink">
            <span className="flex items-center gap-2 font-medium">
              <Download size={15} className="text-turmeric-dark" />
              Tautan unduh otomatis dikirim via email &amp; tersimpan di menu My Library.
            </span>
            <span className="font-bold text-turmeric-dark">Permanen</span>
          </div>
        </div>
      )}

      {/* Tab 2: Format File */}
      {activeTab === "formats" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-ink-soft">
            Aset didesain agar fleksibel dan dapat diedit oleh siapa saja tanpa memerlukan software berbayar atau keahlian desain rumit:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-line bg-paper-dim/50 flex flex-col gap-2 transition-all duration-300 ease-in-out hover:shadow-xs">
              <div className="flex items-center gap-2 text-chili font-bold text-sm">
                <Palette size={18} />
                <span>Canva Template (Free &amp; Pro)</span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Tautan template resmi Canva. Buka langsung di browser atau aplikasi Canva di smartphone Anda. Semua elemen, teks, font, dan foto 100% bisa diganti.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-paper-dim/50 flex flex-col gap-2 transition-all duration-300 ease-in-out hover:shadow-xs">
              <div className="flex items-center gap-2 text-turmeric-dark font-bold text-sm">
                <FileText size={18} />
                <span>PDF &amp; Dokumen Word (.docx)</span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Naskah copywriting, caption bank, dan script balasan WhatsApp dalam format PDF rapi serta file Word yang bisa langsung di-copy-paste.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-paper-dim/50 flex flex-col gap-2 transition-all duration-300 ease-in-out hover:shadow-xs">
              <div className="flex items-center gap-2 text-basil font-bold text-sm">
                <Sheet size={18} />
                <span>Google Sheets &amp; Excel (.xlsx)</span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Kalender perencanaan jadwal posting harian, kolom ide konten, serta tracker performa promosi yang mudah dikelola bersama tim.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-paper-dim/50 flex flex-col gap-2 transition-all duration-300 ease-in-out hover:shadow-xs">
              <div className="flex items-center gap-2 text-ink font-bold text-sm">
                <FileCode size={18} />
                <span>High-Res PNG / JPG / PSD Ready</span>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed">
                Semua desain diekspor dengan resolusi tajam (300 DPI) yang siap dicetak untuk daftar menu, brosur, standing banner, dan display kasir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cara Pakai */}
      {activeTab === "usage" && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-ink-soft">
            Hanya butuh 4 langkah mudah untuk mulai menggunakan aset ini dalam strategi promosi F&amp;B Anda:
          </p>

          <ol className="relative border-l-2 border-line/80 ml-3 space-y-6 my-2">
            <li className="ml-6">
              <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 bg-chili text-paper rounded-full text-xs font-bold ring-4 ring-paper">
                1
              </span>
              <h4 className="font-semibold text-sm text-ink mb-1">
                Selesaikan Pembayaran &amp; Buka Tautan
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Setelah pembayaran sukses, Anda akan menerima link akses Canva dan link download bundle PDF di halaman terima kasih serta email Anda.
              </p>
            </li>

            <li className="ml-6">
              <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 bg-turmeric text-ink rounded-full text-xs font-bold ring-4 ring-paper">
                2
              </span>
              <h4 className="font-semibold text-sm text-ink mb-1">
                Buka &amp; Duplikasi Template di Canva
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Klik tombol "Use Template" pada Canva. Template akan otomatis disalin ke akun Canva pribadi Anda (baik akun gratis maupun Pro).
              </p>
            </li>

            <li className="ml-6">
              <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 bg-basil text-paper rounded-full text-xs font-bold ring-4 ring-paper">
                3
              </span>
              <h4 className="font-semibold text-sm text-ink mb-1">
                Kustomisasi Sesuai Menu &amp; Brand Usaha
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Ganti foto produk dengan menu makanan/minuman Anda, sesuaikan harga promo, dan masukkan logo bisnis kuliner Anda.
              </p>
            </li>

            <li className="ml-6">
              <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 bg-ink text-paper rounded-full text-xs font-bold ring-4 ring-paper">
                4
              </span>
              <h4 className="font-semibold text-sm text-ink mb-1">
                Unduh &amp; Publikasikan Langsung
              </h4>
              <p className="text-xs text-ink-soft leading-relaxed">
                Ekspor dalam format JPG/PNG/MP4 lalu upload langsung ke Instagram Feed, Stories, Reels, TikTok, atau status WhatsApp bisnis.
              </p>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
