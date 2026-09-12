const TONES = {
  turmeric: "bg-turmeric/15 text-turmeric-dark border border-turmeric/30",
  greyBrown: "bg-[#77642e]/15 text-[#77642e] border border-[#77642e]/30",
  chili: "bg-chili text-white shadow-xs",
  terracotta: "bg-[#D9534F] text-white shadow-xs",
  amber: "bg-[#E67E22] text-white shadow-xs",
  basil: "bg-basil text-white shadow-xs",
  outline: "bg-transparent text-ink border border-line",
};

export default function Badge({ children, tone = "turmeric", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-lg transition-all duration-300 ease-in-out ${
        TONES[tone] || TONES.turmeric
      } ${className}`}
    >
      {children}
    </span>
  );
}
