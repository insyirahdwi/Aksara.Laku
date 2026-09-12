import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { mockProducts } from "../../data/mockProducts";
import ProductCard from "../catalog/ProductCard";

export default function BestSellers() {
  const bestSellers = [...mockProducts]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl sm:text-3xl text-ink">
          Paling laris minggu ini
        </h2>
        <Link
          to="/catalog"
          className="hidden sm:flex items-center gap-1 text-sm font-semibold text-chili hover:underline"
        >
          Lihat semua <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
