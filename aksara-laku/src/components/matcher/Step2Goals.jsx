import { GOALS } from "../../utils/constants";
import Button from "../common/Button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Step2Goals({ selectedGoals, onToggle, onNext, onBack }) {
  return (
    <div>
      <p className="text-sm text-ink-soft mb-1 font-medium">Langkah 2 dari 3</p>
      <h3 className="font-display text-2xl text-ink font-bold mb-2">
        Apa tujuan utama kamu saat ini?
      </h3>
      <p className="text-xs text-ink-soft/70 mb-5">Pilih minimal satu tujuan untuk mendapatkan rekomendasi paket aset.</p>
      
      <div className="flex flex-col gap-3 mb-8">
        {GOALS.map((goal) => {
          const active = selectedGoals.includes(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onToggle(goal.id)}
              className={`flex items-center justify-between p-4 rounded-xl text-left text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer group ${
                active
                  ? "border-2 border-[#2f6b45] bg-[#2f6b45]/10 text-ink ring-2 ring-[#2f6b45]/20 shadow-xs"
                  : "border border-[#77642e]/20 bg-white text-ink-soft hover:border-[#77642e]/40 hover:bg-[#FDFBF7]"
              }`}
            >
              <span className={active ? "text-ink font-bold" : "text-ink-soft"}>
                {goal.label}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                  active
                    ? "bg-[#2f6b45] text-white shadow-2xs"
                    : "border border-[#77642e]/30 bg-[#FDFBF7]"
                }`}
              >
                {active && <CheckCircle2 size={16} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} icon={ArrowLeft} className="shrink-0 px-5">
          Kembali
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedGoals.length === 0}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          className="font-bold py-3 text-base shadow-sm"
        >
          Lihat Rekomendasi
        </Button>
      </div>
    </div>
  );
}
