import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://placeholder-project.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default("placeholder-anon-key"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://hackerzone.in"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://hackerzone.in"),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});

/**
 * Validate server-side environment variables without exposing secret values.
 * Throws a clear configuration error if critical variables fail validation.
 */
export function validateEnv() {
  const isServer = typeof window === "undefined";

  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  });

  if (!clientResult.success) {
    const errorDetails = clientResult.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error(
      `[Hackerzone Config Error] Missing or invalid client environment variables:\n${errorDetails}`
    );
    return { valid: false, errors: clientResult.error.issues };
  }

  if (isServer) {
    const serverResult = serverEnvSchema.safeParse({
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    });

    if (!serverResult.success) {
      const errorDetails = serverResult.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      console.error(
        `[Hackerzone Config Error] Missing or invalid server environment variables:\n${errorDetails}`
      );
      return { valid: false, errors: serverResult.error.issues };
    }
  }

  return { valid: true, errors: [] };
}

export const env = {
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
  get isDevelopment() {
    return process.env.NODE_ENV === "development";
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://hackerzone.in";
  },
  get supabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  },
  get supabaseAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";
  },
};
