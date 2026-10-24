import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import type { RegionSummary } from "../regions";
import { toRegionSummaries } from "../regionRows";

/**
 * Every region from the database, in the website's order. Throws when the database can't be read: a failed
 * refresh then keeps the last good page, rather than caching an empty one.
 */
export const listRegions = async (): Promise<RegionSummary[]> => {
  "use cache";
  cacheTag(CACHE_TAGS.regions);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_regions").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);
  return toRegionSummaries(data, photosPublicBaseUrl);
};
