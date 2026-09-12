import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "../../utils/constants";

export default function FloatingWA() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-basil text-paper px-4 py-3 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:brightness-110 transition"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-semibold hidden sm:inline">Tanya Admin</span>
    </a>
  );
}
