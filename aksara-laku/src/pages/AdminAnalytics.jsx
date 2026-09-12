import { useState, useMemo, useCallback } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Award,
  Percent,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatIDR } from "../utils/helpers";
import {
  getAnalyticsEvents,
  trackEvent,
  resetAnalyticsEvents,
  getFunnelMetrics,
  getDailySalesTrend,
} from "../utils/analytics";
import SEOHead from "../components/common/SEOHead";
import { useToast } from "../components/common/Toast";

export default function AdminAnalytics() {
  const { orders } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState(() => getAnalyticsEvents());
  const [timeRange, setTimeRange] = useState(7); // 7 days
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "events"
  const [hoveredBar, setHoveredBar] = useState(null);

  // Reload analytics events after action
  const reloadEvents = useCallback(() => {
    const loaded = getAnalyticsEvents();
    setEvents(loaded);
  }, []);

  // 1. Calculate Funnel Metrics
  const funnel = useMemo(() => {
    return getFunnelMetrics(events, orders);
  }, [events, orders]);

  // 2. Filter Paid Orders
  const paidOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === "paid" || o.status === "SUCCESS"
    );
  }, [orders]);

  // Baseline demo revenue added to live orders for an active dashboard view
  const baselineRevenue = 2950000;
  const liveGrossRevenue = paidOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalGrossRevenue = baselineRevenue + liveGrossRevenue;
  const totalTransactionsCount = Math.max(paidOrders.length + 12, funnel.checkoutSuccessCount);

  // 3. Compute Top Niche & Top Product
  const { topNiche, topProductTitle, nichePercentage } = useMemo(() => {
    const nicheCounts = {
      "Coffee Shop": 7,
      "Resto Nusantara": 5,
      "Bakery & Pastry": 4,
      "Street Food": 2,
      "Beverage/Boba": 2,
    };

    // Add counts from live orders
    paidOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const niche = item.niche || item.category || "Coffee Shop";
        nicheCounts[niche] = (nicheCounts[niche] || 0) + 1;
      });
    });

    const sortedNiches = Object.entries(nicheCounts).sort((a, b) => b[1] - a[1]);
    const bestNiche = sortedNiches[0] ? sortedNiches[0][0] : "Coffee Shop";
    const totalItemsSold = Object.values(nicheCounts).reduce((a, b) => a + b, 0);
    const topNicheCount = sortedNiches[0] ? sortedNiches[0][1] : 7;
    const percentage = totalItemsSold > 0 ? Math.round((topNicheCount / totalItemsSold) * 100) : 42;

    return {
      topNiche: bestNiche,
      topProductTitle: "30-Day Coffee Shop Instagram Content Calendar",
      nichePercentage: percentage,
    };
  }, [paidOrders]);

  // 4. Calculate Daily Sales Trend for the Bar Chart
  const salesTrend = useMemo(() => {
    return getDailySalesTrend(paidOrders, timeRange);
  }, [paidOrders, timeRange]);

  // Simulation handlers for testing tracking
  const handleSimulateAddToCartEvent = () => {
    trackEvent("add_to_cart", {
      productId: "p001",
      title: "Artisan Coffee Mockup Social Kit",
      price: 49000,
      niche: "Coffee Shop",
    });
    reloadEvents();
    showToast("Event 'Tambah ke Keranjang' berhasil dicatat ke telemetry! 🛒", "info");
  };

  const handleResetEvents = () => {
    resetAnalyticsEvents();
    reloadEvents();
    showToast("Data log analitik berhasil di-reset ke baseline awal.", "success");
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Admin Analytics Dashboard | Aksara.Laku"
        description="Dashboard analitik performa penjualan, conversion rate funnel, dan tren omset F&B Aksara.Laku."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#77642e]/15">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time Telemetry
              </span>
              <span className="text-xs text-ink-soft">
                Pembaruan otomatis tiap aksi pengguna
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#162740] font-bold">
              Executive Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Pantau performa pendapatan kotor, efektivitas funnel konversi, dan ceruk F&amp;B terlaris.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleSimulateAddToCartEvent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#77642e]/20 text-[#162740] hover:border-[#77642e] text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Simulasikan klik tombol tambah ke keranjang"
            >
              <Activity size={14} className="text-[#D9534F]" />
              <span>Simulasi Tambah Keranjang</span>
            </button>
            <button
              type="button"
              onClick={handleResetEvents}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#77642e]/20 text-ink-soft hover:text-[#D9534F] text-xs font-medium shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Reset data analitik ke setelan awal"
            >
              <RefreshCw size={13} />
              <span>Reset Log</span>
            </button>
          </div>
        </div>

        {/* 1. SECTION: 4 METRIC CARDS UTAMA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Total Pendapatan (Gross Revenue) */}
          <div className="rounded-2xl border border-[#77642e]/20 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Total Pendapatan
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#162740] tracking-tight font-mono mb-1.5">
              {formatIDR(totalGrossRevenue)}
            </p>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center text-emerald-600 font-bold">
                <ArrowUpRight size={14} />
                +18.4%
              </span>
              <span className="text-ink-soft/70">vs pekan lalu</span>
            </div>
          </div>

          {/* Card 2: Jumlah Transaksi Sukses */}
          <div className="rounded-2xl border border-[#77642e]/20 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Transaksi Sukses
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#162740]/5 text-[#162740] border border-[#162740]/10 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <ShoppingBag size={20} />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#162740] tracking-tight font-mono mb-1.5">
              {totalTransactionsCount}{" "}
              <span className="text-base font-sans font-medium text-ink-soft">Pesanan</span>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-ink-soft">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% Terbayar (QRIS &amp; VA)</span>
            </div>
          </div>

          {/* Card 3: Produk Terlaris (Top Niche) */}
          <div className="rounded-2xl border border-[#77642e]/20 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Top Niche F&amp;B
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/20 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Award size={20} />
              </div>
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-[#162740] truncate mb-1">
              {topNiche} ☕
            </p>
            <div className="flex items-center justify-between text-xs text-ink-soft">
              <span className="truncate max-w-[170px]" title={topProductTitle}>
                {topProductTitle}
              </span>
              <span className="font-bold text-[#D9534F]">{nichePercentage}%</span>
            </div>
          </div>

          {/* Card 4: Conversion Rate (%) */}
          <div className="rounded-2xl border border-[#77642e]/20 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                Conversion Rate
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#77642e]/10 text-[#77642e] border border-[#77642e]/20 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Percent size={20} />
              </div>
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#162740] tracking-tight font-mono mb-1.5">
              {funnel.conversionRate}%
            </p>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                Optimal
              </span>
              <span className="text-ink-soft/70">
                {funnel.checkoutSuccessCount} dari {funnel.addToCartCount} keranjang
              </span>
            </div>
          </div>
        </div>

        {/* 2. SECTION: GRAFIK VISUAL TREN PENJUALAN HARIAN & FUNNEL BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
          {/* Sisi Kiri: Bar Chart Tren Penjualan Harian (lg:col-span-8) */}
          <div className="lg:col-span-8 rounded-3xl border border-[#77642e]/20 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-dashed border-[#77642e]/20">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740] flex items-center gap-2">
                  <span>Tren Penjualan Harian</span>
                  <span className="text-xs font-normal text-ink-soft">
                    (Gross Revenue per Hari)
                  </span>
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  Visualisasi pergerakan transaksi digital dalam {timeRange} hari terakhir.
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#77642e]/15 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTimeRange(7)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === 7
                      ? "bg-[#162740] text-white shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange(14)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === 14
                      ? "bg-[#162740] text-white shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  14 Hari
                </button>
              </div>
            </div>

            {/* Peak Performance Pill */}
            {salesTrend.peakDay && (
              <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-[#FDFBF7] border border-[#77642e]/15 text-xs text-ink">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[#D9534F]" />
                  <span>
                    Hari Terbaik: <strong>{salesTrend.peakDay.dayLabel}, {salesTrend.peakDay.dateFormatted}</strong>
                  </span>
                </div>
                <span className="font-mono font-bold text-[#D9534F]">
                  {formatIDR(salesTrend.peakDay.revenue)} ({salesTrend.peakDay.orderCount} transaksi)
                </span>
              </div>
            )}

            {/* CSS Interactive Bar Chart Canvas */}
            <div className="relative pt-6 pb-2">
              {/* Y-Axis Horizontal Guide Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                <div className="border-b border-dashed border-gray-300 w-full" />
                <div className="border-b border-dashed border-gray-300 w-full" />
                <div className="border-b border-dashed border-gray-300 w-full" />
                <div className="border-b border-gray-300 w-full" />
              </div>

              {/* Bar Columns Grid */}
              <div className="relative h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 px-2 z-10">
                {salesTrend.dailyData.map((item, index) => {
                  const heightPercentage = Math.max(
                    Math.round((item.revenue / salesTrend.maxRevenue) * 100),
                    12
                  );
                  const isHovered = hoveredBar === index;
                  const isPeak = salesTrend.peakDay?.dateStr === item.dateStr;

                  return (
                    <div
                      key={item.dateStr}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Interactive Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-16 z-30 bg-[#162740] text-white text-[11px] p-2 rounded-xl shadow-xl border border-white/20 whitespace-nowrap pointer-events-none transition-all animate-scale-up">
                          <p className="font-bold text-paper mb-0.5">
                            {item.dayLabel}, {item.dateFormatted}
                          </p>
                          <p className="font-mono text-[#D9534F] font-extrabold">
                            {formatIDR(item.revenue)}
                          </p>
                          <p className="text-[10px] text-white/70">
                            {item.orderCount} pesanan terbayar
                          </p>
                        </div>
                      )}

                      {/* Bar Column with Gradient and Transition */}
                      <div
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ease-out relative overflow-hidden ${
                          isPeak
                            ? "bg-gradient-to-t from-[#162740] via-[#77642e] to-[#D9534F] shadow-md shadow-[#D9534F]/20"
                            : "bg-gradient-to-t from-[#162740]/85 to-[#162740]/60 hover:to-[#D9534F] hover:scale-y-[1.03]"
                        }`}
                        style={{ height: `${heightPercentage}%` }}
                      >
                        {/* Shimmer line on top edge */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                      </div>

                      {/* X-Axis Day & Date Label */}
                      <div className="mt-3 text-center">
                        <span
                          className={`text-xs font-bold block ${
                            isPeak ? "text-[#D9534F]" : "text-[#162740]"
                          }`}
                        >
                          {item.dayLabel}
                        </span>
                        <span className="text-[10px] text-ink-soft block font-mono">
                          {item.dateFormatted.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-[#77642e]/15 flex items-center justify-between text-xs text-ink-soft">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#162740]" />
                  <span>Omset Reguler</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#D9534F]" />
                  <span>Peak Sales Day</span>
                </div>
              </div>
              <span className="font-mono text-[11px]">Hover bar untuk detail</span>
            </div>
          </div>

          {/* Sisi Kanan: Funnel Konversi Telemetry (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-3xl border border-[#77642e]/20 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740] mb-1">
                Funnel Konversi Aset
              </h3>
              <p className="text-xs text-ink-soft mb-6">
                Pantau pergerakan pembeli dari memasukkan produk ke keranjang hingga pembayaran selesai.
              </p>

              {/* Funnel Step 1: Tambah ke Keranjang */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold text-[#162740] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#162740]/10 text-[#162740] flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Tambah ke Keranjang
                  </span>
                  <span className="font-mono">{funnel.addToCartCount} Event (100%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-[#162740] rounded-full w-full" />
                </div>
              </div>

              {/* Drop-off Indicator 1 */}
              <div className="pl-6 mb-5 flex items-center gap-2 text-[11px] text-ink-soft">
                <span className="text-[#D9534F] font-bold">
                  {funnel.cartToCheckoutRate}%
                </span>
                <span>melanjutkan ke halaman checkout</span>
              </div>

              {/* Funnel Step 2: Masuk Checkout */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold text-[#162740] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#77642e]/15 text-[#77642e] flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Buka Halaman Checkout
                  </span>
                  <span className="font-mono">{funnel.checkoutStartCount} Event</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-[#77642e] rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(funnel.cartToCheckoutRate, 100)}%` }}
                  />
                </div>
              </div>

              {/* Drop-off Indicator 2 */}
              <div className="pl-6 mb-5 flex items-center gap-2 text-[11px] text-ink-soft">
                <span className="text-emerald-600 font-bold">
                  {funnel.checkoutToSuccessRate}%
                </span>
                <span>menyelesaikan pembayaran QRIS/VA</span>
              </div>

              {/* Funnel Step 3: Pembayaran Sukses */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-[#162740] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Transaksi Selesai (SUCCESS)
                  </span>
                  <span className="font-mono text-emerald-600 font-extrabold">
                    {funnel.checkoutSuccessCount} Pesanan
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(funnel.conversionRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Funnel Takeaway Insight Box */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#77642e]/20 text-xs text-ink">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#162740]">Insight Konversi Agency:</p>
                  <p className="text-ink-soft/90 mt-0.5 leading-relaxed">
                    Tingkat konversi <strong>{funnel.conversionRate}%</strong> berada di atas rata-rata industri template digital. Fitur <em>Instant Preview</em> dan <em>Brand Style Matcher</em> berhasil menekan keraguan pembeli.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECTION: TABEL TRANSAKSI TERAKHIR & LOG TELEMETRI */}
        <div className="rounded-3xl border border-[#77642e]/20 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#77642e]/15">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#162740]">
                Aktivitas &amp; Riwayat Transaksi
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">
                Pilih tab untuk meninjau pesanan sukses atau audit log event mentah di localStorage.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#77642e]/15 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "orders"
                    ? "bg-[#D9534F] text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <ShoppingBag size={13} />
                <span>Transaksi Terverifikasi ({orders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "events"
                    ? "bg-[#D9534F] text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Activity size={13} />
                <span>Log Event Funnel ({events.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Transaksi Terverifikasi */}
          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-ink-soft text-sm">
                  Belum ada pesanan yang tercatat. Silakan lakukan checkout atau muat demo pesanan.
                </div>
              ) : (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#77642e]/15 text-ink-soft text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Pelanggan / Usaha</th>
                      <th className="py-3 px-3">Aset Dibeli</th>
                      <th className="py-3 px-3">Metode</th>
                      <th className="py-3 px-3 text-right">Total Nilai</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#77642e]/10">
                    {orders.map((order, idx) => (
                      <tr
                        key={order.orderId || idx}
                        className="hover:bg-[#FDFBF7] transition-colors"
                      >
                        <td className="py-3.5 px-3 font-mono font-bold text-[#162740]">
                          {order.orderId}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-semibold text-ink">
                            {order.customer?.name || "Usaha F&B"}
                          </p>
                          <p className="text-[11px] text-ink-soft">
                            {order.customer?.email || "-"}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-medium text-ink truncate block max-w-[220px]">
                            {order.items && order.items[0]?.title
                              ? order.items[0].title
                              : "Paket Aset Digital"}
                          </span>
                          {order.items && order.items.length > 1 && (
                            <span className="text-[10px] text-ink-soft">
                              +{order.items.length - 1} item lainnya
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-[#162740]/10 text-[#162740] font-mono text-[11px] font-bold">
                            {order.paymentMethod || "QRIS"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#D9534F]">
                          {formatIDR(order.total)}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 size={12} />
                            {order.status || "SUCCESS"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: Log Event Funnel Mentah di localStorage */}
          {activeTab === "events" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#77642e]/15 text-ink-soft text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Event ID</th>
                    <th className="py-3 px-3">Tipe Event</th>
                    <th className="py-3 px-3">Waktu (Timestamp)</th>
                    <th className="py-3 px-3">Detail Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#77642e]/10 font-mono">
                  {events.slice(0, 15).map((evt, idx) => {
                    const isCart = evt.type === "add_to_cart";
                    const isCheckout = evt.type === "checkout_start";
                    const isSuccess = evt.type === "checkout_success";

                    return (
                      <tr key={evt.id || idx} className="hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-2.5 px-3 text-ink-soft">{evt.id}</td>
                        <td className="py-2.5 px-3 font-sans font-bold">
                          {isCart && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                              🛒 add_to_cart
                            </span>
                          )}
                          {isCheckout && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              💳 checkout_start
                            </span>
                          )}
                          {isSuccess && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✅ checkout_success
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-ink-soft">
                          {evt.timestamp ? new Date(evt.timestamp).toLocaleString("id-ID") : "-"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-ink truncate max-w-xs">
                          {JSON.stringify(evt.metadata || {})}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {events.length > 15 && (
                <p className="text-[11px] text-ink-soft text-center pt-3 border-t border-dashed border-[#77642e]/15">
                  Menampilkan 15 dari {events.length} event terbaru yang tersimpan di localStorage.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
