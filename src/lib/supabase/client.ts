import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { env } from "../env";

/**
 * Creates a Supabase client for use in browser components
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
