import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { listGuideCards } from "@/features/guides/services/guidesRepository";
import { listRegionCards, listRegions } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toRegionDetail } from "../regionPageRows";
import type { RegionDetail } from "../types";

/**
 * The reads below are cached per region and throw when the database can't be read: a failed refresh then keeps the
 * last good page, rather than caching an empty one.
 */
const readPageRow = async (slug: string) => {
  "use cache";
  // Its featured and nearby treks and its travel guides are the published ones, so saving those changes it too.
  cacheTag(CACHE_TAGS.regions, CACHE_TAGS.treks, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient()
    .from("web_region_pages")
    .select("*")
    .eq("slug", slug)
    .eq("locale", WEBSITE_LOCALE)
    .maybeSingle();
  if (error) throw new Error(`Could not load the region page "${slug}": ${error.message}`);
  return data;
};

const readPhotoRows = async (slug: string) => {
  "use cache";
  cacheTag(CACHE_TAGS.regions);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_region_photos").select("*").eq("region_slug", slug);
  if (error) throw new Error(`Could not load the photos of "${slug}": ${error.message}`);
  return data;
};

const readGuideRows = async (slug: string) => {
  "use cache";
  // A guide save changes who shows; a region save, who is switched off.
  cacheTag(CACHE_TAGS.trekkingGuides, CACHE_TAGS.regions);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient()
    .from("web_region_guides")
    .select("*")
    .eq("region_slug", slug)
    .eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load the guides of "${slug}": ${error.message}`);
  return data;
};

/** The regions that have their own page (prerendered at build time). */
export const listRegionPageSlugs = async (): Promise<string[]> =>
  (await listRegions()).flatMap((region) => (region.hasPage ? region.slug : []));

/**
 * A region's page, or undefined when it has none. The address comes from the visitor, so it is first looked up
 * among the regions (one cached read): an unknown address reads nothing more.
 */
export const getRegionDetail = async (slug: string): Promise<RegionDetail | undefined> => {
  const regions = await listRegionCards();
  const card = regions.find((region) => region.slug === slug);
  if (!card?.hasPage) return undefined;

  const [page, photos, guides, treks, travelGuides] = await Promise.all([
    readPageRow(slug),
    readPhotoRows(slug),
    readGuideRows(slug),
    listTreks(),
    listGuideCards(),
  ]);
  if (!page) return undefined;
  return toRegionDetail({ card, page, photos, guides, treks, travelGuides, regions }, photosPublicBaseUrl);
};
