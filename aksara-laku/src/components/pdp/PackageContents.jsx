import { CheckCircle2 } from "lucide-react";

export default function PackageContents({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="ticket-corners border border-line p-5">
      <h3 className="font-display text-lg text-ink mb-3">Isi Paket</h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
            <CheckCircle2 size={17} className="text-basil flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
