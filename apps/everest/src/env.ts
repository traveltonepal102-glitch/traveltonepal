import "server-only";
import { APP_ENVIRONMENTS } from "@ttn/config/appEnvironment";
import { REVALIDATE_SECRET_MIN_LENGTH } from "@ttn/config/websiteCache";
import { z } from "zod";

/** Empty counts as not set. */
const optional = <Schema extends z.ZodType>(schema: Schema) => z.preprocess((value) => value || undefined, schema.optional());

/** A base URL without its trailing slash, so paths can be added with "/". */
const baseUrl = (message: string) => z.url(message).transform((url) => url.replace(/\/+$/, ""));

/** The website server's settings, checked once at start-up so a missing one fails clearly. */
const envSchema = z.object({
  SUPABASE_URL: baseUrl("SUPABASE_URL must be the Supabase project URL."),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20, "SUPABASE_PUBLISHABLE_KEY is missing (Supabase › Project settings › API keys)."),
  PHOTOS_PUBLIC_URL: optional(baseUrl("PHOTOS_PUBLIC_URL must be a URL.")),
  REVALIDATE_SECRET: optional(z.string().min(REVALIDATE_SECRET_MIN_LENGTH, `REVALIDATE_SECRET must be at least ${REVALIDATE_SECRET_MIN_LENGTH} characters.`)),
  NEXT_PUBLIC_APP_ENV: optional(z.enum(APP_ENVIRONMENTS, "NEXT_PUBLIC_APP_ENV must be production or development.")),
  SITE_URL: optional(z.url("SITE_URL must be a URL, e.g. https://everest-trek.de.")),
  BREVO_API_KEY: optional(z.string().startsWith("xkeysib-", "BREVO_API_KEY must be a Brevo API key (xkeysib-…).")),
  BREVO_NEWSLETTER_LIST_ID: optional(z.coerce.number().int().positive("BREVO_NEWSLETTER_LIST_ID must be the list's number, e.g. 3.")),
  BREVO_CONFIRM_TEMPLATE_ID: optional(z.coerce.number().int().positive("BREVO_CONFIRM_TEMPLATE_ID must be the template's number, e.g. 1.")),
}).refine(
  // Without it, canonical links and structured data would name localhost.
  (settings) => settings.NEXT_PUBLIC_APP_ENV !== "production" || /^https:\/\/(?!localhost)/.test(settings.SITE_URL ?? ""),
  { message: "SITE_URL must be the website's https address in production." },
);

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`The website's settings aren't right (apps/everest/.env.local):\n${parsed.error.issues.map((issue) => `- ${issue.message}`).join("\n")}`);
}

export const env = parsed.data;

export const photosPublicBaseUrl = env.PHOTOS_PUBLIC_URL ?? `${env.SUPABASE_URL}/storage/v1/object/public/photos`;

/** Trek files (printable maps): the bucket's trek-files/ folder beside the photos, as the admin uploads them. */
export const trekFilesPublicBaseUrl = env.PHOTOS_PUBLIC_URL ? `${env.PHOTOS_PUBLIC_URL}/trek-files` : `${env.SUPABASE_URL}/storage/v1/object/public/trek-files`;

/** Brevo for the newsletter (the footer's sign-up), or null until all three settings are filled in. */
export const newsletterSettings =
  env.BREVO_API_KEY && env.BREVO_NEWSLETTER_LIST_ID && env.BREVO_CONFIRM_TEMPLATE_ID
    ? { apiKey: env.BREVO_API_KEY, listId: env.BREVO_NEWSLETTER_LIST_ID, templateId: env.BREVO_CONFIRM_TEMPLATE_ID }
    : null;

export type NewsletterSettings = NonNullable<typeof newsletterSettings>;
