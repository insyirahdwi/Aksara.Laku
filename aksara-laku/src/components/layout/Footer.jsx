import { Link } from "react-router-dom";
import { CATEGORIES } from "../../utils/constants";
import BrandLogo from "../common/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#162740] text-paper mt-24 border-t border-[#77642e]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 flex flex-col items-start gap-3.5">
          <BrandLogo variant="badge" size="md" />
          <p className="text-[#E67E22] font-serif text-sm italic tracking-wide font-medium">
            -Dari kata jadi karya-
          </p>
          <p className="text-paper/70 text-xs sm:text-sm max-w-sm leading-relaxed font-light">
            Koleksi aset digital dan template Canva siap pakai berlisensi komersial seumur hidup khusus pemilik bisnis kuliner F&amp;B di seluruh Indonesia.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3 text-[#E67E22]">Kategori</p>
          <ul className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/catalog?category=${cat.id}`}
                  className="text-sm text-paper/70 hover:text-paper transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3 text-[#E67E22]">Navigasi</p>
          <ul className="flex flex-col gap-2">
            <li><Link to="/matcher" className="text-sm text-paper/70 hover:text-paper">Niche Matcher</Link></li>
            <li><Link to="/my-library" className="text-sm text-paper/70 hover:text-paper">Pustaka Saya</Link></li>
            <li><Link to="/cart" className="text-sm text-paper/70 hover:text-paper">Keranjang</Link></li>
            <li><Link to="/admin/analytics" className="text-sm text-paper/70 hover:text-paper">Admin Analytics</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/50">
        &copy; {new Date().getFullYear()} Aksara.Laku. -Dari kata jadi karya-. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
