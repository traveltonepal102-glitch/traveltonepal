import "server-only";
import { z } from "zod";

// Server-only: the browser never talks to Supabase, so none of these are NEXT_PUBLIC_.
const envSchema = z.object({
  SUPABASE_URL: z.url({ protocol: /^https$/, error: "must be the https:// project URL" }),
  SUPABASE_PUBLISHABLE_KEY: z.string().startsWith("sb_publishable_", "must be the publishable key (sb_publishable_…)"),
  /** Bypasses Row Level Security. Used only for the sign-in lock (src/lib/supabase/admin.ts). */
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_", "must be a secret key (sb_secret_…)"),
  /** Optional: the main website, for the "View website" link on the sign-in screen. Empty counts as not set. */
  WEBSITE_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.url({ protocol: /^https?$/, error: "must be an http(s) URL" }).optional(),
  ),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (result.success) return result.data;

  const problems = result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables in apps/admin:\n${problems.join("\n")}`);
};

export const env = parseEnv();
