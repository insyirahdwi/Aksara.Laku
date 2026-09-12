import { useState } from "react";

export default function ImageGallery({ images, title }) {
  const gallery = images && images.length > 0 ? images : [];
  const [active, setActive] = useState(0);

  if (gallery.length === 0) return null;

  return (
    <div>
      <div className="ticket-corners border border-line overflow-hidden aspect-square mb-3">
        <img
          src={gallery[active]}
          alt={`${title} — tampilan ${active + 1}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 border overflow-hidden flex-shrink-0 ${
                active === i ? "border-chili" : "border-line"
              }`}
              aria-label={`Lihat gambar ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
