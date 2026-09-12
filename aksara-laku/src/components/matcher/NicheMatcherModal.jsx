import { useMatcher } from "../../context/MatcherContext";
import { useToast } from "../common/Toast";
import Modal from "../common/Modal";
import Step1Category from "./Step1Category";
import Step2Goals from "./Step2Goals";
import Step3Result from "./Step3Result";

export default function NicheMatcherModal({ isOpen, onClose }) {
  const {
    currentStep,
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

  function handleClose() {
    onClose?.();
  }

  function handleAddToCart() {
    addBundleToCart();
    showToast("Aset berhasil ditambahkan ke keranjang! 🛒", "success");
    handleClose();
  }

  function handleReset() {
    resetMatcher();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="F&B Niche Matcher" size="md">
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
            onReset={handleReset}
          />
        )}
      </div>
    </Modal>
  );
}
