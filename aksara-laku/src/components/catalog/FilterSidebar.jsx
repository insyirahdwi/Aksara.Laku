import { CATEGORIES, ASSET_TYPES } from "../../utils/constants";

export default function FilterSidebar({
  activeCategory,
  onCategoryChange,
  activeTypes,
  onToggleType,
}) {
  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <div className="mb-8">
        <h3 className="font-display text-lg text-ink mb-3">Niche F&amp;B</h3>
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`text-sm w-full text-left px-2 py-1.5 transition-colors ${
                activeCategory === "all"
                  ? "text-chili font-semibold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Semua Kategori
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.id)}
                className={`text-sm w-full text-left px-2 py-1.5 transition-colors ${
                  activeCategory === cat.id
                    ? "text-chili font-semibold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg text-ink mb-3">Jenis Aset</h3>
        <ul className="flex flex-col gap-2.5">
          {ASSET_TYPES.map((type) => (
            <li key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={activeTypes.includes(type)}
                onChange={() => onToggleType(type)}
                className="accent-chili w-4 h-4"
              />
              <label htmlFor={`type-${type}`} className="text-sm text-ink-soft">
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
