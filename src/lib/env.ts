import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default("https://placeholder-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional().default("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key"),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const processEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

// Safe parsing with diagnostic logging
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.warn(
    "⚠️ [TECH-TITAN] Environment variable validation warnings:",
    parsed.error.format()
  );
}

export const env = parsed.success ? parsed.data : envSchema.parse({});

/**
 * Helper to check if real Supabase credentials are configured
 */
export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes("placeholder-project") &&
    !key.includes("placeholder_key")
  );
};
