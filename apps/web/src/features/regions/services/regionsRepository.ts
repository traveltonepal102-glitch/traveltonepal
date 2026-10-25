import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import type { RegionCard } from "../regionRows";
import { toRegionCards, toRegionSummaries } from "../regionRows";
import type { RegionSummary } from "../regions";

/**
 * The web_regions rows, read once and cached for every page. Throws when the database can't be read: a failed
 * refresh then keeps the last good page, rather than caching an empty one.
 */
const readRegionRows = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.regions);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_regions").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);
  return data;
};

/** Every region, in the website's order (home, header, region filters). */
export const listRegions = async (): Promise<RegionSummary[]> => toRegionSummaries(await readRegionRows(), photosPublicBaseUrl);

/** Every region with its map pin, facts and best months, west to east (the Regions page). */
export const listRegionCards = async (): Promise<RegionCard[]> => toRegionCards(await readRegionRows(), photosPublicBaseUrl);
