// Shared utility/helper functions

/**
 * Format a number as Indonesian Rupiah currency string.
 * e.g. 49000 -> "Rp49.000"
 */
export function formatIDR(amount) {
  if (typeof amount !== "number") return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount percentage between original and current price.
 */
export function calcDiscountPercent(originalPrice, price) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Generate a pseudo-unique order ID, e.g. AKL-20260911-4821
 */
export function generateOrderId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AKL-${y}${m}${d}-${rand}`;
}

/**
 * Simple slugify for product titles / categories.
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Clamp a number between min and max.
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * WhatsApp phone validation: harus berupa angka dan minimal 10 digit.
 * Menerima angka seperti "08123456789", "081234567890", dsb.
 */
export function isValidWhatsApp(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim().replace(/[\s-]/g, "");
  return /^[0-9]{10,}$/.test(trimmed) || /^\+[0-9]{10,}$/.test(trimmed);
}

/**
 * Email validation: menggunakan RegEx, wajib mengandung '@' dan domain '.com'.
 * Contoh: user@domain.com, owner@kopisenja.com
 */
export function isValidEmail(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i.test(trimmed);
}
