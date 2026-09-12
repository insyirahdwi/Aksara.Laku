import { useRef, useEffect } from "react";
import { CATEGORIES } from "../../utils/constants";
import Button from "../common/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Step1Category({ selectedCategory, onSelect, onNext }) {
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (catId) => {
    onSelect(catId);

    if (timerRef.current) clearTimeout(timerRef.current);

    // Indikator visual aktif (border tebal + centang hijau) sebelum otomatis lanjut
    timerRef.current = setTimeout(() => {
      onNext();
    }, 450);
  };

  return (
    <div>
      <p className="text-sm text-ink-soft mb-1 font-medium">Langkah 1 dari 3</p>
      <h3 className="font-display text-2xl text-ink font-bold mb-6">
        Usaha F&amp;B kamu bergerak di bidang apa?
      </h3>
      <div className="grid grid-cols-2 gap-3.5 mb-8">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`relative p-5 sm:p-6 rounded-2xl text-center transition-all duration-300 ease-in-out cursor-pointer group ${
                isSelected
                  ? "border-2 border-[#2f6b45] bg-[#2f6b45]/10 ring-2 ring-[#2f6b45]/20 shadow-sm scale-[1.02]"
                  : "border border-[#77642e]/20 bg-white hover:border-[#77642e]/40 hover:bg-[#FDFBF7] shadow-xs hover:scale-[1.01]"
              }`}
            >
              {/* Indikator Visual Aktif: Centang Hijau */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 bg-[#2f6b45] text-white rounded-full p-0.5 shadow-xs transition-transform duration-200">
                  <CheckCircle2 size={16} />
                </div>
              )}
              <span className="text-3xl block mb-2 transition-transform duration-300 group-hover:scale-110">
                {cat.emoji}
              </span>
              <span className={`text-sm font-bold block ${isSelected ? "text-[#162740]" : "text-ink"}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
      <Button
        onClick={onNext}
        disabled={!selectedCategory}
        icon={ArrowRight}
        iconPosition="right"
        fullWidth
        className="font-bold py-3 text-base shadow-sm"
      >
        Lanjut
      </Button>
    </div>
  );
}
