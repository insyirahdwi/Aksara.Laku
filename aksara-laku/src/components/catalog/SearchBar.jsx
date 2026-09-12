import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Cari template, kit, atau strategi..." }) {
  return (
    <div className="relative flex-1">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Cari produk"
        className="w-full bg-paper border border-line pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-chili/40"
      />
    </div>
  );
}
