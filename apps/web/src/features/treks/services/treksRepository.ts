import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toTrekSummaries } from "../trekRows";
import type { TrekSummary } from "../types";

/** Every published trek, A–Z. Throws when the database can't be read (a failed refresh keeps the last good page). */
export const listTreks = async (): Promise<TrekSummary[]> => {
  "use cache";
  cacheTag(CACHE_TAGS.treks);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_treks").select("*").eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load treks: ${error.message}`);
  return toTrekSummaries(data, photosPublicBaseUrl);
};
