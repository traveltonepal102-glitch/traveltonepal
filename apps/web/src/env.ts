import "server-only";
import { REVALIDATE_SECRET_MIN_LENGTH } from "@ttn/config/websiteCache";
import { z } from "zod";

/** Empty counts as not set. */
const optional = <Schema extends z.ZodType>(schema: Schema) => z.preprocess((value) => value || undefined, schema.optional());

/** A base URL without its trailing slash, so paths can be added with "/". */
const baseUrl = (message: string) => z.url(message).transform((url) => url.replace(/\/+$/, ""));

/**
 * The website server's settings, checked once at start-up so a missing one fails clearly. The publishable key
 * can only read the database's "web_" views (published content); the website never gets the admin's secret key.
 */
const envSchema = z.object({
  SUPABASE_URL: baseUrl("SUPABASE_URL must be the Supabase project URL."),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20, "SUPABASE_PUBLISHABLE_KEY is missing (Supabase › Project settings › API keys)."),
  // Where library photos are served from; defaults to the Supabase "photos" bucket (CloudFront in production).
  PHOTOS_PUBLIC_URL: optional(baseUrl("PHOTOS_PUBLIC_URL must be a URL.")),
  // The admin's password for app/api/revalidate (the same value as in apps/admin). Not set: the route is off and
  // saved changes show within the hour.
  REVALIDATE_SECRET: optional(z.string().min(REVALIDATE_SECRET_MIN_LENGTH, `REVALIDATE_SECRET must be at least ${REVALIDATE_SECRET_MIN_LENGTH} characters.`)),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`The website's settings aren't right (apps/web/.env.local):\n${parsed.error.issues.map((issue) => `- ${issue.message}`).join("\n")}`);
}

export const env = parsed.data;

export const photosPublicBaseUrl = env.PHOTOS_PUBLIC_URL ?? `${env.SUPABASE_URL}/storage/v1/object/public/photos`;
