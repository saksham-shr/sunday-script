import { createClient } from "@supabase/supabase-js";

// Uses service role key — server-side only, never expose to client
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Get it from: " +
        "https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/settings/api"
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
