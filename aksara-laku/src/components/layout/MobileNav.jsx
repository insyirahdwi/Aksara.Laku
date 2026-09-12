import { NavLink } from "react-router-dom";
import { X, LogIn, LogOut, User, Sparkles, LibraryBig, BarChart3, Upload } from "lucide-react";
import BrandLogo from "../common/BrandLogo";

export default function MobileNav({
  isOpen,
  onClose,
  links,
  isLoggedIn,
  user,
  onLogout,
  onOpenAuth,
}) {
  if (!isOpen) return null;

  const displayName = user?.businessName || user?.name || user?.email || "Pengguna";

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-72 bg-[#FDFBF7] border-l border-[#77642e]/20 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out">
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-dashed border-[#77642e]/20">
            <BrandLogo size="md" />
            <button
              onClick={onClose}
              aria-label="Tutup menu"
              className="p-1 text-ink hover:text-[#D9534F] hover:bg-white rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Card on Mobile if Logged In */}
          {isLoggedIn && (
            <div className="mb-6 p-3.5 bg-white border border-line rounded-2xl shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-turmeric/20 border border-turmeric text-ink flex items-center justify-center text-sm font-bold font-display shrink-0">
                  <User size={16} className="text-ink" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{displayName}</p>
                  {user?.email && (
                    <p className="text-xs text-ink-soft/80 truncate">{user.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `text-lg font-display flex items-center gap-2 transition-all duration-300 ease-in-out ${
                    isActive ? "text-chili font-semibold" : "text-ink hover:text-chili"
                  }`
                }
              >
                {link.to === "/matcher" && <Sparkles size={18} />}
                {link.to === "/my-library" && <LibraryBig size={18} />}
                {link.label}
              </NavLink>
            ))}

            {/* Admin Links for Mobile */}
            {user?.role === "admin" && (
              <>
                <div className="my-1 border-t border-dashed border-[#77642e]/20" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9534F]">
                  Admin Aksara.Laku
                </span>
                <NavLink
                  to="/admin/analytics"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `text-lg font-display flex items-center gap-2 transition-all duration-300 ease-in-out ${
                      isActive ? "text-chili font-semibold" : "text-ink hover:text-chili"
                    }`
                  }
                >
                  <BarChart3 size={18} className="text-[#D9534F]" />
                  <span>Dashboard Admin</span>
                </NavLink>
                <NavLink
                  to="/admin/upload"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `text-lg font-display flex items-center gap-2 transition-all duration-300 ease-in-out ${
                      isActive ? "text-chili font-semibold" : "text-ink hover:text-chili"
                    }`
                  }
                >
                  <Upload size={18} className="text-[#77642e]" />
                  <span>Upload Aset Digital</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-dashed border-line">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth?.("login");
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 font-semibold text-sm bg-ink text-white hover:bg-ink/90 rounded-xl shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
            >
              <LogIn size={16} />
              <span>Login / Daftar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-chili border border-chili/40 hover:bg-chili/10 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
            >
              <LogOut size={16} />
              <span>Keluar (Logout)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
