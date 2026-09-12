// Analytics & Funnel Tracking Utility for Aksara.Laku
// Logs user actions ('add_to_cart', 'checkout_start', 'checkout_success') to localStorage

export const STORAGE_KEY_ANALYTICS = "aksaralaku_analytics_events";

// Initial seed events across the last 7 days to provide realistic telemetry upon first launch
function generateDefaultSeedEvents() {
  const now = new Date();
  const seed = [];

  // Helper to create timestamp X days ago
  const daysAgo = (d, hour = 14) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    date.setHours(hour, Math.floor(Math.random() * 50) + 5, 0, 0);
    return date.toISOString();
  };

  const sampleProducts = [
    { id: "p001", title: "30-Day Coffee Shop Instagram Content Calendar", price: 49000, niche: "Coffee Shop" },
    { id: "p002", title: "Menu Promo Templates — Resto Padang & Nusantara", price: 39000, niche: "Resto Nusantara" },
    { id: "p003", title: "Bakery Branding Kit — Logo, Packaging & Feed", price: 129000, niche: "Bakery & Pastry" },
    { id: "p005", title: "Boba & Tea Drink Shop Story Animation Kit", price: 45000, niche: "Beverage/Boba" },
    { id: "p006", title: "Street Food & Hawker Stall Banner & Menu Kit", price: 35000, niche: "Street Food" },
  ];

  // Distribution: ~45 add_to_cart, ~26 checkout_start, ~16 checkout_success (~35.5% conversion)
  const daysDistribution = [
    { day: 6, cart: 6, checkout: 3, success: 2 },
    { day: 5, cart: 8, checkout: 5, success: 3 },
    { day: 4, cart: 5, checkout: 3, success: 2 },
    { day: 3, cart: 7, checkout: 4, success: 3 },
    { day: 2, cart: 9, checkout: 5, success: 3 },
    { day: 1, cart: 8, checkout: 5, success: 3 },
    { day: 0, cart: 6, checkout: 3, success: 2 },
  ];

  let idCounter = 100;

  daysDistribution.forEach(({ day, cart, checkout, success }) => {
    for (let i = 0; i < cart; i++) {
      const prod = sampleProducts[i % sampleProducts.length];
      seed.push({
        id: `evt_seed_${++idCounter}`,
        type: "add_to_cart",
        timestamp: daysAgo(day, 10 + (i % 8)),
        metadata: {
          productId: prod.id,
          title: prod.title,
          price: prod.price,
          niche: prod.niche,
        },
      });
    }

    for (let i = 0; i < checkout; i++) {
      seed.push({
        id: `evt_seed_${++idCounter}`,
        type: "checkout_start",
        timestamp: daysAgo(day, 11 + (i % 8)),
        metadata: {
          itemCount: 1 + (i % 2),
        },
      });
    }

    for (let i = 0; i < success; i++) {
      const prod = sampleProducts[i % sampleProducts.length];
      seed.push({
        id: `evt_seed_${++idCounter}`,
        type: "checkout_success",
        timestamp: daysAgo(day, 12 + (i % 8)),
        metadata: {
          orderId: `ORD-DEMO-${day}-${i}`,
          total: prod.price,
          niche: prod.niche,
          productTitle: prod.title,
        },
      });
    }
  });

  return seed;
}

/**
 * Retrieve all logged analytics events from localStorage.
 * Initializes with realistic seed data if empty.
 */
export function getAnalyticsEvents() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_ANALYTICS);
    if (!raw) {
      const defaultSeed = generateDefaultSeedEvents();
      window.localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(defaultSeed));
      return defaultSeed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read analytics from localStorage:", err);
    return [];
  }
}

/**
 * Track an analytics event to localStorage.
 * @param {'add_to_cart' | 'checkout_start' | 'checkout_success'} type
 * @param {Object} metadata
 */
