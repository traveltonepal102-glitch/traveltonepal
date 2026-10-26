import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { permanentRedirect } from "next/navigation";

import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import type { WebRedirectRow } from "@/lib/supabase/database.types";
import { createWebsiteClient } from "@/lib/supabase/server";
import { guidePath, regionPath, trekPath } from "@/lib/routes";

/** Old addresses of treks, regions and travel guides; a save that changes a slug adds one (slug_redirects). */
const readRedirects = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.regions, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_redirects").select("*");
  if (error) throw new Error(`Could not load redirects: ${error.message}`);
  return data;
};

const PATHS: Record<WebRedirectRow["kind"], (slug: string) => string> = { trek: trekPath, region: regionPath, guide: guidePath };

/**
 * For a page whose address wasn't found: when it is an old address, answer with a permanent redirect (308) to
 * today's; otherwise return, and the page answers 404.
 */
export const redirectIfMoved = async (kind: WebRedirectRow["kind"], slug: string) => {
  const redirect = (await readRedirects()).find((row) => row.kind === kind && row.from_slug === slug);
  if (redirect) permanentRedirect(PATHS[kind](redirect.to_slug));
};
