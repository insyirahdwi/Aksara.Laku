import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  Eye,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";
import { formatIDR } from "../utils/helpers";
import SEOHead from "../components/common/SEOHead";

const INITIAL_FORM = {
  title: "",
  category: "Coffee Shop",
  niche: "Coffee Shop",
  type: "Canva Template",
  price: 49000,
  originalPrice: 99000,
  formatBadge: "Canva Editable",
  categoryBadge: "Feed IG & Story",
  thumbnail:
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  canvaUrl: "https://canva.com/templates/aksara-laku-new-asset",
  description: "",
  packageContents: "15 template Canva feed & story\nPanduan edit font & palet warna",
};

const NICHE_OPTIONS = [
  "Coffee Shop",
  "Resto Nusantara",
  "Bakery & Pastry",
  "Street Food",
  "Beverage/Boba",
];

const TYPE_OPTIONS = [
  "Canva Template",
  "Content Planner",
  "Branding Kit",
  "Menu Mockup",
  "Social Media Kit",
];

export default function AdminUpload() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState([
    {
      id: "upl-001",
      title: "Artisan Roastery Special Edition 2026",
      niche: "Coffee Shop",
      type: "Canva Template",
      price: 59000,
      createdAt: new Date().toLocaleDateString("id-ID"),
      status: "Published",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "originalPrice" ? Number(value) : value,
      ...(name === "category" ? { niche: value } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Judul aset wajib diisi!", "error");
      return;
    }
    if (!form.description.trim()) {
      showToast("Deskripsi aset wajib diisi!", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newAsset = {
        id: "upl-" + Date.now(),
        title: form.title,
        niche: form.niche,
        type: form.type,
        price: form.price,
        createdAt: new Date().toLocaleDateString("id-ID"),
        status: "Published",
      };

      setUploadedAssets((prev) => [newAsset, ...prev]);
      setIsSubmitting(false);
      setForm(INITIAL_FORM);
      showToast("Aset digital baru berhasil diunggah dan diterbitkan ke katalog! 🎉", "success");
    }, 600);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Unggah Aset Digital | Aksara.Laku Admin"
        description="Portal admin untuk mengunggah dan menerbitkan template Canva serta aset visual F&B baru."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#77642e]/15">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 hover:text-[#D9534F] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Analytics</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-ink">Upload Master Aset</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#162740] text-white flex items-center gap-1.5">
              <Lock size={12} />
              <span>Admin: {user?.name || "Aksara.Laku HQ"}</span>
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#162740] font-bold">
            Studio Upload &amp; Penerbitan Aset F&amp;B
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Tambahkan template Canva, kalender promosi, atau branding kit baru ke etalase Aksara.Laku.
          </p>
        </div>

        {/* 2-Column Split: Form (Kiri) & Live Preview (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Sisi Kiri: Form Upload (lg:col-span-7) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-3xl border border-[#77642e]/20 p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-dashed border-[#77642e]/20 text-xs text-ink-soft font-semibold uppercase tracking-wider">
              <Upload size={16} className="text-[#D9534F]" />
              <span>Detail Spesifikasi Produk Digital</span>
            </div>

            {/* Judul Produk */}
            <div>
              <label className="block text-xs font-bold text-[#162740] mb-1.5">
                Judul Template / Aset Digital *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: 30-Day Artisan Coffee Shop Social Kit"
                className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7]"
                required
              />
            </div>

            {/* Row: Ceruk Niche & Tipe Aset */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#162740] mb-1.5">
                  Ceruk Bisnis Kuliner (Niche)
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7]"
                >
                  {NICHE_OPTIONS.map((niche) => (
                    <option key={niche} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#162740] mb-1.5">
                  Tipe Aset
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7]"
                >
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: Harga Promo & Harga Normal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#162740] mb-1.5">
                  Harga Jual (IDR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min={10000}
                  step={1000}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#162740] mb-1.5">
                  Harga Coret / Asli (IDR)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  min={form.price}
                  step={1000}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7] font-mono"
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-bold text-[#162740] mb-1.5">
                URL Gambar Preview / Thumbnail Unsplash
              </label>
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7] font-mono"
                required
              />
            </div>

            {/* Canva Template Link */}
            <div>
              <label className="block text-xs font-bold text-[#162740] mb-1.5">
                URL Template Canva (External Edit Link)
              </label>
              <input
                type="url"
                name="canvaUrl"
                value={form.canvaUrl}
                onChange={handleChange}
                placeholder="https://canva.com/templates/..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7] font-mono"
                required
              />
            </div>

            {/* Deskripsi Aset */}
            <div>
              <label className="block text-xs font-bold text-[#162740] mb-1.5">
                Deskripsi Singkat Aset *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Jelaskan daya tarik, keunggulan visual, dan target audiens dari template F&B ini..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#77642e]/25 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D9534F]/30 focus:border-[#D9534F] bg-[#FDFBF7]"
                required
              />
            </div>

            {/* Tombol Aksi Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Upload size={17} />
              <span>{isSubmitting ? "Menerbitkan Aset..." : "Unggah & Terbitkan ke Katalog"}</span>
            </button>
          </form>

          {/* Sisi Kanan: Live Card Preview (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-3xl border border-[#77642e]/20 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-[#77642e]/20">
                <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Eye size={15} className="text-[#77642e]" />
                  Live Preview Katalog
                </span>
                <span className="text-[11px] text-ink-soft">Tampilan Kartu</span>
              </div>

              {/* Mock Product Card Preview */}
              <div className="rounded-2xl border border-[#77642e]/20 overflow-hidden bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-gray-900 overflow-hidden">
                  <img
                    src={form.thumbnail}
                    alt={form.title || "Preview Template"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-[#162740]/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {form.niche}
                    </span>
                    <span className="bg-[#D9534F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {form.formatBadge}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-display font-bold text-base text-[#162740] line-clamp-1 mb-1">
                    {form.title || "Judul Template Aset Anda"}
                  </h4>
                  <p className="text-xs text-ink-soft line-clamp-2 mb-3">
                    {form.description ||
                      "Deskripsi singkat aset akan tampil di sini untuk menarik minat calon pembeli..."}
                  </p>
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-base font-bold text-[#D9534F]">
                      {formatIDR(form.price)}
                    </span>
                    {form.originalPrice > form.price && (
                      <span className="text-xs line-through text-gray-400">
                        {formatIDR(form.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-[#77642e]/20 p-5 text-xs text-ink">
              <div className="flex items-start gap-2.5">
                <Sparkles size={18} className="text-[#D9534F] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#162740]">Standar Kurasi Visual F&amp;B:</p>
                  <p className="text-ink-soft/90 mt-1 leading-relaxed">
                    Pastikan rasio gambar thumbnail 4:3 atau 1:1 dengan kontras pencahayaan yang hangat. Tautan Canva harus disetel ke mode <em>&quot;Use template for new design&quot;</em> agar file master tidak tertimpa oleh pembeli.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Tabel Aset Terunggah */}
        <div className="bg-white rounded-3xl border border-[#77642e]/20 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#77642e]/15">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740]">
                Daftar Aset yang Diterbitkan ({uploadedAssets.length})
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">
                Aset digital yang siap dipesan oleh UMKM kuliner di seluruh Indonesia.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#77642e]/15 text-ink-soft text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">ID Aset</th>
                  <th className="py-3 px-3">Judul Template</th>
                  <th className="py-3 px-3">Niche F&amp;B</th>
                  <th className="py-3 px-3">Tipe</th>
                  <th className="py-3 px-3">Harga</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#77642e]/10">
                {uploadedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#162740]">
                      {asset.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-ink">
                      {asset.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-[#162740]/10 text-[#162740] font-bold text-[11px]">
                        {asset.niche}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-ink-soft">{asset.type}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#D9534F]">
                      {formatIDR(asset.price)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
