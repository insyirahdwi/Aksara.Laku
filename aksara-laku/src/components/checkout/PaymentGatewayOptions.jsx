import { QrCode, Landmark, Wallet, ShieldCheck } from "lucide-react";

const PAYMENT_OPTIONS = [
  {
    id: "qris",
    label: "QRIS (Semua Pembayaran Digital)",
    badge: "Instan & Populer",
    description: "Scan barcode QRIS dari BCA Mobile, Livin, GoPay, OVO, DANA, ShopeePay, dll.",
    icon: QrCode,
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer / Virtual Account",
    badge: "Otomatis",
    description: "Nomor Virtual Account otomatis (BCA, Mandiri, BRI, BNI). Verifikasi tanpa upload bukti.",
    icon: Landmark,
  },
  {
    id: "ewallet",
    label: "E-Wallet (GoPay, OVO, DANA, ShopeePay)",
    badge: "Praktis",
    description: "Pembayaran langsung via akun e-wallet Anda yang terhubung.",
    icon: Wallet,
  },
];

export default function PaymentGatewayOptions({ selected, onSelect, error }) {
  return (
    <div className="rounded-2xl border border-[#77642e]/20 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-dashed border-[#77642e]/20">
        <h3 className="font-display text-lg sm:text-xl text-ink font-bold">
          Pilihan Metode Pembayaran
        </h3>
        <span className="flex items-center gap-1 text-[11px] text-basil font-semibold">
          <ShieldCheck size={14} /> Terenkripsi 256-bit
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {PAYMENT_OPTIONS.map((method) => {
          const active = selected === method.id;
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={`flex items-start gap-3.5 text-left p-4 border rounded-xl transition-all duration-300 ease-in-out cursor-pointer ${
                active
                  ? "border-[#D9534F] bg-[#D9534F]/5 ring-2 ring-[#D9534F]/20 shadow-xs"
                  : "border-[#77642e]/20 bg-white hover:bg-[#FDFBF7]"
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 mt-0.5 transition-colors duration-300 ${
                  active ? "bg-[#D9534F] text-white" : "bg-[#FDFBF7] text-[#77642e] border border-[#77642e]/20"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-ink">{method.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#77642e]/10 text-[#77642e] border border-[#77642e]/25">
                    {method.badge}
                  </span>
                </div>
                <span className="block text-xs text-ink-soft/80 mt-1 leading-relaxed">
                  {method.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-chili font-semibold mt-3">{error}</p>}
    </div>
  );
}
