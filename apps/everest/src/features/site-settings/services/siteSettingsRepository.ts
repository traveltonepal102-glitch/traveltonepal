import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, createDatabaseClient } from "@/lib/database";

import { toSiteSettings } from "../siteSettingsRows";
import type { SiteSettings } from "../types";

/** The website's details (every page shows them). Cached and refreshed when the admin saves them; throws when the database can't be read. */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  "use cache";
  cacheTag(CACHE_TAGS.settings);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createDatabaseClient().from("web_site_settings").select("*").single();
  if (error) throw new Error(`Could not load the website's settings: ${error.message}`);
  return toSiteSettings(data, new Date(), photosPublicBaseUrl);
};
