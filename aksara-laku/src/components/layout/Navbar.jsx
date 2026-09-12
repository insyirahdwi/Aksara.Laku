import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  Sparkles,
  LibraryBig,
  LogIn,
  LogOut,
  User,
  Lock,
  ChevronDown,
  BarChart3,
  Upload,
  Shield,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../common/Toast";
import MobileNav from "./MobileNav";
import AuthModal from "../auth/AuthModal";
import BrandLogo from "../common/BrandLogo";

const NAV_LINKS = [
  { to: "/catalog", label: "Katalog" },
  { to: "/matcher", label: "Niche Matcher" },
  { to: "/my-library", label: "Pustaka Saya" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { showToast } = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleOpenAuth = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    showToast("Anda telah berhasil keluar (logout).", "info");
  };

  const displayName = user?.businessName || user?.name || user?.email || "Pengguna";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#77642e]/15 shadow-2xs transition-all duration-300 ease-in-out">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
          <BrandLogo size="lg" />

          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-1.5 ${
                    isActive ? "text-chili font-semibold" : "text-ink hover:text-chili"
                  }`
                }
              >
                {link.to === "/matcher" && <Sparkles size={15} />}
                {link.to === "/my-library" && <LibraryBig size={15} />}
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              aria-label="Keranjang Belanja"
              className="relative p-2 text-ink hover:text-chili transition-all duration-300 ease-in-out rounded-xl hover:bg-paper-dim"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-chili text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Integration with Icons */}
            <div className="hidden md:flex items-center">
              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => handleOpenAuth("login")}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold border border-ink text-ink hover:bg-ink hover:text-white rounded-xl shadow-xs hover:shadow-sm transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <LogIn size={16} />
                  <span>Login / Daftar</span>
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-paper-dim border border-transparent hover:border-line transition-all duration-300 ease-in-out cursor-pointer"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-turmeric/20 border border-turmeric text-ink flex items-center justify-center text-xs font-bold font-display">
                      <User size={15} className="text-ink" />
                    </div>
                    <span className="text-sm font-semibold text-ink max-w-[130px] truncate text-left">
                      {displayName}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-ink-soft transition-transform duration-300 ease-in-out ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-md border border-[#77642e]/20 rounded-2xl shadow-xl p-2.5 z-50 transition-all duration-300 ease-in-out">
                      <div className="px-3 py-2 border-b border-dashed border-[#77642e]/20">
                        <div className="flex items-center justify-between gap-1.5 text-xs text-ink-soft mb-1">
                          <div className="flex items-center gap-1.5">
                            <User size={13} />
                            <span>Masuk sebagai</span>
                          </div>
                          {user?.role === "admin" ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D9534F] text-white flex items-center gap-1">
                              <Shield size={10} />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#162740]/10 text-[#162740]">
                              Customer
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-ink truncate">{displayName}</p>
                        {user?.email && (
                          <p className="text-xs text-ink-soft/80 truncate mt-0.5">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-library"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-[#FDFBF7] hover:text-[#D9534F] rounded-xl transition-all duration-300 ease-in-out"
                        >
                          <Lock size={15} className="text-[#77642e]" />
                          <span>My Library / Aset Saya</span>
                        </Link>

                        {/* Tautan Khusus Admin: Hanya tampil jika user?.role === 'admin' */}
                        {user?.role === "admin" && (
                          <>
                            <div className="my-1 border-t border-dashed border-[#77642e]/15" />
                            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D9534F]">
                              Akses Administrator
                            </div>
                            <Link
                              to="/admin/analytics"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-[#FDFBF7] hover:text-[#D9534F] rounded-xl transition-all duration-300 ease-in-out font-medium"
                            >
                              <BarChart3 size={15} className="text-[#D9534F]" />
                              <span>Dashboard Admin</span>
                            </Link>
                            <Link
                              to="/admin/upload"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-[#FDFBF7] hover:text-[#D9534F] rounded-xl transition-all duration-300 ease-in-out font-medium"
                            >
                              <Upload size={15} className="text-[#77642e]" />
                              <span>Upload Aset Digital</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-dashed border-[#77642e]/20">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#D9534F] hover:bg-[#D9534F]/10 rounded-xl transition-all duration-300 ease-in-out text-left cursor-pointer"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-ink"
              aria-label="Buka menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <MobileNav
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          links={NAV_LINKS}
          isLoggedIn={isLoggedIn}
          user={user}
          onLogout={handleLogout}
          onOpenAuth={handleOpenAuth}
        />
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
