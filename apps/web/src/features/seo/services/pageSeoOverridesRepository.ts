import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { listGuidePageSlugs } from "@/features/guide-article/services/guidePageRepository";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { type PageSeoOverrides, toPageSeoOverrides } from "../pageSeoOverrides";
import { type SitemapSource, sitemapPaths } from "../sitemapEntries";

/** The pages that name another page as their main version or are hidden (Google cards). Throws on a database error. */
const readSeoOverrideRows = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.treks, CACHE_TAGS.regions, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_page_seo_overrides").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load the pages' Google settings: ${error.message}`);
  return data;
};

/** What the sitemap lists, from the same cached reads the pages use. */
export const getSitemapSource = async (): Promise<SitemapSource> => {
  const [treks, regions, guideSlugs] = await Promise.all([listTreks(), listRegionCards(), listGuidePageSlugs()]);
  return { treks, regions, guideSlugs };
};

/** The hidden pages and the canonical addresses the website follows (toPageSeoOverrides), for metadata and the sitemap. */
export const getPageSeoOverrides = async (source?: SitemapSource): Promise<PageSeoOverrides> => {
  const [rows, pages] = await Promise.all([readSeoOverrideRows(), source ?? getSitemapSource()]);
  return toPageSeoOverrides(rows, sitemapPaths(pages));
};