export function trackEvent(type, metadata = {}) {
  if (typeof window === "undefined") return;
  try {
    const current = getAnalyticsEvents();
    const newEvent = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      type,
      timestamp: new Date().toISOString(),
      metadata,
    };
    const updated = [newEvent, ...current].slice(0, 500); // Keep max 500 recent events
    window.localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to track analytics event:", err);
  }
}

/**
 * Reset analytics events back to default demo seeds.
 */
export function resetAnalyticsEvents() {
  if (typeof window === "undefined") return [];
  const defaultSeed = generateDefaultSeedEvents();
  window.localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(defaultSeed));
  return defaultSeed;
}

/**
 * Calculate Funnel metrics based on logged events and existing orders.
 */
export function getFunnelMetrics(events = [], liveOrders = []) {
  const addToCartCount = events.filter((e) => e.type === "add_to_cart").length || 0;
  const checkoutStartCount = events.filter((e) => e.type === "checkout_start").length || 0;
  
  // Count event successes plus any paid orders recorded in AuthContext
  const eventSuccessCount = events.filter((e) => e.type === "checkout_success").length || 0;
  const livePaidOrderCount = liveOrders.filter(
    (o) => o.status === "paid" || o.status === "SUCCESS"
  ).length;

  const totalSuccess = Math.max(eventSuccessCount, livePaidOrderCount, 1);
  const totalCart = Math.max(addToCartCount, totalSuccess);
  const totalCheckout = Math.max(checkoutStartCount, totalSuccess);

  const cartToCheckoutRate = totalCart > 0 ? ((totalCheckout / totalCart) * 100).toFixed(1) : "0.0";
  const checkoutToSuccessRate = totalCheckout > 0 ? ((totalSuccess / totalCheckout) * 100).toFixed(1) : "0.0";
  const conversionRate = totalCart > 0 ? ((totalSuccess / totalCart) * 100).toFixed(1) : "0.0";

  return {
    addToCartCount: totalCart,
    checkoutStartCount: totalCheckout,
    checkoutSuccessCount: totalSuccess,
    cartToCheckoutRate: parseFloat(cartToCheckoutRate),
    checkoutToSuccessRate: parseFloat(checkoutToSuccessRate),
    conversionRate: parseFloat(conversionRate),
  };
}

/**
 * Compile Daily Sales Trend for the last N days (default 7 days).
 */
export function getDailySalesTrend(liveOrders = [], days = 7) {
  const result = [];
  const now = new Date();
  const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // Baseline demo revenue if liveOrders are fewer than 3 to avoid flat/empty chart
  const demoDailyValues = [285000, 360000, 195000, 420000, 510000, 680000, 490000];

  for (let i = days - 1; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() - i);
    const dateStr = targetDate.toISOString().slice(0, 10);
    const dayLabel = DAY_NAMES[targetDate.getDay()];
    const dateFormatted = `${targetDate.getDate()} ${targetDate.toLocaleString("id-ID", { month: "short" })}`;

    // Filter live orders matching this calendar day
    const matchingOrders = liveOrders.filter((o) => {
      if (o.status !== "paid" && o.status !== "SUCCESS") return false;
      const oDate = o.date ? new Date(o.date).toISOString().slice(0, 10) : "";
      return oDate === dateStr;
    });

    const liveRevenue = matchingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const liveCount = matchingOrders.length;

    // Use live revenue, blended with demo baseline if no live orders yet for that day
    const dayIndex = (days - 1 - i) % demoDailyValues.length;
    const blendedRevenue = liveRevenue > 0 ? liveRevenue : demoDailyValues[dayIndex];
    const blendedCount = liveCount > 0 ? liveCount : Math.max(1, Math.round(blendedRevenue / 80000));

    result.push({
      dateStr,
      dayLabel,
      dateFormatted,
      revenue: blendedRevenue,
      orderCount: blendedCount,
    });
  }

  const maxRevenue = Math.max(...result.map((d) => d.revenue), 100000);
  const peakDay = [...result].sort((a, b) => b.revenue - a.revenue)[0];

  return {
    dailyData: result,
    maxRevenue,
    peakDay,
  };
}
