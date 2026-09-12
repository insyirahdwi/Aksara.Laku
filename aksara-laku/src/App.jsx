import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { MatcherProvider } from "./context/MatcherContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/common/Toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingWA from "./components/layout/FloatingWA";

// Lazy Loaded Pages for Code Splitting and Faster Initial Page Load
const Home = lazy(() => import("./pages/Home/Home"));
const Catalog = lazy(() => import("./pages/Catalog/Catalog"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess/PaymentSuccess"));
const MyLibrary = lazy(() => import("./pages/MyLibrary/MyLibrary"));
const Matcher = lazy(() => import("./pages/Matcher/Matcher"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminUpload = lazy(() => import("./pages/AdminUpload"));

import AdminRoute from "./components/AdminRoute";

// Aesthetic Page Loading Fallback
function PageLoadingFallback() {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-label="Memuat konten halaman"
    >
      <div className="relative mb-4">
        {/* Animated Brand Pulse Rings */}
        <div className="w-14 h-14 rounded-2xl bg-[#162740]/10 flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 rounded-xl bg-[#D9534F] animate-spin flex items-center justify-center text-white font-serif font-black text-sm shadow-md">
            A
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold text-[#162740] tracking-wide">
        Aksara<span className="text-[#D9534F]">.Laku</span>
      </p>
      <p className="text-xs text-ink-soft mt-1 animate-pulse">
        Menyiapkan aset visual terbaik...
      </p>
    </div>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/matcher" element={<Matcher />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/my-library" element={<MyLibrary />} />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <AdminRoute>
                  <AdminUpload />
                </AdminRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <MatcherProvider>
              <AppShell />
            </MatcherProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
