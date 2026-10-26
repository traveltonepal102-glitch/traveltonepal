import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toMainSiteGuideCards, toTravelGuides } from "../guideRows";
import type { GuideSummary, TravelGuide } from "../types";

/** The published travel guides (date come). Throws when the database can't be read (a failed refresh keeps the last good page). */
const readGuideRows = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_travel_guides").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load travel guides: ${error.message}`);
  return data;
};

/** The main site's published travel guides as cards, the featured guide first, then the newest. */
export const listGuideCards = async (): Promise<GuideSummary[]> => toMainSiteGuideCards(await readGuideRows(), photosPublicBaseUrl);

/** The main site's published travel guides for the Travel guides page, in the same order. */
export const listTravelGuides = async (): Promise<TravelGuide[]> => toTravelGuides(await readGuideRows(), photosPublicBaseUrl);
