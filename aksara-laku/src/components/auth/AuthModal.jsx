import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../common/Toast";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import BrandLogo from "../common/BrandLogo";
import { Store, AlertCircle, Sparkles, Loader2 } from "lucide-react";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab);
  const { login, register } = useAuth();
  const { showToast } = useToast();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setBusinessName("");
    setWhatsapp("");
    setErrors({});
    setFormError("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrors({});
    setFormError("");
  };

  const validate = () => {
    const nextErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!emailRegex.test(emailTrimmed)) {
      nextErrors.email = "Format email tidak valid. Wajib menyertakan '@' dan domain '.com' (contoh: nama@domain.com).";
    }

    if (!password) {
      nextErrors.password = "Kata sandi wajib diisi.";
    } else if (password.length < 6) {
      nextErrors.password = "Kata sandi minimal 6 karakter.";
    }

    if (tab === "register") {
      if (!businessName.trim()) {
        nextErrors.businessName = "Nama usaha F&B wajib diisi.";
      } else if (businessName.trim().length < 2) {
        nextErrors.businessName = "Nama usaha minimal 2 karakter.";
      }

      const waCleaned = whatsapp.trim().replace(/[\s-]/g, "");
      if (!whatsapp.trim()) {
        nextErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
      } else if (!/^[0-9]+$/.test(waCleaned) && !/^\+[0-9]+$/.test(waCleaned)) {
        nextErrors.whatsapp = "Nomor WhatsApp harus berupa angka.";
      } else if (waCleaned.replace(/^\+/, "").length < 10) {
        nextErrors.whatsapp = "Nomor WhatsApp minimal 10 digit angka.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Mencegah klik ganda
    setFormError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (tab === "login") {
        await login({ email: email.trim(), password });
        showToast("Berhasil masuk (login)! Selamat datang kembali.", "success");
      } else {
        await register({
          email: email.trim(),
          password,
          businessName: businessName.trim(),
          whatsapp: whatsapp.trim(),
        });
        showToast(`Berhasil mendaftar akun! Selamat datang, ${businessName.trim()}.`, "success");
      }
      handleClose();
    } catch (err) {
      const rawMsg = err.message || "";
      let friendlyMsg = rawMsg;

      // Handle Supabase specific error messages
      if (
        rawMsg.toLowerCase().includes("invalid login credentials") ||
        rawMsg.toLowerCase().includes("invalid_grant") ||
        rawMsg.toLowerCase().includes("kata sandi salah")
      ) {
        friendlyMsg = "Email atau kata sandi salah. Silakan periksa kembali.";
        setErrors((prev) => ({ ...prev, password: "Kata sandi salah atau akun tidak ditemukan." }));
      } else if (
        rawMsg.toLowerCase().includes("user already registered") ||
        rawMsg.toLowerCase().includes("already exists") ||
        rawMsg.toLowerCase().includes("sudah terdaftar")
      ) {
        friendlyMsg = "Email ini sudah terdaftar. Silakan masuk menggunakan tab Login.";
        setErrors((prev) => ({ ...prev, email: "Email sudah digunakan oleh akun lain." }));
      } else if (rawMsg.toLowerCase().includes("email not confirmed")) {
        friendlyMsg = "Email belum dikonfirmasi. Silakan periksa kotak masuk email Anda.";
      } else if (rawMsg.toLowerCase().includes("password should be at least")) {
        friendlyMsg = "Kata sandi minimal 6 karakter.";
      } else if (rawMsg.toLowerCase().includes("network") || rawMsg.toLowerCase().includes("fetch")) {
        friendlyMsg = "Gagal terhubung ke server autentikasi. Periksa koneksi internet Anda.";
      }

      setFormError(friendlyMsg);
      showToast(friendlyMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={tab === "login" ? "Masuk ke Aksara.Laku" : "Daftar Akun Baru"}
      size="md"
      overlayClassName="bg-black/50 backdrop-blur-sm"
      cardClassName="rounded-3xl"
    >
      {/* Brand Logo Header */}
      <div className="flex flex-col items-center justify-center pt-1 pb-4">
        <BrandLogo withLink={false} size="md" />
        <p className="text-xs text-ink-soft/80 mt-1 font-serif italic tracking-wide">
          -Dari kata jadi karya-
        </p>
      </div>

      {/* Tab Switcher: Smooth sliding segmented control */}
      <div className="relative grid grid-cols-2 p-1.5 bg-[#FDFBF7] border border-[#77642e]/15 rounded-2xl mb-6">
        {/* Smooth sliding active background pill */}
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-[#D9534F] shadow-sm transition-all duration-300 ease-in-out ${
            tab === "login" ? "left-1.5" : "left-[50%]"
          }`}
        />
        <button
          type="button"
          onClick={() => handleTabChange("login")}
          className={`relative z-10 py-2.5 text-xs sm:text-sm font-bold text-center rounded-xl transition-colors duration-300 ease-in-out cursor-pointer ${
            tab === "login" ? "text-white" : "text-[#162740] hover:text-[#D9534F]"
          }`}
        >
          Masuk (Login)
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("register")}
          className={`relative z-10 py-2.5 text-xs sm:text-sm font-bold text-center rounded-xl transition-colors duration-300 ease-in-out cursor-pointer ${
            tab === "register" ? "text-white" : "text-[#162740] hover:text-[#D9534F]"
          }`}
        >
          Daftar (Register)
        </button>
      </div>

      {formError && (
        <div className="mb-4 p-3.5 bg-[#D9534F]/10 border border-[#D9534F]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#D9534F]">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-medium">{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {tab === "register" && (
          <>
            <div>
              <Input
                id="auth-businessName"
                label="Nama Usaha F&B"
                placeholder="Contoh: Kopi Titik Kumpul / Dapur Bu Siti"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: undefined }));
                }}
                error={errors.businessName}
                autoComplete="organization"
                required
              />
              <p className="text-[11px] text-ink-soft/70 mt-1 flex items-center gap-1">
                <Store size={12} />
                Digunakan untuk kustomisasi template dan lisensi aset.
              </p>
            </div>

            <div>
              <Input
                id="auth-whatsapp"
                label="No. WhatsApp Usaha"
                type="tel"
                placeholder="Contoh: 081234567890 (minimal 10 digit)"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                }}
                error={errors.whatsapp}
                autoComplete="tel"
                required
              />
              <p className="text-[11px] text-ink-soft/70 mt-1">
                Hanya angka &amp; minimal 10 digit untuk notifikasi lisensi dan bantuan tim.
              </p>
            </div>
          </>
        )}

        <Input
          id="auth-email"
          label="Alamat Email"
          type="email"
          placeholder="pemilik@usahaanda.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Input
          id="auth-password"
          label="Kata Sandi"
          type="password"
          placeholder={tab === "register" ? "Minimal 6 karakter" : "Masukkan kata sandi"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete={tab === "register" ? "new-password" : "current-password"}
          required
        />

        {tab === "login" && (
          <div className="bg-[#FDFBF7] p-3.5 border border-[#77642e]/20 rounded-xl text-xs text-ink-soft">
            <p className="font-bold text-ink flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-[#D9534F]" />
              Pilih Akun Testing (1-Klik Isi):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("owner@kopisenja.com");
                  setPassword("password123");
                  setErrors({});
                }}
                className="p-2 rounded-lg bg-white border border-[#77642e]/20 hover:border-[#77642e] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <span className="font-bold text-[#162740] block text-[11px]">👤 Customer F&amp;B</span>
                <span className="text-[10px] text-ink-soft/80 block font-mono truncate">owner@kopisenja.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@aksaralaku.com");
                  setPassword("adminpassword");
                  setErrors({});
                }}
                className="p-2 rounded-lg bg-[#D9534F]/5 border border-[#D9534F]/30 hover:border-[#D9534F] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <span className="font-bold text-[#D9534F] block text-[11px]">🛡️ Administrator</span>
                <span className="text-[10px] text-ink-soft/80 block font-mono truncate">admin@aksaralaku.com</span>
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={isLoading}
          className="mt-2 py-3.5 bg-[#D9534F] hover:bg-[#c9433f] active:bg-[#b53531] font-bold shadow-md hover:shadow-lg text-sm sm:text-base rounded-xl transition-all duration-300 disabled:opacity-75 disabled:cursor-wait"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin text-white" />
              <span>Memproses {tab === "login" ? "Masuk..." : "Pendaftaran..."}</span>
            </span>
          ) : tab === "login" ? (
            "Masuk Sekarang"
          ) : (
            "Daftar Akun F&B"
          )}
        </Button>

        <div className="text-center mt-2">
          {tab === "login" ? (
            <p className="text-xs text-ink-soft">
              Belum memiliki akun usaha?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className="text-[#D9534F] font-bold hover:underline cursor-pointer"
              >
                Daftar sekarang
              </button>
            </p>
          ) : (
            <p className="text-xs text-ink-soft">
              Sudah memiliki akun terdaftar?{" "}
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="text-[#D9534F] font-bold hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
