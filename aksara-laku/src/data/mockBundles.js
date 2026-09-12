// Mock F&B bundle definitions used by the Niche Matcher quiz.
// Each bundle maps a category + set of goals to a curated list of product IDs.

export const mockBundles = [
  {
    id: "b-coffee-launch",
    category: "coffee",
    goals: ["launch", "awareness"],
    title: "Paket Buka Coffee Shop Baru",
    description:
      "Kombinasi konten grand opening dan awareness untuk coffee shop yang baru mau launching atau buka cabang.",
    productIds: ["p005", "p001", "p009"],
  },
  {
    id: "b-coffee-consistency",
    category: "coffee",
    goals: ["consistency", "branding"],
    title: "Paket Konsisten Posting Coffee Shop",
    description:
      "Untuk coffee shop yang sudah jalan tapi butuh sistem konten yang konsisten dan tampilan feed yang lebih rapi.",
    productIds: ["p001", "p009"],
  },
  {
    id: "b-resto-sales",
    category: "resto",
    goals: ["sales", "consistency"],
    title: "Paket Dorong Penjualan Resto",
    description:
      "Fokus ke promo menu dan caption harian yang bikin pelanggan tergerak order lagi.",
    productIds: ["p002", "p006"],
  },
  {
    id: "b-resto-awareness",
    category: "resto",
    goals: ["awareness", "sales"],
    title: "Paket Naikkan Awareness Resto",
    description:
      "Strategi konten TikTok dan caption bank untuk resto yang mau lebih dikenal di media sosial.",
    productIds: ["p010", "p006"],
  },
  {
    id: "b-bakery-branding",
    category: "bakery",
    goals: ["branding", "launch"],
    title: "Paket Branding Bakery Naik Kelas",
    description:
      "Identitas visual lengkap plus konten musiman untuk bakery yang mau tampil lebih profesional.",
    productIds: ["p003", "p007"],
  },
  {
    id: "b-bakery-consistency",
    category: "bakery",
    goals: ["consistency", "sales"],
    title: "Paket Konten Musiman Bakery",
    description:
      "Perencanaan konten musiman untuk menjaga penjualan tetap stabil di momen-momen besar.",
    productIds: ["p007", "p003"],
  },
  {
    id: "b-catering-corporate",
    category: "catering",
    goals: ["sales", "branding"],
    title: "Paket Katering Acara & Korporat",
    description:
      "Materi promosi premium untuk katering yang menyasar acara pernikahan dan korporat.",
    productIds: ["p008", "p004"],
  },
  {
    id: "b-catering-daily",
    category: "catering",
    goals: ["consistency", "sales"],
    title: "Paket Katering Harian",
    description:
      "Script closing WhatsApp dan strategi promosi untuk katering harian yang mau order tetap ramai.",
    productIds: ["p004", "p008"],
  },
];

/**
 * Find the best-matching bundle given a category and list of selected goals.
 * Falls back to the bundle with the most overlapping goals in that category,
 * or the first bundle in the category if no goal overlap is found.
 */
export function findBestBundle(category, selectedGoals = []) {
  const candidates = mockBundles.filter(
    (b) => b.category === category?.toLowerCase()
  );
  if (candidates.length === 0) return null;

  let best = candidates[0];
  let bestScore = -1;

  candidates.forEach((bundle) => {
    const score = bundle.goals.filter((g) => selectedGoals.includes(g)).length;
    if (score > bestScore) {
      bestScore = score;
      best = bundle;
    }
  });

  return best;
}
