import { Link } from "react-router-dom";
import { CATEGORIES } from "../../utils/constants";

export default function QuickCategories() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">
        Pilih sesuai jenis usahamu
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/catalog?category=${cat.id}`}
            className="ticket-corners border border-line bg-paper-dim px-5 py-7 text-center hover:bg-turmeric/20 transition-colors"
          >
            <span className="text-3xl block mb-3">{cat.emoji}</span>
            <span className="font-semibold text-ink text-sm">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
