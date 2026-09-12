import { Link } from "react-router-dom";

/**
 * Komponen BrandLogo resmi Aksara.Laku
 * Mendukung varian:
 * - "default": Logo resmi resolusi tinggi dengan latar transparan (untuk header / light background)
 * - "light": Logo dengan teks putih untuk background gelap (footer / dark hero)
 * - "badge": Logo di dalam kartu badge putih rounded dengan shadow lembut
 */
export default function BrandLogo({
  variant = "default",
  size = "md",
  withLink = true,
  className = "",
  imgClassName = "",
}) {
  const heightClasses = {
    xs: "h-8 sm:h-9",
    sm: "h-10 sm:h-12",
    md: "h-14 sm:h-16 lg:h-18",
    lg: "h-16 sm:h-20 lg:h-24",
    hero: "h-20 sm:h-28 lg:h-34",
    xl: "h-28 sm:h-36 lg:h-48",
  };

  const selectedHeight = heightClasses[size] || heightClasses.md;

  const logoSrc =
    variant === "light"
      ? "/logo-light.png"
      : "/logo-transparent.png";

  const content = (
    <div className={`inline-flex items-center group select-none ${className}`}>
      {variant === "badge" ? (
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#77642e]/15 flex items-center transition-all duration-300 group-hover:scale-102 group-hover:shadow-md">
          <img
            src="/logo-transparent.png"
            alt="Aksara.Laku - Dari kata jadi karya"
            className={`${selectedHeight} ${imgClassName} w-auto object-contain`}
            loading="eager"
            decoding="async"
          />
        </div>
      ) : (
        <img
          src={logoSrc}
          alt="Aksara.Laku - Dari kata jadi karya"
          className={`${selectedHeight} ${imgClassName} w-auto object-contain transition-transform duration-300 group-hover:scale-102 drop-shadow-xs`}
          loading="eager"
          decoding="async"
        />
      )}
      <span className="sr-only">Aksara.Laku - Dari kata jadi karya</span>
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-block shrink-0" aria-label="Aksara.Laku Beranda">
        {content}
      </Link>
    );
  }

  return content;
}
