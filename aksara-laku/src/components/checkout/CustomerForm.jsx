import Input from "../common/Input";

export default function CustomerForm({ values, errors, onChange }) {
  return (
    <div className="rounded-2xl border border-[#77642e]/20 bg-white p-6 sm:p-7 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#77642e]/20">
        <h3 className="font-display text-lg sm:text-xl text-ink font-bold">
          Data Pembeli &amp; Penerima Lisensi
        </h3>
        <span className="text-[11px] text-ink-soft/70 font-medium">Wajib diisi</span>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <Input
            label="Nama Usaha (F&B)"
            name="name"
            placeholder="Contoh: Kopi Titik Kumpul / Dapur Bu Siti"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            error={errors.name}
            hint="Nama brand/usaha yang akan dicantumkan pada lisensi komersial"
            required
          />
        </div>

        <div>
          <Input
            label="Email Pengiriman File"
            name="email"
            type="email"
            placeholder="pemilik@usahamu.com"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            error={errors.email}
            hint="Link download Canva & PDF permanen akan dikirimkan ke alamat email ini"
            required
          />
        </div>

        <div>
          <Input
            label="No. WhatsApp"
            name="whatsapp"
            placeholder="08xxxxxxxxxx"
            value={values.whatsapp}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            error={errors.whatsapp}
            hint="Untuk konfirmasi status transaksi instan & layanan bantuan"
            required
          />
        </div>
      </div>
    </div>
  );
}
