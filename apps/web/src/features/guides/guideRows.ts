import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTravelGuideRow } from "@/lib/supabase/database.types";

import { getGuideTopic } from "./topics";
import type { GuideSummary, TravelGuide } from "./types";

/** The main site shows its own guides and the region sites' guides marked "also on the main site". */
const isOnMainSite = (row: WebTravelGuideRow) => row.site_region_slug === null || row.also_on_main_site;

/** Featured first, then the newest (ISO dates sort as text), then by address so the order never flips. */
const byFeaturedThenNewest = (a: WebTravelGuideRow, b: WebTravelGuideRow) =>
  Number(b.is_featured) - Number(a.is_featured) || b.published_on.localeCompare(a.published_on) || a.slug.localeCompare(b.slug);

/**
 * The web_travel_guides rows (published, date come) as the main site's guide cards. A guide without a title or
 * cover photo isn't shown (publishing needs both; skipped to be safe).
 */
export const toMainSiteGuideCards = (rows: readonly WebTravelGuideRow[], photosBaseUrl: string): GuideSummary[] =>
  rows
    .filter(isOnMainSite)
    .toSorted(byFeaturedThenNewest)
    .flatMap((row): GuideSummary[] => {
      const title = firstText(row.title);
      const image = title && coverImage(row, photosBaseUrl, title, row.cover_alt);
      if (!title || !image) return [];
      const topic = getGuideTopic(row.topic);
      return [{ slug: row.slug, title, excerpt: row.card_text.trim(), tag: topic.label, tagIcon: topic.icon, image }];
    });

/**
 * The web_travel_guides rows as the Travel guides page's guides, in the same order as the cards (featured first,
 * then the newest). A guide without a title or cover photo isn't shown.
 */
export const toTravelGuides = (rows: readonly WebTravelGuideRow[], photosBaseUrl: string): TravelGuide[] =>
  rows
    .filter(isOnMainSite)
    .toSorted(byFeaturedThenNewest)
    .flatMap((row): TravelGuide[] => {
      const title = firstText(row.title);
      const image = title && coverImage(row, photosBaseUrl, title, row.cover_alt);
      if (!title || !image) return [];
      return [
        {
          slug: row.slug,
          title,
          shortTitle: title,
          excerpt: row.card_text.trim(),
          topic: getGuideTopic(row.topic).id,
          image,
          regionSlugs: row.region_slugs,
          publishedOn: row.published_on,
          readMinutes: row.read_minutes,
          author: row.author_name.trim(),
          isFeatured: row.is_featured,
          startHerePosition: row.start_here_position ?? undefined,
        },
      ];
    });

/** "Start here": the guides numbered for it, in their order. */
export const startHereGuides = (guides: readonly TravelGuide[]) =>
  guides
    .flatMap((guide) => (guide.startHerePosition ? [{ guide, position: guide.startHerePosition }] : []))
    .toSorted((a, b) => a.position - b.position)
    .map(({ guide }) => guide);
