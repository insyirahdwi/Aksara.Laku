import { createContext, useContext, useState, useCallback } from "react";
import { findBestBundle } from "../data/mockBundles";
import { getProductById } from "../data/mockProducts";
import { useCart } from "./CartContext";

const MatcherContext = createContext(null);

const TOTAL_STEPS = 3;

export function MatcherProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [recommendedBundle, setRecommendedBundle] = useState(null);
  const { addManyToCart } = useCart();

  const setCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const toggleGoal = useCallback((goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.min(Math.max(step, 1), TOTAL_STEPS));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const calculateRecommendation = useCallback(() => {
    const bundle = findBestBundle(selectedCategory, selectedGoals);
    if (!bundle) {
      setRecommendedBundle(null);
      return null;
    }
    const products = bundle.productIds
      .map((id) => getProductById(id))
      .filter(Boolean);

    const originalTotal = products.reduce((s, p) => s + p.originalPrice, 0);
    const bundleTotal = products.reduce((s, p) => s + p.price, 0);

    const result = { ...bundle, products, originalTotal, bundleTotal };
    setRecommendedBundle(result);
    setCurrentStep(3);
    return result;
  }, [selectedCategory, selectedGoals]);

  const addBundleToCart = useCallback(() => {
    if (!recommendedBundle) return;
    addManyToCart(recommendedBundle.products);
  }, [recommendedBundle, addManyToCart]);

  const resetMatcher = useCallback(() => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedGoals([]);
    setRecommendedBundle(null);
  }, []);

  const value = {
    currentStep,
    totalSteps: TOTAL_STEPS,
    selectedCategory,
    selectedGoals,
    recommendedBundle,
    setCategory,
    toggleGoal,
    goToStep,
    nextStep,
    prevStep,
    calculateRecommendation,
    addBundleToCart,
    resetMatcher,
  };

  return (
    <MatcherContext.Provider value={value}>{children}</MatcherContext.Provider>
  );
}

export function useMatcher() {
  const ctx = useContext(MatcherContext);
  if (!ctx) throw new Error("useMatcher must be used within a MatcherProvider");
  return ctx;
}
