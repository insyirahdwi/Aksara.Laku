import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const STORAGE_KEY_USER = "aksaralaku_user";
const STORAGE_KEY_USERS_DB = "aksaralaku_users_db";
const STORAGE_KEY_ORDERS = "aksaralaku_orders";

// Default seed users for offline / fallback testing
const DEFAULT_USERS = [
  {
    id: "admin_master",
    name: "Admin Aksara.Laku",
    businessName: "Aksara.Laku HQ",
    email: "admin@aksaralaku.com",
    password: "adminpassword",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user_demo",
    name: "Kopi Senja Bersua",
    businessName: "Kopi Senja Bersua",
    email: "owner@kopisenja.com",
    password: "password123",
    role: "customer",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_DEMO_ORDERS = [
  {
    orderId: "ORD-AK-9821",
    items: [
      {
        id: "p001",
        title: "30-Day Coffee Shop Instagram Content Calendar",
        category: "Coffee",
        type: "Content Planner",
        price: 49000,
        originalPrice: 99000,
        thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
        downloadLink: "https://canva.com/templates/aksara-laku-coffee-calendar",
      },
      {
        id: "p003",
        title: "Bakery Branding Kit — Logo, Packaging & Feed",
        category: "Bakery",
        type: "Branding Kit",
        price: 129000,
        originalPrice: 199000,
        thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        downloadLink: "https://canva.com/templates/aksara-laku-bakery-branding",
      },
    ],
    total: 178000,
    date: "2026-09-08T09:30:00.000Z",
    status: "paid",
    customer: {
      name: "Kopi Senja Bersua",
      email: "owner@kopisenja.com",
    },
  },
];

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage unavailable (e.g. private browsing) — fail silently.
  }
}

// Format Supabase user into normalized Aksara.Laku user object
function formatSupabaseUser(supabaseUser) {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  const email = (supabaseUser.email || "").trim().toLowerCase();
  const isEmailAdmin = email === "admin@aksaralaku.com";
  const role = isEmailAdmin ? "admin" : (meta.role || "customer");
  const name = meta.name || meta.businessName || email.split("@")[0] || "Pengguna";
  const businessName = meta.businessName || meta.name || "Usaha F&B";

  return {
    id: supabaseUser.id,
    email,
    name,
    businessName,
    whatsapp: meta.whatsapp || "",
    role,
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    rawUser: supabaseUser,
  };
}

