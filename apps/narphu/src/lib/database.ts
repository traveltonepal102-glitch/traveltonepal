import "server-only";
import { createSiteClient } from "@ttn/site-data/siteClient";
import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

import { env } from "@/env";

import { SITE_ID } from "./site";

/** The database for this website's server: read-only, and only this website's rows. */
export const createDatabaseClient = () => createSiteClient({ supabaseUrl: env.SUPABASE_URL, publishableKey: env.SUPABASE_PUBLISHABLE_KEY, siteId: SITE_ID });

/** Tags on cached reads; the admin refreshes them after a save (app/api/revalidate). */
export const CACHE_TAGS = WEBSITE_CACHE_TAGS;

/**
 * Pages change only when the admin saves (it refreshes their tags at once), so reads keep the longest life, rebuilt at
 * most every 30 days: hourly rebuilds by crawlers went over Vercel's ISR write limit (see apps/web/src/lib/cacheTags.ts).
 */
export const DATABASE_CACHE_LIFE = "max";

/** The language this website shows. */
export const WEBSITE_LOCALE = "en";
