import "server-only";
import { APP_ENVIRONMENTS } from "@ttn/config/appEnvironment";
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
  // "production" turns on production-only features (read with appEnvironment()); not set: development.
  NEXT_PUBLIC_APP_ENV: optional(z.enum(APP_ENVIRONMENTS, "NEXT_PUBLIC_APP_ENV must be production or development.")),
  // Newsletter (Brevo), all three or none: the API key (Brevo › SMTP & API), the list subscribers join and the
  // "please confirm" email template (double opt-in). Not set: the sign-up form is hidden in production.
  BREVO_API_KEY: optional(z.string().startsWith("xkeysib-", "BREVO_API_KEY must be a Brevo API key (xkeysib-…).")),
  BREVO_NEWSLETTER_LIST_ID: optional(z.coerce.number().int().positive("BREVO_NEWSLETTER_LIST_ID must be the list's number, e.g. 3.")),
  BREVO_CONFIRM_TEMPLATE_ID: optional(z.coerce.number().int().positive("BREVO_CONFIRM_TEMPLATE_ID must be the template's number, e.g. 1.")),
  // The site's public address (read by lib/site.ts). Not set: the dev server's.
  SITE_URL: optional(z.url("SITE_URL must be a URL, e.g. https://www.traveltonepal.com.")),
}).refine(
  // Without it, canonical links, the sitemap, robots.txt and structured data would all name localhost (2026-10-30).
  (settings) => settings.NEXT_PUBLIC_APP_ENV !== "production" || /^https:\/\/(?!localhost)/.test(settings.SITE_URL ?? ""),
  { message: "SITE_URL must be the site's https address in production, e.g. https://www.traveltonepal.com." },
);

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`The website's settings aren't right (apps/web/.env.local):\n${parsed.error.issues.map((issue) => `- ${issue.message}`).join("\n")}`);
}

export const env = parsed.data;

/** Brevo for the newsletter, or null until all three settings are filled in. */
export const newsletterSettings =
  env.BREVO_API_KEY && env.BREVO_NEWSLETTER_LIST_ID && env.BREVO_CONFIRM_TEMPLATE_ID
    ? { apiKey: env.BREVO_API_KEY, listId: env.BREVO_NEWSLETTER_LIST_ID, templateId: env.BREVO_CONFIRM_TEMPLATE_ID }
    : null;

export type NewsletterSettings = NonNullable<typeof newsletterSettings>;

export const photosPublicBaseUrl = env.PHOTOS_PUBLIC_URL ?? `${env.SUPABASE_URL}/storage/v1/object/public/photos`;
