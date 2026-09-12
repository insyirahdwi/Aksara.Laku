import { createClient } from "@supabase/supabase-js";

// Read Supabase environment variables from Vite
const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || "";
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || "";

// Check if credentials are real and not default placeholders
export const isSupabaseConfigured =
  Boolean(envUrl && envAnonKey) &&
  envUrl.startsWith("http") &&
  !envUrl.includes("isi_url_supabase_anda") &&
  !envAnonKey.includes("isi_anon_key_anda");

// Safe fallback project URL to avoid TypeError: Invalid URL when keys are still placeholders
const safeUrl = isSupabaseConfigured ? envUrl : "https://aksaralaku-project.supabase.co";
const safeAnonKey = isSupabaseConfigured ? envAnonKey : "placeholder-anon-key";

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
