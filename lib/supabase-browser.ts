import { createBrowserClient } from "@supabase/ssr";

// Single shared instance for all client components that need an authenticated session.
// Uses cookie storage — compatible with the login flow and the proxy middleware.
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
