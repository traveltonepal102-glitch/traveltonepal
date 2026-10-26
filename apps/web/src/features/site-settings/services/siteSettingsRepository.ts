import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toSiteSettings } from "../siteSettingsRows";
import type { SiteSettings } from "../types";

/**
 * Site settings (contact details, company and licences, social links), shown on every page. Cached and refreshed
 * when the admin saves them; throws when the database can't be read (a failed refresh keeps the last good page).
 */
export const getSiteSettings = async (): Promise<SiteSettings> => {
  "use cache";
  cacheTag(CACHE_TAGS.settings);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_site_settings").select("*").single();
  if (error) throw new Error(`Could not load the site settings: ${error.message}`);
  return toSiteSettings(data, photosPublicBaseUrl);
};
