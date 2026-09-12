import { useMatcher } from "../../context/MatcherContext";
import { useToast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import Step1Category from "../../components/matcher/Step1Category";
import Step2Goals from "../../components/matcher/Step2Goals";
import Step3Result from "../../components/matcher/Step3Result";
import SEOHead from "../../components/common/SEOHead";

const STEP_LABELS = ["Kategori", "Tujuan", "Rekomendasi"];

export default function Matcher() {
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
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
      <SEOHead
        title="Brand Style Matcher F&B | Aksara.Laku"
        description="Temukan rekomendasi paket template Canva dan strategi visual kuliner yang paling pas untuk usaha Anda dalam 3 langkah mudah."
      />
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink text-center mb-6">
          F&amp;B Niche Matcher
        </h1>
        <div className="flex items-center justify-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep >= i + 1
                    ? "bg-chili text-paper"
                    : "bg-paper-dim text-ink-soft border border-line"
                }`}
              >
                {i + 1}
              </span>
              {i < totalSteps - 1 && <span className="w-8 h-px bg-line" />}
            </div>
          ))}
        </div>
      </div>

      <div className="ticket-corners border border-line p-6 sm:p-8 overflow-hidden">
        <div key={currentStep} className="animate-slide-left transition-all duration-300 ease-in-out">
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
  );
}
