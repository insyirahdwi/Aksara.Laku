import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { getProductById } from "../data/mockProducts";
import { trackEvent } from "../utils/analytics";

const CartContext = createContext(null);

const DISCOUNT_CODES = {
  FNBGO10: { type: "percent", value: 10 },
  HEMAT20K: { type: "flat", value: 20000 },
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // array of { productId, product }
  const [discountCode, setDiscountCode] = useState(null);
  const [discountError, setDiscountError] = useState(null);

  const addToCart = useCallback((product) => {
    trackEvent("add_to_cart", {
      productId: product.id,
      title: product.title,
      price: product.price,
      niche: product.niche || product.category,
    });
    setCartItems((prev) => {
      // Digital items: prevent duplicates
      if (prev.some((item) => item.productId === product.id)) return prev;
      return [...prev, { productId: product.id, product }];
    });
  }, []);

  const addManyToCart = useCallback((products) => {
    products.forEach((p) => {
      trackEvent("add_to_cart", {
        productId: p.id,
        title: p.title,
        price: p.price,
        niche: p.niche || p.category,
      });
    });
    setCartItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.productId));
      const additions = products
        .filter((p) => !existingIds.has(p.id))
        .map((p) => ({ productId: p.id, product: p }));
      return [...prev, ...additions];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const applyDiscount = useCallback((code) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setDiscountError("Masukkan kode promo terlebih dahulu.");
      return false;
    }
    const found = DISCOUNT_CODES[normalized];
    if (!found) {
      setDiscountError("Kode promo tidak ditemukan atau sudah kedaluwarsa.");
      setDiscountCode(null);
      return false;
    }
    setDiscountCode({ code: normalized, ...found });
    setDiscountError(null);
    return true;
  }, []);

  const clearDiscount = useCallback(() => {
    setDiscountCode(null);
    setDiscountError(null);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setDiscountCode(null);
    setDiscountError(null);
  }, []);

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.product?.price || 0), 0),
    [cartItems]
  );

  const discountAmount = useMemo(() => {
    if (!discountCode) return 0;
    if (discountCode.type === "percent") {
      return Math.round((totalPrice * discountCode.value) / 100);
    }
    return Math.min(discountCode.value, totalPrice);
  }, [discountCode, totalPrice]);

  const finalPrice = Math.max(totalPrice - discountAmount, 0);

  const itemCount = cartItems.length;

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.productId === productId),
    [cartItems]
  );

  const value = {
    cartItems,
    itemCount,
    totalPrice,
    discountCode,
    discountAmount,
    discountError,
    finalPrice,
    addToCart,
    addManyToCart,
    removeFromCart,
    applyDiscount,
    clearDiscount,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Re-exported for convenience where a product needs to be looked up
// alongside cart operations (e.g. "buy now" flows).
export { getProductById };
