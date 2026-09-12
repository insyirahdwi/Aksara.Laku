import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  overlayClassName = "bg-black/50 backdrop-blur-sm",
  cardClassName = "rounded-3xl",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const sizeClass =
    size === "2xl"
      ? "max-w-5xl"
      : size === "xl"
      ? "max-w-4xl"
      : size === "lg"
      ? "max-w-2xl"
      : size === "sm"
      ? "max-w-sm"
      : "max-w-md";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 350 }}
            className={`relative w-full ${sizeClass} bg-white border border-[#77642e]/20 ${cardClassName} shadow-2xl max-h-[90vh] overflow-y-auto`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-dashed border-[#77642e]/20">
              <h2 className="font-display text-xl text-ink font-bold">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="p-1.5 rounded-xl text-ink-soft hover:text-[#D9534F] hover:bg-[#FDFBF7] transition-all duration-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
