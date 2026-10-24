import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toMainSiteGuideCards } from "../guideRows";
import type { GuideSummary } from "../types";

/**
 * The main site's published travel guides as cards, the featured guide first, then the newest. Throws when the
 * database can't be read (a failed refresh keeps the last good page).
 */
export const listGuideCards = async (): Promise<GuideSummary[]> => {
  "use cache";
  cacheTag(CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_travel_guides").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load travel guides: ${error.message}`);
  return toMainSiteGuideCards(data, photosPublicBaseUrl);
};
