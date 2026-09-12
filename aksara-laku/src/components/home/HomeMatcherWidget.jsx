import { useMatcher } from "../../context/MatcherContext";
import { useToast } from "../common/Toast";
import { useNavigate } from "react-router-dom";
import Step1Category from "../matcher/Step1Category";
import Step2Goals from "../matcher/Step2Goals";
import Step3Result from "../matcher/Step3Result";
import { Sparkles, CheckCircle2 } from "lucide-react";

const STEP_LABELS = [
  { step: 1, title: "Kategori Usaha" },
  { step: 2, title: "Tujuan Bisnis" },
  { step: 3, title: "Paket Rekomendasi" },
];

export default function HomeMatcherWidget() {
  const {
    currentStep,
    totalSteps,
    selectedCategory,
    selectedGoals,
    recommendedBundle,
    setCategory,
    toggleGoal,
    nextStep,
    prevStep,
    calculateRecommendation,
    addBundleToCart,
    resetMatcher,
  } = useMatcher();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleAddToCart() {
    addBundleToCart();
    showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
    navigate("/cart");
  }

  return (
    <section id="matcher" className="py-14 sm:py-20 bg-[#FDFBF7] border-b border-[#77642e]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#77642e] text-white text-xs font-light shadow-xs mb-3">
            <Sparkles size={14} className="text-[#E67E22]" />
            <span>Kuis Interaktif 1 Menit</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-ink tracking-tight mb-2">
            F&amp;B Niche Matcher
          </h2>
          <p className="text-ink-soft text-sm sm:text-base max-w-xl mx-auto">
            Jawab 2 pertanyaan singkat untuk mendapatkan rekomendasi paket aset digital &amp; template yang paling presisi dengan kebutuhan usahamu.
          </p>
        </div>

        {/* Card Container max-w-4xl */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#77642e]/20 p-6 sm:p-10 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
          {/* Step Indicators */}
          <div className="flex items-center justify-center mb-8 pb-6 border-b border-dashed border-[#77642e]/20">
            {STEP_LABELS.map((item, idx) => {
              const isPassed = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              return (
                <div key={item.step} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ease-in-out ${
                        isCurrent
                          ? "bg-chili text-white ring-2 ring-chili/30 shadow-xs"
                          : isPassed
                          ? "bg-basil text-white"
                          : "bg-paper-dim text-ink-soft/70 border border-line"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={14} /> : item.step}
                    </span>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        isCurrent
                          ? "text-ink font-bold"
                          : isPassed
                          ? "text-basil font-semibold"
                          : "text-ink-soft/60"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                  {idx < totalSteps - 1 && (
                    <div
                      className={`w-10 sm:w-16 h-0.5 mx-2 sm:mx-3 transition-colors ${
                        currentStep > item.step ? "bg-basil" : "bg-line"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Steps with Smooth Fade-In / Slide-Left Animation */}
          <div className="max-w-lg mx-auto overflow-hidden">
            <div
              key={currentStep}
              className="animate-slide-left transition-all duration-300 ease-in-out"
            >
              {currentStep === 1 && (
                <Step1Category
                  selectedCategory={selectedCategory}
                  onSelect={setCategory}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <Step2Goals
                  selectedGoals={selectedGoals}
                  onToggle={toggleGoal}
                  onNext={calculateRecommendation}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <Step3Result
                  bundle={recommendedBundle}
                  onAddToCart={handleAddToCart}
                  onReset={resetMatcher}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
