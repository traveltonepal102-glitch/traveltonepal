import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { listRegionCards } from "@/features/regions/services/regionsRepository";
import { listTreks } from "@/features/treks/services/treksRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE } from "@/lib/cacheTags";
import { createWebsiteClient } from "@/lib/supabase/server";

import { toTrekDetail } from "../trekPageRows";
import type { TrekDetail } from "../types";

/**
 * The reads below are cached per trek and throw when the database can't be read: a failed refresh then keeps the
 * last good page, rather than caching an empty one.
 */
const readPageRow = async (slug: string) => {
  "use cache";
  // Similar treks are the published ones, so saving any trek changes it.
  cacheTag(CACHE_TAGS.treks);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient()
    .from("web_trek_pages")
    .select("*")
    .eq("slug", slug)
    .eq("locale", WEBSITE_LOCALE)
    .maybeSingle();
  if (error) throw new Error(`Could not load the trek page "${slug}": ${error.message}`);
  return data;
};

const readPhotoRows = async (slug: string) => {
  "use cache";
  cacheTag(CACHE_TAGS.treks);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient().from("web_trek_photos").select("*").eq("trek_slug", slug);
  if (error) throw new Error(`Could not load the photos of "${slug}": ${error.message}`);
  return data;
};

const readGuideRows = async (slug: string) => {
  "use cache";
  // A trek save changes who leads it; a guide save, their card.
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.trekkingGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createWebsiteClient()
    .from("web_trek_guides")
    .select("*")
    .eq("trek_slug", slug)
    .eq("locale", WEBSITE_LOCALE);
  if (error) throw new Error(`Could not load the guides of "${slug}": ${error.message}`);
  return data;
};

/** The published treks that have their own page (prerendered at build time). */
export const listTrekPageSlugs = async (): Promise<string[]> => (await listTreks()).flatMap((trek) => (trek.hasPage ? trek.slug : []));

/**
 * A trek's page, or undefined when it has none. The address comes from the visitor, so it is first looked up
 * among the published treks (one cached read): an unknown address reads nothing more.
 */
export const getTrekDetail = async (slug: string): Promise<TrekDetail | undefined> => {
  const treks = await listTreks();
  const summary = treks.find((trek) => trek.slug === slug);
  if (!summary?.hasPage) return undefined;

  // The region cards only for a trek across several regions ("Regions on this route"; a cached read).
  const [page, photos, guides, regions] = await Promise.all([
    readPageRow(slug),
    readPhotoRows(slug),
    readGuideRows(slug),
    summary.route.length > 1 ? listRegionCards() : [],
  ]);
  if (!page) return undefined;
  return toTrekDetail({ summary, page, photos, guides, treks, regions }, photosPublicBaseUrl, trekFilesPublicBaseUrl);
};
