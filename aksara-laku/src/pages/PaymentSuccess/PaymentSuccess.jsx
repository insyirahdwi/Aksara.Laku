import { useEffect } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { CheckCircle2, Download, LibraryBig } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { formatIDR } from "../../utils/helpers";
import SEOHead from "../../components/common/SEOHead";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { orders } = useAuth();
  const order = orders.find((o) => o.orderId === orderId);

  // Efek Selebrasi Confetti Otomatis saat Halaman Dimuat
  useEffect(() => {
    if (!order) return;

    // 1. Initial explosive confetti blast dari tengah
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.65 },
      colors: ["#D9534F", "#E67E22", "#77642E", "#2F6B45", "#162740"],
      disableForReducedMotion: true,
    });

    // 2. Kembang api samping kiri & kanan setelah 300ms untuk klimaks selebrasi
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: ["#D9534F", "#E67E22", "#77642E"],
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: ["#D9534F", "#E67E22", "#77642E"],
        disableForReducedMotion: true,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [order]);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-12 sm:py-16 flex items-center justify-center px-4 sm:px-6">
      <SEOHead
        title="Pembayaran Berhasil | Aksara.Laku"
        description="Transaksi pembayaran aset digital Anda di Aksara.Laku berhasil diverifikasi. Aset siap digunakan seumur hidup."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full mx-auto bg-white border border-[#77642e]/20 rounded-3xl p-8 sm:p-10 shadow-xl text-center"
      >
        {/* Success Icon with Spring Pop Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
          className="w-20 h-20 rounded-full bg-basil/15 border-2 border-basil/30 text-basil flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <CheckCircle2 size={44} />
        </motion.div>

        <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-basil/15 text-basil mb-2 tracking-wide uppercase">
          Transaksi Terverifikasi (SUCCESS)
        </span>
        <h1 className="font-display text-2xl sm:text-3xl text-[#162740] font-bold mb-2">
          Pembayaran Berhasil!
        </h1>
        <p className="text-xs sm:text-sm text-ink-soft mb-8 leading-relaxed max-w-md mx-auto">
          Terima kasih, <strong className="text-[#162740]">{order.customer.name}</strong>. Aset digital F&amp;B Anda telah terbit dan siap digunakan seumur hidup.
        </p>

        {/* Order Details Card */}
        <div className="border border-[#77642e]/20 rounded-2xl bg-[#FDFBF7] p-5 sm:p-6 text-left mb-8 shadow-2xs">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-[#77642e]/20">
            <span className="text-xs text-ink-soft font-medium">Nomor Pesanan</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#162740] bg-white px-2.5 py-1 rounded-lg border border-[#77642e]/15">
              {order.orderId}
            </span>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#77642e]/15 shadow-2xs"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-bold text-[#162740] truncate">{item.title}</p>
                  <span className="text-[10px] text-ink-soft/70 block">{item.category || "F&B Digital Asset"}</span>
                </div>
                <a
                  href={item.downloadLink || "https://canva.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D9534F]/10 hover:bg-[#D9534F] text-[#D9534F] hover:text-white text-xs font-bold transition-colors shrink-0"
                >
                  <Download size={13} />
                  <span>Akses</span>
                </a>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#77642e]/20 flex justify-between items-baseline font-display">
            <span className="text-xs font-bold text-ink-soft">Total Dibayar</span>
            <span className="text-xl font-extrabold text-[#D9534F] font-mono">
              {formatIDR(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-library" className="flex-1">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <LibraryBig size={17} />
              <span>Buka Pustaka Saya</span>
            </button>
          </Link>
          <Link to="/catalog" className="flex-1">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-[#77642e]/30 bg-white hover:bg-[#FDFBF7] text-[#162740] font-semibold text-sm shadow-xs hover:border-[#77642e] transition-all duration-200 cursor-pointer"
            >
              <span>Lanjut Belanja</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
