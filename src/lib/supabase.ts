import { createBrowserClient } from "@supabase/ssr";

// Returns null when Supabase is not configured — the app then runs in
// local demo mode (browser localStorage). No live project is required to
// build or to try the UI. See supabase/schema.sql for the live schema.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createBrowserClient(url, key);
}
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
);
