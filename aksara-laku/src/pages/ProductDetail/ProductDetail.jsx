import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Zap, ShoppingCart, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { fetchProductById, fetchRelatedProducts } from "../../services/productsService";
import { formatIDR } from "../../utils/helpers";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../components/common/Toast";
import Button from "../../components/common/Button";
import AssetCarousel from "../../components/pdp/AssetCarousel";
import ProductTabs from "../../components/pdp/ProductTabs";
import ProductSidebar from "../../components/pdp/ProductSidebar";
import ProductCard from "../../components/catalog/ProductCard";
import SEOHead from "../../components/common/SEOHead";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const found = await fetchProductById(id);
        if (!isMounted) return;

        if (!found) {
          setError("Produk aset digital tidak ditemukan di database.");
          setProduct(null);
          return;
        }

        setProduct(found);

        // Fetch rekomendasi produk terkait
        const relatedList = await fetchRelatedProducts(found.category, found.id, 3);
        if (isMounted) {
          setRelated(relatedList || []);
        }
      } catch (err) {
        console.error("Gagal mengambil detail produk dari Supabase:", err);
        if (isMounted) {
          setError("Terjadi kesalahan saat memuat data produk dari database.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="h-4 w-48 bg-stone-200/70 rounded-md mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-12 items-start">
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="w-full h-96 sm:h-[480px] bg-stone-200/70 rounded-3xl" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-stone-200/60 rounded-xl" />
              ))}
            </div>
            <div className="h-40 bg-stone-200/50 rounded-2xl mt-4" />
          </div>
          <div className="bg-white border border-[#77642e]/15 rounded-3xl p-6 sm:p-8 animate-pulse flex flex-col gap-5">
            <div className="h-6 w-1/3 bg-stone-200/70 rounded-full" />
            <div className="h-8 w-3/4 bg-stone-200/80 rounded-md" />
            <div className="h-5 w-1/2 bg-stone-200/60 rounded-md" />
            <div className="h-10 w-full bg-stone-200/80 rounded-xl mt-4" />
            <div className="h-10 w-full bg-stone-200/70 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="rounded-3xl border border-[#77642e]/20 bg-white p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="font-display text-2xl text-[#162740] font-bold mb-2">
            Aset Tidak Ditemukan
          </h2>
          <p className="text-sm text-ink-soft mb-8 leading-relaxed max-w-md mx-auto">
            {error || "Aset digital yang Anda cari tidak tersedia atau tautan telah kedaluwarsa."}
          </p>
          <Link to="/catalog">
            <Button variant="primary" size="md" icon={ArrowLeft} className="font-bold">
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id);

  function handleAdd() {
    if (inCart) return;
    addToCart(product);
    showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
  }

  function handleDirectCheckout() {
    if (!inCart) {
      addToCart(product);
    }
    navigate("/checkout");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 lg:pb-14">
      <SEOHead
        title={`${product.title} | Aksara.Laku`}
        description={product.description}
        image={product.thumbnail}
        type="product"
      />
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-ink-soft/75 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-chili">Beranda</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-chili">Katalog</Link>
        <span>/</span>
        <Link
          to={`/catalog?category=${product.category.toLowerCase()}`}
          className="hover:text-chili font-medium"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* 2-Column Responsive Layout: 60% Kolom Kiri, 40% Kolom Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-12 items-start mb-16">
        {/* Kolom Kiri (Lebar ~60%): Carousel + Tabs */}
        <div className="flex flex-col">
          {/* Carousel / Gallery Preview Aset */}
          <AssetCarousel product={product} />

          {/* Tab Deskripsi: Apa yang Anda Dapatkan, Format File, Cara Pakai */}
          <ProductTabs product={product} />
        </div>

        {/* Kolom Kanan (Lebar ~40%): Sticky Sidebar */}
        <aside className="w-full">
          <ProductSidebar product={product} />
        </aside>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-line">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl sm:text-3xl text-ink">
              Rekomendasi Lainnya untuk Niche {product.category}
            </h2>
            <Link to="/catalog" className="text-xs sm:text-sm font-semibold text-chili hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bar for Small Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-paper border-t border-line p-3.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-ink-soft block font-medium">Total Harga:</span>
          <span className="font-display text-lg font-bold text-ink">
            {formatIDR(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            icon={inCart ? Check : ShoppingCart}
            className="text-xs px-3 py-2"
          >
            {inCart ? "Di Keranjang" : "Keranjang"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDirectCheckout}
            icon={Zap}
            className="text-xs px-4 py-2 font-bold"
          >
            Beli Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
