// Global app constants

export const APP_NAME = "Aksara.Laku";
export const APP_TAGLINE = "-Dari kata jadi karya-";
export const APP_MOTTO = "Dari kata jadi karya";
export const APP_DESCRIPTION = "Aset Digital Siap Pakai untuk Bisnis F&B";

export const WHATSAPP_NUMBER = "6281234567890";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export const CATEGORIES = [
  { id: "coffee", label: "Coffee Shop", emoji: "☕" },
  { id: "resto", label: "Restoran", emoji: "🍽️" },
  { id: "bakery", label: "Bakery", emoji: "🥐" },
  { id: "catering", label: "Catering", emoji: "🍱" },
];

export const ASSET_TYPES = [
  "Canva Template",
  "Copywriting PDF",
  "Content Planner",
  "Branding Kit",
];

export const GOALS = [
  { id: "awareness", label: "Naikkan Awareness Brand" },
  { id: "sales", label: "Dorong Penjualan Langsung" },
  { id: "consistency", label: "Konsisten Posting Konten" },
  { id: "branding", label: "Bangun Identitas Visual" },
  { id: "launch", label: "Persiapan Buka Cabang / Launching" },
];

export const SORT_OPTIONS = [
  { id: "popular", label: "Terpopuler" },
  { id: "price-asc", label: "Harga: Rendah ke Tinggi" },
  { id: "price-desc", label: "Harga: Tinggi ke Rendah" },
  { id: "rating", label: "Rating Tertinggi" },
];

export const PAYMENT_METHODS = [
  { id: "qris", label: "QRIS", description: "Bayar dengan scan QRIS dari e-wallet atau m-banking apa pun." },
  { id: "va-bca", label: "Virtual Account BCA", description: "Transfer via VA, otomatis terverifikasi." },
  { id: "va-mandiri", label: "Virtual Account Mandiri", description: "Transfer via VA, otomatis terverifikasi." },
  { id: "va-bri", label: "Virtual Account BRI", description: "Transfer via VA, otomatis terverifikasi." },
];

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  SUCCESS: "SUCCESS",
  FAILED: "failed",
};
