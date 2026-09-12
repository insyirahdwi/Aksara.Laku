import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ExternalLink,
  PackageOpen,
  Store,
  Calendar,
  ShieldCheck,
  Sparkles,
  Layers,
  FileCheck,
  LogIn,
  Search,
  ArrowRight,
  TrendingUp,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import AuthModal from "../../components/auth/AuthModal";
import ProductCard from "../../components/catalog/ProductCard";
import { mockProducts } from "../../data/mockProducts";
import SEOHead from "../../components/common/SEOHead";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function MyLibrary() {
  const { user, isLoggedIn, purchasedProducts: localPurchasedProducts, clearPurchases, resetDemoOrders } = useAuth();
  const { showToast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const [dbAssets, setDbAssets] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(isLoggedIn && isSupabaseConfigured));
  const [fetchError, setFetchError] = useState(null);

  const handleReloadAssets = useCallback(async () => {
    if (!isLoggedIn || !isSupabaseConfigured) return;
    setIsLoading(true);
    setFetchError(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || user?.id;

      if (!currentUserId) {
        setDbAssets(null);
        setIsLoading(false);
        return;
      }

      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select(`
          id,
          order_id,
          status,
          created_at,
          total_amount,
          order_items (
            id,
            product_id,
            price,
            product_title,
            products (
              id,
              title,
              category,
              niche,
              tags,
              type,
              price,
              thumbnail,
              description,
              download_link,
              canva_link,
              format_badge,
              category_badge
            )
          )
        `)
        .eq("user_id", String(currentUserId))
        .eq("status", "SUCCESS")
        .order("created_at", { ascending: false });

      if (ordersErr) {
        console.warn("Supabase orders query notice (fallback to local):", ordersErr.message);
        setDbAssets(null);
      } else if (ordersData) {
        const mapped = ordersData.flatMap((order) => {
          return (order.order_items || []).map((item) => {
            const prod = item.products || {};
            const canvaUrl =
              prod.canva_link ||
              prod.download_link ||
              `https://www.canva.com/design/aksara-laku-${prod.id || item.product_id}`;
            const downloadLink =
              prod.download_link ||
              prod.canva_link ||
              canvaUrl;

            return {
              id: prod.id || item.product_id,
              title: prod.title || item.product_title || "Aset Digital F&B",
              category: prod.category || "F&B Digital Asset",
              niche: prod.niche || prod.category || "General F&B",
              type: prod.type || "Canva Template",
              price: item.price || prod.price,
              thumbnail:
                prod.thumbnail ||
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
              description: prod.description || "Template visual dan materi promosi siap pakai untuk usaha kuliner.",
              downloadLink,
              canvaUrl,
              formatBadge: prod.format_badge || "Canva Editable",
              categoryBadge: prod.category_badge || "Digital Asset",
              orderId: order.order_id,
              orderDate: order.created_at,
            };
          });
        });
        setDbAssets(mapped);
      }
    } catch (err) {
      console.warn("Kesalahan koneksi saat mengambil riwayat aset Supabase:", err);
      setFetchError("Gagal terhubung ke database Supabase. Menampilkan cadangan sesi lokal.");
      setDbAssets(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoggedIn || !isSupabaseConfigured) return;

    let ignore = false;
    async function executeLoad() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id || user?.id;

        if (!currentUserId) {
          if (!ignore) {
            setDbAssets(null);
            setIsLoading(false);
          }
          return;
        }

        const { data: ordersData, error: ordersErr } = await supabase
          .from("orders")
          .select(`
            id,
            order_id,
            status,
            created_at,
            total_amount,
            order_items (
              id,
              product_id,
              price,
              product_title,
              products (
                id,
                title,
                category,
                niche,
                tags,
                type,
                price,
                thumbnail,
                description,
                download_link,
                canva_link,
                format_badge,
                category_badge
              )
            )
          `)
          .eq("user_id", String(currentUserId))
          .eq("status", "SUCCESS")
          .order("created_at", { ascending: false });

        if (ignore) return;

        if (ordersErr) {
          console.warn("Supabase orders query notice (fallback to local):", ordersErr.message);
          setDbAssets(null);
        } else if (ordersData) {
          const mapped = ordersData.flatMap((order) => {
            return (order.order_items || []).map((item) => {
              const prod = item.products || {};
              const canvaUrl =
                prod.canva_link ||
                prod.download_link ||
                `https://www.canva.com/design/aksara-laku-${prod.id || item.product_id}`;
              const downloadLink =
                prod.download_link ||
                prod.canva_link ||
                canvaUrl;

              return {
                id: prod.id || item.product_id,
                title: prod.title || item.product_title || "Aset Digital F&B",
                category: prod.category || "F&B Digital Asset",
                niche: prod.niche || prod.category || "General F&B",
                type: prod.type || "Canva Template",
                price: item.price || prod.price,
                thumbnail:
                  prod.thumbnail ||
                  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
                description: prod.description || "Template visual dan materi promosi siap pakai untuk usaha kuliner.",
                downloadLink,
                canvaUrl,
                formatBadge: prod.format_badge || "Canva Editable",
                categoryBadge: prod.category_badge || "Digital Asset",
                orderId: order.order_id,
                orderDate: order.created_at,
              };
            });
          });
          setDbAssets(mapped);
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Kesalahan koneksi saat mengambil riwayat aset Supabase:", err);
          setFetchError("Gagal terhubung ke database Supabase. Menampilkan cadangan sesi lokal.");
          setDbAssets(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    executeLoad();

    return () => {
      ignore = true;
    };
  }, [isLoggedIn, user]);

  // Gunakan data dari Supabase jika tersedia, atau fallback mulus ke data lokal AuthContext
  const purchasedProducts = dbAssets !== null ? dbAssets : localPurchasedProducts;

  const getCanvaUrl = (item) => {
    return (
      item.canvaUrl ||
      item.canva_link ||
      item.downloadLink ||
      `https://www.canva.com/design/aksara-laku-${item.id || "template"}`
    );
  };

  const handleDownloadMasterFile = (item) => {
    const canvaUrl = getCanvaUrl(item);
    const fileContent = `=====================================================
AKSARALAKU - DIGITAL ASSET MASTER FILE BUNDLE
=====================================================

Produk: ${item.title}
Kategori: ${item.category || "F&B Digital Asset"}
Format: Canva Editable, High-Resolution Assets & Vector Kit
Lisensi: Lisensi Komersial Seumur Hidup (Lifetime Commercial License)
Pemegang Lisensi: ${user?.businessName || user?.name || "Pemilik Usaha F&B"}
Email Akun: ${user?.email || "owner@usahafnb.com"}
ID Transaksi: ${item.orderId || "AKL-DIGITAL-ORDER"}
Tanggal Akses: ${new Date().toLocaleDateString("id-ID")}

-----------------------------------------------------
1. TAUTAN MASTER TEMPLATE CANVA (Siap Edit Langsung):
${canvaUrl}

2. PANDUAN CEPAT PENGGUNAAN:
- Buka tautan Canva di atas pada browser komputer atau aplikasi Canva di HP.
- Klik tombol "Gunakan Template untuk Desain Baru".
- Ganti teks, foto makanan/minuman, harga menu, dan logo sesuai brand Anda.
- Ekspor hasil desain dalam format PNG/JPG untuk media sosial atau PDF untuk cetak.

3. KELENGKAPAN MASTER ASSET:
- Grid Layout Template Instagram Feed (rasio 4:5 & 1:1)
- Template Story & Reels Motion Hook
- Koleksi Vektor Ornamen & Badge Promosi F&B
- Panduan Palet Warna & Rekomendasi Font Estetik

Butuh bantuan teknis atau request kustomisasi?
Hubungi Customer Care Aksara.Laku melalui WhatsApp: +62 812-3456-7890
"Dari Kata Jadi Karya" - Aksara.Laku Official Digital Assets
=====================================================`;

    const blob = new Blob([fileContent], { type: "application/zip;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const sanitizedTitle = (item.title || "Aset_Digital").replace(/[^a-zA-Z0-9]/g, "_");
    a.href = downloadUrl;
    a.download = `${sanitizedTitle}_MasterFile.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    showToast(`Mengunduh Master File: ${item.title} 📦`, "success");
  };

  const handleCopyLink = (item) => {
    const url = getCanvaUrl(item);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedId(item.id);
          showToast("Tautan template Canva berhasil disalin ke clipboard! 📋", "success");
          setTimeout(() => {
            setCopiedId((prev) => (prev === item.id ? null : prev));
          }, 3000);
        })
        .catch(() => {
          showToast("Tautan template Canva berhasil disalin! 📋", "success");
        });
    } else {
      showToast("Tautan template Canva berhasil disalin! 📋", "success");
    }
  };

  // Jika belum login, tampilkan banner proteksi
  if (!isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <SEOHead
          title="My Library — Akses Aset Digital Saya | Aksara.Laku"
          description="Akses seluruh template Canva, branding kit, dan aset visual kuliner yang telah Anda miliki di Aksara.Laku."
        />
        <div className="rounded-2xl border border-line bg-white p-8 sm:p-12 shadow-sm flex flex-col items-center transition-all duration-300 ease-in-out">
          <div className="w-16 h-16 rounded-full bg-turmeric/20 border border-turmeric text-ink flex items-center justify-center mb-5">
            <PackageOpen size={32} className="text-turmeric-dark" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink mb-3 font-bold">
            Pustaka Aset Digital F&amp;B Anda
          </h1>
          <p className="text-ink-soft text-sm sm:text-base mb-8 max-w-md leading-relaxed">
            Silakan masuk atau daftar dengan akun usaha Anda untuk mengakses seluruh template Canva, branding kit, dan file naskah promosi yang telah Anda miliki.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={LogIn}
              onClick={() => setIsAuthModalOpen(true)}
              className="font-bold px-6"
            >
              Login / Masuk Akun
            </Button>
            <Link to="/catalog">
              <Button variant="secondary" size="lg">
                Jelajahi Katalog
              </Button>
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialTab="login"
        />
      </div>
    );
  }

  const displayName = user?.businessName || user?.name || "Usaha F&B Anda";
  const userInitial = displayName.charAt(0).toUpperCase();

  // Filter assets berdasarkan search input
  const displayedAssets = purchasedProducts.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularProducts = [...mockProducts]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 3);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="My Library — Akses Aset Digital Saya | Aksara.Laku"
        description="Akses seluruh template Canva, branding kit, dan aset visual kuliner yang telah Anda miliki di Aksara.Laku."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 1. Header Dashboard: Profil Singkat Usaha & Ringkasan Total Aset */}
        <div className="rounded-3xl border border-[#77642e]/20 bg-white p-6 sm:p-8 mb-10 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-dashed border-[#77642e]/20">
            {/* Profil Singkat Usaha */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#77642e]/15 border-2 border-[#77642e]/30 text-[#162740] flex items-center justify-center text-xl sm:text-2xl font-bold font-display shrink-0 shadow-sm">
                {userInitial}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold leading-tight">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-basil/15 text-basil px-2.5 py-0.5 rounded-full border border-basil/30">
                    <ShieldCheck size={13} />
                    Lisensi Komersial Aktif
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-ink-soft/80 mt-1 flex items-center gap-1.5">
                  <Store size={14} className="text-[#77642e]" />
                  <span>{user?.email}</span>
                  <span className="text-ink-soft/40">&bull;</span>
                  <span className="font-mono text-xs text-ink-soft/70">ID: {user?.id || "FNB-MEMBER"}</span>
                </p>
              </div>
            </div>

            {/* Action button & Demo tester */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start lg:self-center">
              <Link to="/catalog">
                <Button variant="secondary" size="md" icon={Sparkles} className="text-xs sm:text-sm">
                  + Cari Template Baru
                </Button>
              </Link>
              {purchasedProducts.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    clearPurchases();
                    setDbAssets([]);
                    showToast("Pustaka dikosongkan untuk simulasi tampilan empty state.", "info");
                  }}
                  className="text-[11px] text-ink-soft/70 hover:text-[#D9534F] underline transition-colors cursor-pointer"
                  title="Simulasikan tampilan akun tanpa pembelian"
                >
                  Uji Tampilan Kosong
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetDemoOrders();
                    setDbAssets(null);
                    showToast("Aset digital demo berhasil dimuat kembali!", "success");
                  }}
                  className="text-[11px] text-[#77642e] hover:text-[#162740] font-semibold underline transition-colors cursor-pointer"
                  title="Muat aset demo"
                >
                  Muat Aset Demo
                </button>
              )}
            </div>
          </div>

          {/* Ringkasan Statistik Metrik Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/15 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:border-[#77642e]/30">
              <div className="p-2.5 bg-[#D9534F]/10 text-[#D9534F] rounded-xl shrink-0">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-soft/80 font-medium">Total Aset Dimiliki</p>
                <p className="font-display text-2xl font-bold text-[#162740] leading-tight">
                  {isLoading ? "..." : purchasedProducts.length}{" "}
                  <span className="text-xs font-sans font-normal text-ink-soft">Kit / Template</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/15 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:border-[#77642e]/30">
              <div className="p-2.5 bg-[#77642e]/15 text-[#77642e] rounded-xl shrink-0">
                <FileCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-soft/80 font-medium">Format File Terintegrasi</p>
                <p className="font-display text-lg font-bold text-[#162740] leading-tight">
                  Canva, PDF &amp; Sheets
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/15 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:border-[#77642e]/30">
              <div className="p-2.5 bg-basil/15 text-basil rounded-xl shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-ink-soft/80 font-medium">Masa Berlaku Lisensi</p>
                <p className="font-display text-lg font-bold text-[#162740] leading-tight">
                  Seumur Hidup (Permanen)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi Notice bila ada error fetch Supabase */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              type="button"
              onClick={handleReloadAssets}
              className="inline-flex items-center gap-1 font-bold underline cursor-pointer hover:text-amber-900"
            >
              <RefreshCw size={12} />
              <span>Coba Hubungkan Ulang</span>
            </button>
          </div>
        )}

        {/* Toolbar & Search Bar (Hanya tampil jika ada aset yang dimiliki dan tidak loading) */}
        {!isLoading && purchasedProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-2xl text-[#162740] font-bold">
                Pustaka Aset Siap Pakai
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Unduh file naskah promosi atau buka langsung template di Canva untuk mulai mengedit.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/60" />
              <input
                type="text"
                placeholder="Cari aset di library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#77642e]/25 rounded-xl text-xs text-ink placeholder:text-ink-soft/50 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
        )}

        {/* 2. State Render: Skeleton Loading / Empty State / Grid Aset */}
        {isLoading ? (
          /* Responsive Skeleton Loading */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#77642e]/15 bg-white p-4 flex flex-col gap-4 animate-pulse shadow-xs"
              >
                <div className="w-full aspect-[16/10] bg-stone-200/70 rounded-xl" />
                <div className="h-5 w-3/4 bg-stone-200/80 rounded-md" />
                <div className="h-4 w-1/2 bg-stone-200/50 rounded-md" />
                <div className="mt-auto pt-4 border-t border-stone-100 flex flex-col gap-2">
                  <div className="h-9 w-full bg-stone-200/80 rounded-xl" />
                  <div className="h-9 w-full bg-stone-200/60 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : purchasedProducts.length === 0 ? (
          /* Empty State: Jika pengguna belum pernah membeli aset */
          <div className="rounded-3xl border border-[#77642e]/20 bg-white p-8 sm:p-12 shadow-sm text-center transition-all duration-300 ease-in-out">
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#162740]/5 border-2 border-dashed border-[#77642e]/30 flex items-center justify-center text-[#77642e] shadow-inner transition-transform duration-300 hover:scale-105">
                <PackageOpen size={40} className="text-[#77642e]" />
              </div>
              <span className="absolute top-1 right-2 w-6 h-6 rounded-full bg-[#D9534F] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                0
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold mb-3">
              Belum ada aset digital yang dibeli
            </h2>
            <p className="text-sm text-ink-soft mb-8 max-w-lg mx-auto leading-relaxed">
              Pustaka akun Anda masih kosong. Seluruh template Canva, file naskah promosi, dan branding kit F&amp;B yang Anda beli akan otomatis tersimpan di sini dengan lisensi seumur hidup.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <Link to="/catalog">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>Mulai Cari Aset F&amp;B</span>
                </button>
              </Link>
              <Link to="/matcher">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-[#77642e]/30 bg-white hover:bg-[#FDFBF7] text-[#162740] font-semibold text-sm shadow-xs hover:border-[#77642e] transition-all duration-300 cursor-pointer"
                >
                  <Store size={16} className="text-[#77642e]" />
                  <span>Coba Niche Matcher</span>
                </button>
              </Link>
            </div>

            {/* Rekomendasi Produk Populer */}
            <div className="pt-10 border-t border-dashed border-[#77642e]/20 text-left">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#77642e]/10 text-[#77642e] text-xs font-bold mb-2">
                    <TrendingUp size={13} />
                    <span>Paling Diminati Pemilik Usaha F&amp;B</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-[#162740] font-bold">
                    Rekomendasi Produk Populer untuk Anda
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1">
                    Mulai dengan template dan kit terlaris yang siap langsung disesuaikan dengan merek usaha Anda.
                  </p>
                </div>
                <Link
                  to="/catalog"
                  className="text-xs sm:text-sm font-bold text-[#D9534F] hover:text-[#c9433f] inline-flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Lihat Semua Katalog</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : displayedAssets.length === 0 ? (
          /* Empty Search Filter State */
          <div className="text-center py-16 px-4 rounded-3xl border border-[#77642e]/20 bg-white shadow-sm">
            <Search size={38} className="mx-auto text-ink-soft/40 mb-3" />
            <h3 className="font-display text-xl text-[#162740] font-bold mb-1">
              Tidak ditemukan aset yang cocok
            </h3>
            <p className="text-sm text-ink-soft mb-6 max-w-sm mx-auto">
              Tidak ada aset di pustaka Anda yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-5 py-2.5 bg-[#162740] text-white text-xs font-bold rounded-xl hover:bg-[#162740]/90 transition-all duration-300 cursor-pointer shadow-xs"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          /* Grid Aset Digital Terbeli (3 Kolom) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedAssets.map((item, idx) => {
              const formattedDate = item.orderDate
                ? new Date(item.orderDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Baru saja";

              return (
                <div
                  key={`${item.orderId || "item"}-${item.id}-${idx}`}
                  className="rounded-2xl border border-[#77642e]/20 bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out group"
                >
                  {/* 1. Thumbnail Aset */}
                  <div className="relative aspect-[16/10] bg-[#162740]/5 border-b border-[#77642e]/15 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <Badge tone="turmeric" className="text-[10px] font-bold shadow-sm">
                        {item.category || "F&B"}
                      </Badge>
                      <span className="bg-[#162740]/85 text-white text-[10px] px-2 py-0.5 rounded-md font-medium backdrop-blur-sm">
                        {item.type || "Kit"}
                      </span>
                    </div>
                  </div>

                  {/* 2. Judul Template / Kit & Tanggal Pembelian */}
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#162740] leading-snug line-clamp-2 mb-1.5">
                        {item.title}
                      </h3>

                      {/* 3. Tanggal Pembelian */}
                      <div className="flex items-center gap-1.5 text-xs text-ink-soft/80">
                        <Calendar size={13} className="text-[#77642e] shrink-0" />
                        <span>
                          Dibeli: <strong className="font-semibold text-[#162740]">{formattedDate}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mt-auto pt-4 border-t border-dashed border-[#77642e]/20 flex flex-col gap-2.5">
                      {/* Tombol Aksi Akses Aset Digital */}
                      <div className="flex flex-col gap-2">
                        {/* 1. Buka Template Canva */}
                        <a
                          href={getCanvaUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300 ease-in-out text-center cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          <span>Buka Template Canva</span>
                        </a>

                        {/* 2. Download Master File */}
                        <button
                          type="button"
                          onClick={() => handleDownloadMasterFile(item)}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-[#162740] text-[#162740] hover:bg-[#162740] hover:text-white rounded-xl text-xs font-semibold shadow-2xs hover:shadow-xs transition-all duration-300 ease-in-out text-center cursor-pointer"
                        >
                          <Download size={14} />
                          <span>Download Master File</span>
                        </button>

                        {/* 3. Salin Tautan Template (Copy Link) */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[11px] font-semibold border transition-all duration-300 ease-in-out cursor-pointer ${
                            copiedId === item.id
                              ? "bg-basil/15 border-basil text-basil"
                              : "bg-[#FDFBF7] hover:bg-[#77642e]/10 border-[#77642e]/25 text-ink-soft hover:text-[#162740]"
                          }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={13} className="text-basil" />
                              <span>Tautan Berhasil Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} className="text-[#77642e]" />
                              <span>Salin Tautan (Copy Link)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
