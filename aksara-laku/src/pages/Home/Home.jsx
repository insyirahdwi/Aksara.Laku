import Hero from "../../components/home/Hero";
import TrustShowcase from "../../components/home/TrustShowcase";
import HomeMatcherWidget from "../../components/home/HomeMatcherWidget";
import VisualImpact from "../../components/home/VisualImpact";
import AICaptionGenerator from "../../components/AICaptionGenerator";
import HomeCatalog from "../../components/home/HomeCatalog";
import Testimonials from "../../components/home/Testimonials";
import SEOHead from "../../components/common/SEOHead";

export default function Home() {
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="flex flex-col bg-[#FDFBF7] min-h-screen">
      <SEOHead
        title="Aksara.Laku - Digital Branding Kit & Template Canva Industri F&B"
        description="Koleksi aset digital dan template Canva siap edit khusus bisnis kuliner F&B. Dari kedai kopi, bakery, street food, hingga resto nusantara — jadikan visual brand kuliner Anda naik kelas dan memikat pelanggan."
      />
      {/* 1. Hero Section (Atas - Split 2 Kolom dengan Floating Collage) */}
      <Hero
        onExploreClick={(e) => {
          e.preventDefault();
          scrollToSection("catalog");
        }}
        onMatcherClick={(e) => {
          e.preventDefault();
          scrollToSection("matcher");
        }}
      />

      {/* 2. Trust & Showcase Section (Di Bawah Hero - Niche F&B & Bukti Teruji) */}
      <TrustShowcase />

      {/* 3. Interactive Section (F&B Niche Matcher Card max-w-4xl) */}
      <HomeMatcherWidget />

      {/* 4. Visual Impact Section (Perbandingan Before & After & Counter Statistik) */}
      <VisualImpact />

      {/* 5. AI Caption Generator Section (Studio Copywriting AI Interaktif) */}
      <AICaptionGenerator />

      {/* 6. Catalog & Filter Section (Live Search & Multi-Tag Niche Filter) */}
      <HomeCatalog />

      {/* 7. Social Proof / Testimonials */}
      <Testimonials />
    </div>
  );
}
