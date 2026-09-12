import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, SearchX, X, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { fetchProducts } from "../../services/productsService";
import ProductCard from "../catalog/ProductCard";
import Button from "../common/Button";

const NICHE_TAGS = [
  { id: "Coffee Shop", label: "Coffee Shop", emoji: "☕" },
  { id: "Resto Nusantara", label: "Resto Nusantara", emoji: "🍽️" },
  { id: "Bakery & Pastry", label: "Bakery & Pastry", emoji: "🥐" },
  { id: "Street Food", label: "Street Food", emoji: "🍔" },
  { id: "Beverage/Boba", label: "Beverage/Boba", emoji: "🧋" },
];

export default function HomeCatalog() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch katalog produk dari Supabase Database (atau fallback auto-seed)
  const handleReload = () => {
    setIsLoading(true);
    setError(null);
    fetchProducts()
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error("Gagal memuat produk dari Supabase:", err);
        setError("Gagal memuat katalog produk dari database. Silakan periksa koneksi internet Anda.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let ignore = false;
    fetchProducts()
      .then((data) => {
        if (!ignore) {
          setProducts(data || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Gagal memuat produk dari Supabase:", err);
          setError("Gagal memuat katalog produk dari database. Silakan periksa koneksi internet Anda.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Toggle multi-tag selection
  const handleToggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Live filter based on search input and active multi-tags
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Multi-tag matching: if no tag selected, match all; otherwise must match at least one selected tag
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some(
          (tag) => product.niche === tag || (product.tags && product.tags.includes(tag))
        );

      // Search matching: title, description, category, or niche
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.title?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        product.niche?.toLowerCase().includes(q);

      return matchesTag && matchesSearch;
    });
  }, [products, searchQuery, selectedTags]);

  return (
    <section id="catalog" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#77642e]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#77642e] uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Pustaka Template &amp; Branding</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#162740] font-bold tracking-tight">
            Katalog Aset Digital Pilihan
          </h2>
          <p className="text-ink-soft text-sm sm:text-base mt-1 max-w-xl">
            Semua template dirancang langsung oleh praktisi kreatif F&amp;B dengan format Canva siap edit dan naskah copywriting siap pakai.
          </p>
        </div>

        <Link to="/catalog" className="shrink-0">
          <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right" className="border-[#77642e]/30 hover:border-ink">
            Lihat Semua Katalog
          </Button>
        </Link>
      </div>

      {/* Filter Bar: Live Search & Multi-Tag Niche */}
      <div className="flex flex-col gap-5 mb-10">
        {/* 1. Live Search Input Bar */}
        <div className="relative max-w-xl w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-soft/60">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template (contoh: Kopi Gula Aren, Resto Padang, Bakery...)"
            className="w-full pl-10 pr-10 py-3 bg-white border border-[#77642e]/25 rounded-2xl text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-[#77642e] focus:ring-3 focus:ring-[#77642e]/15 shadow-xs transition-all duration-300 ease-in-out"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-soft/60 hover:text-ink transition-colors cursor-pointer"
              title="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 2. Multi-Tag Niche Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* Tombol 'Semua Niche' */}
          <button
            type="button"
            onClick={() => setSelectedTags([])}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer ${
              selectedTags.length === 0
                ? "bg-[#162740] text-white shadow-md ring-2 ring-[#162740]/25 scale-102"
                : "bg-white text-ink-soft hover:bg-paper-dim border border-[#77642e]/20 shadow-2xs hover:border-[#77642e]/40"
            }`}
          >
            <span>✨</span>
            <span>Semua Niche</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full transition-all duration-300 ${
                selectedTags.length === 0
                  ? "bg-white/20 text-white font-bold"
                  : "bg-paper-dim text-ink-soft/80"
              }`}
            >
              {products.length}
            </span>
          </button>

          {/* Tag Niche F&B */}
          {NICHE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            const count = products.filter(
              (p) => p.niche === tag.id || (p.tags && p.tags.includes(tag.id))
            ).length;

            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer ${
                  isSelected
                    ? "bg-[#D9534F] text-white shadow-md ring-2 ring-[#D9534F]/25 scale-102"
                    : "bg-white text-ink-soft hover:bg-paper-dim border border-[#77642e]/20 shadow-2xs hover:border-[#77642e]/40"
                }`}
              >
                <span>{tag.emoji}</span>
                <span>{tag.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-white/25 text-white font-bold"
                      : "bg-paper-dim text-ink-soft/80"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Area Grid Produk, Loading Skeleton, Error State, ATAU Empty State */}
      {isLoading ? (
        /* Loading Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-[#77642e]/15 rounded-2xl overflow-hidden p-4 flex flex-col gap-4 animate-pulse shadow-xs"
            >
              <div className="w-full h-48 bg-stone-200/70 rounded-xl" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-stone-200/70 rounded-full" />
                <div className="h-5 w-24 bg-stone-200/50 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-stone-200/80 rounded-md" />
              <div className="h-4 w-full bg-stone-200/50 rounded-md" />
              <div className="h-4 w-2/3 bg-stone-200/50 rounded-md" />
              <div className="pt-4 border-t border-stone-100 flex justify-between items-center mt-auto">
                <div className="h-6 w-24 bg-stone-200/80 rounded-md" />
                <div className="h-9 w-28 bg-stone-200/80 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-12 px-6 bg-white border border-rose-200 rounded-3xl shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <AlertCircle size={28} />
          </div>
          <h3 className="font-display text-xl text-[#162740] font-bold mb-2">
            Gagal Memuat Produk
          </h3>
          <p className="text-sm text-ink-soft mb-6 leading-relaxed">
            {error}
          </p>
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#162740] hover:bg-[#162740]/90 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        /* Produk Terisi */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State: Produk tidak ditemukan */
        <div className="text-center py-16 px-6 bg-white border border-[#77642e]/20 rounded-3xl shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/25 flex items-center justify-center text-[#D9534F]">
            <SearchX size={32} />
          </div>
          <h3 className="font-display text-2xl text-[#162740] font-bold mb-2">
            Produk tidak ditemukan
          </h3>
          <p className="text-sm text-ink-soft max-w-md mx-auto mb-6 leading-relaxed">
            {searchQuery
              ? `Tidak ada aset digital atau template yang cocok dengan kata kunci "${searchQuery}".`
              : "Tidak ada produk yang cocok dengan kombinasi filter niche yang dipilih."}
            {" "}Silakan coba kata kunci lain atau reset filter pencarian.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#162740] hover:bg-[#162740]/90 active:bg-[#101c2e] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Reset Pencarian &amp; Filter</span>
          </button>
        </div>
      )}
    </section>
  );
}
