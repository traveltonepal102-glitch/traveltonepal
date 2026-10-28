import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toAdventuresSection } from "../adventureRows";
import type { AdventuresSection } from "../types";

/**
 * The home page's custom adventures: the section's words and the cards the admin shows. Cached; refreshed when
 * the admin saves either. Throws when the database can't be read (a failed refresh keeps the last good page).
 */
export const getAdventuresSection = async (): Promise<AdventuresSection | null> => {
  "use cache";
  cacheTag(CACHE_TAGS.adventures);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createWebsiteClient();
  const [section, adventures] = await Promise.all([client.from("web_adventure_section").select("*").maybeSingle(), client.from("web_adventures").select("*")]);
  if (section.error) throw new Error(`Could not load the adventures section: ${section.error.message}`);
  if (adventures.error) throw new Error(`Could not load adventures: ${adventures.error.message}`);
  return toAdventuresSection(section.data, adventures.data, photosPublicBaseUrl);
};
