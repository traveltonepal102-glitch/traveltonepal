import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

/**
 * Every page's own JSON-LD blocks (a few rows, read once for all pages). Cached; refreshed when the admin saves
 * structured data, or a trek, region or guide (a new slug, or a page going on or off the website). Throws when the
 * database can't be read (a failed refresh keeps the last good page).
 */
export const listPageSchemas = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.structuredData, CACHE_TAGS.treks, CACHE_TAGS.regions, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_page_schemas").select("*");
  if (error) throw new Error(`Could not load structured data: ${error.message}`);
  return data;
};
