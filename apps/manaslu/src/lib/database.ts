import "server-only";
import { createSiteClient } from "@ttn/site-data/siteClient";
import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";

import { env } from "@/env";

import { SITE_ID } from "./site";

/** The database for this website's server: read-only, and only this website's rows. */
export const createDatabaseClient = () => createSiteClient({ supabaseUrl: env.SUPABASE_URL, publishableKey: env.SUPABASE_PUBLISHABLE_KEY, siteId: SITE_ID });

/** Tags on cached reads; the admin refreshes them after a save (app/api/revalidate). */
export const CACHE_TAGS = WEBSITE_CACHE_TAGS;

/** A refresh every hour still catches what no save announces. */
export const DATABASE_CACHE_LIFE = "hours";

/** The language this website shows. */
export const WEBSITE_LOCALE = "en";
