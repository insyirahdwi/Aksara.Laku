import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../services/productsService";
import { SORT_OPTIONS } from "../../utils/constants";
import FilterSidebar from "../../components/catalog/FilterSidebar";
import SearchBar from "../../components/catalog/SearchBar";
import ProductCard from "../../components/catalog/ProductCard";
import SEOHead from "../../components/common/SEOHead";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(initialCategory);
  const [types, setTypes] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Gagal memuat produk dari Supabase:", err);
      setError("Gagal memuat katalog produk dari database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const params = {};
    if (category !== "all") params.category = category;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  function toggleType(type) {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  const filtered = useMemo(() => {
    let result = products;

    if (category !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === category);
    }
    if (types.length > 0) {
      result = result.filter((p) => types.includes(p.type));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.niche?.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => b.reviewCount - a.reviewCount);

    return sorted;
  }, [products, category, types, query, sort]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <SEOHead
        title="Katalog Template Canva & Desain F&B | Aksara.Laku"
        description="Jelajahi puluhan template Canva dan aset branding F&B siap pakai: kalender konten Instagram, katalog menu makanan, poster promo, dan identitas visual kuliner."
      />
      <h1 className="font-display text-3xl text-ink mb-6">Katalog Aset Digital</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar value={query} onChange={setQuery} />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Urutkan"
          className="bg-paper border border-line px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-chili/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          activeCategory={category}
          onCategoryChange={setCategory}
          activeTypes={types}
          onToggleType={toggleType}
        />

        <div className="flex-1">
          <p className="text-sm text-ink-soft mb-4">
            Menampilkan {filtered.length} produk
          </p>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#77642e]/15 rounded-2xl p-3 flex flex-col gap-3 animate-pulse"
                >
                  <div className="w-full h-40 bg-stone-200/70 rounded-xl" />
                  <div className="h-4 w-2/3 bg-stone-200/70 rounded-md" />
                  <div className="h-3 w-1/2 bg-stone-200/50 rounded-md" />
                  <div className="h-5 w-1/3 bg-stone-200/80 rounded-md mt-2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10 px-6 bg-white border border-rose-200 rounded-2xl shadow-xs max-w-md mx-auto">
              <AlertCircle size={28} className="text-rose-500 mx-auto mb-2" />
              <p className="text-sm text-ink-soft mb-4">{error}</p>
              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#162740] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <RefreshCw size={13} />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ticket-corners border border-line p-10 text-center text-ink-soft bg-white rounded-2xl">
              Tidak ada produk yang cocok. Coba ubah filter atau kata kunci pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
