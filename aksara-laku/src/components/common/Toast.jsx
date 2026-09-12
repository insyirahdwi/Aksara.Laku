import { createContext, useContext, useCallback, useState, useRef } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

const TOAST_CONFIG = {
  // Hijau untuk sukses/keranjang
  success: {
    container:
      "bg-emerald-50/95 border-emerald-500/30 text-emerald-950 border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-900/10",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    closeColor: "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100",
  },
  // Kuning untuk peringatan/login required
  warning: {
    container:
      "bg-amber-50/95 border-amber-500/30 text-amber-950 border-l-4 border-l-amber-500 shadow-lg shadow-amber-900/10",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    closeColor: "text-amber-600 hover:text-amber-800 hover:bg-amber-100",
  },
  // Biru untuk status login/logout
  info: {
    container:
      "bg-blue-50/95 border-blue-500/30 text-blue-950 border-l-4 border-l-blue-500 shadow-lg shadow-blue-900/10",
    icon: Info,
    iconColor: "text-blue-600",
    closeColor: "text-blue-600 hover:text-blue-800 hover:bg-blue-100",
  },
  // Merah untuk error
  error: {
    container:
      "bg-rose-50/95 border-rose-500/30 text-rose-950 border-l-4 border-l-rose-500 shadow-lg shadow-rose-900/10",
    icon: XCircle,
    iconColor: "text-rose-600",
    closeColor: "text-rose-600 hover:text-rose-800 hover:bg-rose-100",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const existing = timeoutsRef.current.get(id);
    if (existing) {
      clearTimeout(existing.fade);
      clearTimeout(existing.remove);
      timeoutsRef.current.delete(id);
    }

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 400);
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now() + Math.random();

      setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);

      // Start fade out at duration - 400ms (e.g. 2600ms)
      const fadeTimeout = setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
        );
      }, Math.max(0, duration - 400));

      // Remove after 3 seconds (duration)
      const removeTimeout = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timeoutsRef.current.delete(id);
      }, duration);

      timeoutsRef.current.set(id, { fade: fadeTimeout, remove: removeTimeout });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification melayang di pojok kanan atas */}
      <div
        className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 w-[min(92vw,380px)] pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md transition-all duration-400 ease-in-out ${
                config.container
              } ${
                toast.isExiting
                  ? "opacity-0 translate-x-6 scale-95"
                  : "opacity-100 translate-x-0 scale-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={20} className={`${config.iconColor} shrink-0`} />
                <span className="text-xs sm:text-sm font-semibold leading-snug">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${config.closeColor}`}
                aria-label="Tutup notifikasi"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
