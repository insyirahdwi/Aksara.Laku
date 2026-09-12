import { useEffect, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./common/Toast";

/**
 * Protected Route khusus Admin Aksara.Laku.
 * Memvalidasi apakah user sedang login dan memiliki role === 'admin'.
 * Jika tidak berhak, redirect paksa ke '/' dan tampilkan toast penolakan akses.
 */
export default function AdminRoute({ children }) {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const hasAlertedRef = useRef(false);

  const isAdmin = isLoggedIn && user?.role === "admin";

  useEffect(() => {
    if (!isAdmin && !hasAlertedRef.current) {
      hasAlertedRef.current = true;
      showToast("Akses Ditolak: Halaman ini khusus Admin Aksara.Laku", "error");
    }
  }, [isAdmin, showToast]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
