import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { listGuidePageSlugs } from "@/features/guide-article/services/guidePageRepository";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { type CanonicalOverrides, toCanonicalOverrides } from "../canonicals";
import { type SitemapSource, sitemapPaths } from "../sitemapEntries";

/** The pages that name another page as their main version (Google cards in the admin). Throws on a database error. */
const readCanonicalRows = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.treks, CACHE_TAGS.regions, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_canonical_overrides").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load canonical addresses: ${error.message}`);
  return data;
};

/** What the sitemap lists, from the same cached reads the pages use. */
export const getSitemapSource = async (): Promise<SitemapSource> => {
  const [treks, regions, guideSlugs] = await Promise.all([listTreks(), listRegionCards(), listGuidePageSlugs()]);
  return { treks, regions, guideSlugs };
};

/** The canonical addresses the website follows (toCanonicalOverrides), for page metadata and the sitemap. */
export const getCanonicalOverrides = async (source?: SitemapSource): Promise<CanonicalOverrides> => {
  const [rows, pages] = await Promise.all([readCanonicalRows(), source ?? getSitemapSource()]);
  return toCanonicalOverrides(rows, sitemapPaths(pages));
};
