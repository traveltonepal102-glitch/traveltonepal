import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl } from "@/env";
import { getSitePageRow } from "@/features/site-pages/services/sitePagesRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toAboutPage, toAboutTeam } from "../aboutPageRows";
import type { AboutPageContent, TeamMember } from "../types";

/** The About page from Pages › About (also read by trek pages: founder, promises). Throws on a database error. */
export const getAboutPage = async (): Promise<AboutPageContent> => toAboutPage(await getSitePageRow("about"), photosPublicBaseUrl);

/**
 * "Our guides and team": the people with "Show on the About page" ticked in Authors and Trekking guides. Cached,
 * refreshed when either is saved; throws when the database can't be read.
 */
export const listAboutTeam = async (): Promise<TeamMember[]> => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.trekkingGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_about_team").select("*");
  if (error) throw new Error(`Could not load the About team: ${error.message}`);
  return toAboutTeam(data, photosPublicBaseUrl);
};