function getUsersDatabase() {
  const users = readStorage(STORAGE_KEY_USERS_DB, DEFAULT_USERS);
  const adminIndex = users.findIndex((u) => u.email?.toLowerCase() === "admin@aksaralaku.com");
  if (adminIndex === -1) {
    const merged = [DEFAULT_USERS[0], ...users];
    writeStorage(STORAGE_KEY_USERS_DB, merged);
    return merged;
  }
  if (users[adminIndex].role !== "admin") {
    users[adminIndex].role = "admin";
    writeStorage(STORAGE_KEY_USERS_DB, users);
  }
  return users;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = readStorage(STORAGE_KEY_USER, null);
    if (stored) {
      const isEmailAdmin = stored.email?.toLowerCase() === "admin@aksaralaku.com";
      return {
        ...stored,
        role: isEmailAdmin ? "admin" : (stored.role || "customer"),
      };
    }
    return null;
  });

  const [isAuthLoading, setIsAuthLoading] = useState(() => isSupabaseConfigured);
  const [orders, setOrders] = useState(() => readStorage(STORAGE_KEY_ORDERS, DEFAULT_DEMO_ORDERS));

  // Sync user state to local cache
  useEffect(() => {
    writeStorage(STORAGE_KEY_USER, user);
  }, [user]);

  useEffect(() => {
    writeStorage(STORAGE_KEY_ORDERS, orders);
  }, [orders]);

  // Connect to real-time Supabase auth session and changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    // 1. Check initial active session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!error && session?.user) {
          setUser(formatSupabaseUser(session.user));
        }
        setIsAuthLoading(false);
      })
      .catch(() => {
        setIsAuthLoading(false);
      });

    // 2. Real-time auth state changes listener (Sign in, Sign out, Token refreshed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(formatSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  // Real Supabase signUp implementation
  const register = useCallback(
    async ({ email, password, businessName, whatsapp }) => {
      const normalizedEmail = (email || "").trim().toLowerCase();
      const isEmailAdmin = normalizedEmail === "admin@aksaralaku.com";
      const role = isEmailAdmin ? "admin" : "customer";
      const displayName = businessName?.trim() || normalizedEmail.split("@")[0];

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              name: displayName,
              businessName: displayName,
              whatsapp: whatsapp?.trim() || "",
              role,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          const formatted = formatSupabaseUser(data.user);
          setUser(formatted);
          return formatted;
        }
        return null;
      }

      // Hybrid Fallback: local development if Supabase keys are placeholders
      const usersDb = getUsersDatabase();
      const existing = usersDb.find(
        (u) => (u.email || "").trim().toLowerCase() === normalizedEmail
      );

      if (existing) {
        throw new Error("Email ini sudah terdaftar. Silakan masuk menggunakan tab Login.");
      }

      const newUserRecord = {
        id: "user_" + Date.now(),
        name: displayName,
        businessName: displayName,
        email: normalizedEmail,
        password,
        role,
        whatsapp: whatsapp?.trim() || "",
        createdAt: new Date().toISOString(),
      };

      const updatedDb = [...usersDb, newUserRecord];
      writeStorage(STORAGE_KEY_USERS_DB, updatedDb);

      const sessionUser = { ...newUserRecord };
      delete sessionUser.password;
      setUser(sessionUser);
      return sessionUser;
    },
    []
  );

  // Real Supabase signInWithPassword implementation
  const login = useCallback(async ({ email, password }) => {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const isEmailAdmin = normalizedEmail === "admin@aksaralaku.com";

    // Lightweight identity bypass from checkout without password
    if (!password && normalizedEmail) {
      const lightweightUser = {
        id: "user_" + Date.now(),
        name: normalizedEmail.split("@")[0],
        businessName: "Usaha F&B",
        email: normalizedEmail,
        role: isEmailAdmin ? "admin" : "customer",
      };
      setUser(lightweightUser);
      return lightweightUser;
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const formatted = formatSupabaseUser(data.user);
        setUser(formatted);
        return formatted;
      }
      return null;
    }

    // Hybrid Fallback: local development if Supabase keys are placeholders
    const usersDb = getUsersDatabase();
    const userRecord = usersDb.find(
      (u) => (u.email || "").trim().toLowerCase() === normalizedEmail
    );

    if (!userRecord) {
      if (isEmailAdmin) {
        const adminUser = { ...DEFAULT_USERS[0] };
        delete adminUser.password;
        setUser(adminUser);
        return adminUser;
      }
      throw new Error("Akun dengan email ini belum terdaftar. Silakan mendaftar di tab Register.");
    }

    if (password && userRecord.password && userRecord.password !== password) {
      throw new Error("Kata sandi salah. Silakan periksa kembali.");
    }

    const sessionUser = {
      ...userRecord,
      role: isEmailAdmin ? "admin" : (userRecord.role || "customer"),
    };
    delete sessionUser.password;
    setUser(sessionUser);
    return sessionUser;
  }, []);

  // Real Supabase signOut implementation
  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signOut notice:", err);
      }
    }
    writeStorage(STORAGE_KEY_USER, null);
    setUser(null);
  }, []);

  const recordOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const userEmail = user?.email?.trim().toLowerCase();

  const clearPurchases = useCallback(() => {
    if (!userEmail) return;
    setOrders((prev) =>
      prev.filter((o) => o.customer?.email?.trim().toLowerCase() !== userEmail)
    );
  }, [userEmail]);

  const resetDemoOrders = useCallback(() => {
    setOrders(DEFAULT_DEMO_ORDERS);
  }, []);

  const purchasedProducts = orders
    .filter((o) => {
      const isPaid = o.status === "paid" || o.status === "SUCCESS";
      if (!isPaid) return false;
      if (!userEmail) return false;
      const orderEmail = o.customer?.email?.trim().toLowerCase();
      return !orderEmail || orderEmail === userEmail;
    })
    .flatMap((o) =>
      o.items.map((item) => ({
        ...item,
        orderId: o.orderId,
        orderDate: o.date,
      }))
    );

  const value = {
    user,
    isLoggedIn,
    isAdmin,
    isAuthLoading,
    isSupabaseConfigured,
    isAuthenticated: isLoggedIn,
    login,
    logout,
    register,
    orders,
    recordOrder,
    purchasedProducts,
    clearPurchases,
    resetDemoOrders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
