const TESTIMONIALS = [
  {
    name: "Dinda — Owner, Kopi Sedjuk",
    quote:
      "Konten kalender 30 hari ini bikin feed Instagram kedai saya jauh lebih rapi. Nggak perlu mikir caption tiap hari lagi.",
  },
  {
    name: "Bang Rudi — Warung Padang Berkah",
    quote:
      "Template promo menunya gampang banget diedit di HP, langsung posting waktu ada diskon.",
  },
  {
    name: "Sari — Sari's Homemade Bakery",
    quote:
      "Branding kit-nya bikin bakery saya kelihatan jauh lebih profesional. Pelanggan sampai nanya siapa yang desain.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#FDFBF7] py-16 border-t border-[#77642e]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">
          Apa kata pelaku usaha F&amp;B
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl bg-[#FFFFFF] border border-[#77642e]/20 p-6 sm:p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <blockquote className="text-sm text-ink-soft mb-4 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="text-sm font-semibold text-chili">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
