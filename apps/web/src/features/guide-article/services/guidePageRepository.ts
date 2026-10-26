import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { listTravelGuides } from "@/features/guides/services/guidesRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toGuideArticle } from "../guidePageRows";
import type { GuideArticle } from "../types";

/** Cached per guide; throws when the database can't be read (a failed refresh then keeps the last good page). */
const readPageRow = async (slug: string) => {
  "use cache";
  // Its trek cards and itinerary days are published treks, and its guides' cards come from Trekking guides.
  cacheTag(CACHE_TAGS.travelGuides, CACHE_TAGS.treks, CACHE_TAGS.trekkingGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient()
    .from("web_travel_guide_pages")
    .select("*")
    .eq("slug", slug)
    .eq("locale", WEBSITE_LOCALE)
    .maybeSingle();
  if (error) throw new Error(`Could not load the travel guide "${slug}": ${error.message}`);
  return data;
};

/** The main site's published travel guides (prerendered at build time). */
export const listGuidePageSlugs = async (): Promise<string[]> => (await listTravelGuides()).map((guide) => guide.slug);

/**
 * A travel guide's page, or undefined when there is none. The address comes from the visitor, so it is first looked
 * up among the main site's published guides (one cached read): an unknown address reads nothing more.
 */
export const getGuideArticle = async (slug: string): Promise<GuideArticle | undefined> => {
  if (!(await listGuidePageSlugs()).includes(slug)) return undefined;
  const [page, treks] = await Promise.all([readPageRow(slug), listTreks()]);
  return page ? toGuideArticle({ page, treks }, photosPublicBaseUrl) : undefined;
};
