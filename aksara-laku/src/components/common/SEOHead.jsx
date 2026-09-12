import { useEffect } from "react";

const DEFAULT_TITLE =
  "Aksara.Laku - Digital Branding Kit & Template Canva Industri F&B";
const DEFAULT_DESCRIPTION =
  "Koleksi aset digital dan template Canva siap edit khusus bisnis kuliner F&B. Dari kedai kopi, bakery, street food, hingga resto nusantara — jadikan visual brand kuliner Anda naik kelas dan memikat pelanggan.";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=630&q=85";

/**
 * Komponen SEOHead mandiri (native zero-dependency) untuk menyinkronkan
 * document.title serta meta tags Open Graph (WhatsApp, Instagram, Facebook) dan Twitter Card.
 */
export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    const currentUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    // Helper untuk mengupdate atau membuat meta tag
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let element = document.querySelector(
        `meta[${attributeName}="${attributeValue}"]`
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // 2. Standard SEO Meta
    setMetaTag("name", "description", description);

    // 3. Open Graph Tags (WhatsApp, Instagram, Facebook, LinkedIn)
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "Aksara.Laku");
    setMetaTag("property", "og:locale", "id_ID");

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);
  }, [title, description, image, url, type]);

  return null;
}
