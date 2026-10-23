import "server-only";
import { z } from "zod";

const envSchema = z.object({
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
