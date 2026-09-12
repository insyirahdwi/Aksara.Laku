import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { mockProducts } from "../data/mockProducts";

/**
 * Normalisasi data baris PostgreSQL / Supabase ke format objek JavaScript (camelCase)
 * yang kompatibel penuh dengan seluruh komponen UI Aksara.Laku.
 */
export function normalizeProduct(row) {
  if (!row) return null;

  // Parsing JSON jika kolom bertipe string
  const parseJsonField = (field, fallback) => {
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const parsedTags = parseJsonField(row.tags, []);
  const parsedGallery = parseJsonField(row.gallery, [row.thumbnail]);
  const parsedContents = parseJsonField(row.package_contents ?? row.packageContents, []);

  const downloadLink =
    row.download_link ||
    row.downloadLink ||
    row.canva_link ||
    row.canvaUrl ||
    `https://www.canva.com/design/aksara-laku-${row.id}`;

  const canvaLink =
    row.canva_link ||
    row.canvaUrl ||
    downloadLink;

  return {
    id: String(row.id),
    title: row.title || "Aset Digital F&B",
    category: row.category || "F&B Digital Asset",
    niche: row.niche || row.category || "General F&B",
    tags: parsedTags.length > 0 ? parsedTags : [row.category || "F&B"],
    type: row.type || "Canva Template",
    price: Number(row.price) || 0,
    originalPrice: Number(row.original_price ?? row.originalPrice ?? (Number(row.price || 0) * 2)),
    rating: Number(row.rating ?? 4.9),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 120),
    salesCount: row.sales_count ?? row.salesCount ?? "100+ Terjual",
    formatBadge: row.format_badge ?? row.formatBadge ?? "Canva Editable",
    categoryBadge: row.category_badge ?? row.categoryBadge ?? "Digital Asset",
    thumbnail: row.thumbnail || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    gallery: parsedGallery.length > 0 ? parsedGallery : [row.thumbnail],
    description: row.description || "Template visual dan materi promosi siap pakai untuk usaha kuliner.",
    packageContents: parsedContents,
    downloadLink,
    canvaLink,
    canvaUrl: canvaLink,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

/**
 * Konversi model produk frontend ke bentuk baris database Supabase (snake_case)
 */
export function productToDbRow(p) {
  return {
    id: String(p.id),
    title: p.title,
    category: p.category,
    niche: p.niche || p.category,
    tags: Array.isArray(p.tags) ? p.tags : [],
    type: p.type,
    price: Number(p.price) || 0,
    original_price: Number(p.originalPrice) || (Number(p.price || 0) * 2),
    rating: Number(p.rating) || 4.9,
    review_count: Number(p.reviewCount) || 120,
    sales_count: p.salesCount || "100+ Terjual",
    format_badge: p.formatBadge || "Canva Editable",
    category_badge: p.categoryBadge || "Digital Asset",
    thumbnail: p.thumbnail,
    gallery: Array.isArray(p.gallery) ? p.gallery : [p.thumbnail],
    description: p.description,
    package_contents: Array.isArray(p.packageContents) ? p.packageContents : [],
    download_link: p.downloadLink || "",
    canva_link: p.downloadLink || "",
  };
}

/**
 * Fungsi Seed otomatis: Mengunggah 12 data produk dummy ke tabel `products` Supabase
 * jika tabel terdeteksi masih kosong.
 */
export async function seedProductsToSupabase() {
  if (!isSupabaseConfigured) {
    return mockProducts;
  }

  try {
    const payload = mockProducts.map(productToDbRow);
    const { data, error } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "id" })
      .select();

    if (error) {
      console.warn("Supabase auto-seed notice (bisa dipicu RLS atau koneksi):", error.message);
      return mockProducts;
    }

    if (data && data.length > 0) {
      return data.map(normalizeProduct);
    }
    return mockProducts;
  } catch (err) {
    console.warn("Error running seedProductsToSupabase:", err);
    return mockProducts;
  }
}

/**
 * Mengambil semua produk dari tabel `products` Supabase.
 * - Mengembalikan array produk ternormalisasi.
 * - Jika tabel kosong di Supabase, melakukan auto-seeding data dummy.
 * - Jika offline / error / kunci belum disetel, fallback aman ke mockProducts.
 */
export async function fetchProducts() {
  if (!isSupabaseConfigured) {
    return mockProducts;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.warn("Supabase fetchProducts warning, falling back to mockProducts:", error.message);
      return mockProducts;
    }

    // Jika tabel kosong, picu auto-seed otomatis
    if (!data || data.length === 0) {
      const seeded = await seedProductsToSupabase();
      return seeded;
    }

    return data.map(normalizeProduct);
  } catch (err) {
    console.warn("Exception in fetchProducts:", err);
    return mockProducts;
  }
}

/**
 * Mengambil detail 1 produk berdasarkan ID dari Supabase.
 */
export async function fetchProductById(id) {
  if (!id) return null;

  if (!isSupabaseConfigured) {
    const local = mockProducts.find((p) => String(p.id) === String(id));
    return local ? normalizeProduct(local) : null;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", String(id))
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetchProductById warning:", error.message);
      const fallback = mockProducts.find((p) => String(p.id) === String(id));
      return fallback ? normalizeProduct(fallback) : null;
    }

    if (data) {
      return normalizeProduct(data);
    }

    // Cek fallback jika ID ada di data mock lokal
    const fallback = mockProducts.find((p) => String(p.id) === String(id));
    return fallback ? normalizeProduct(fallback) : null;
  } catch (err) {
    console.warn("Exception in fetchProductById:", err);
    const fallback = mockProducts.find((p) => String(p.id) === String(id));
    return fallback ? normalizeProduct(fallback) : null;
  }
}

/**
 * Mengambil produk rekomendasi terkait dari kategori F&B yang sama.
 */
export async function fetchRelatedProducts(category, excludeId, limit = 3) {
  if (!isSupabaseConfigured) {
    return mockProducts
      .filter((p) => p.category === category && String(p.id) !== String(excludeId))
      .slice(0, limit)
      .map(normalizeProduct);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", String(excludeId))
      .limit(limit);

    if (error || !data || data.length === 0) {
      return mockProducts
        .filter((p) => p.category === category && String(p.id) !== String(excludeId))
        .slice(0, limit)
        .map(normalizeProduct);
    }

    return data.map(normalizeProduct);
  } catch {
    return mockProducts
      .filter((p) => p.category === category && String(p.id) !== String(excludeId))
      .slice(0, limit)
      .map(normalizeProduct);
  }
}
