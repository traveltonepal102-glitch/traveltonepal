import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { toHomeReviews, toTrekPageGuides } from "@/features/home/homeRows";
import { toHomeTrek } from "@/features/home/homeTrekRows";
import { getHomeData } from "@/features/home/services/homeRepository";
import { check, readTrekRows } from "@/features/home/services/trekRowsRepository";
import { getPageSeoOverrides } from "@/features/site-pages/services/pageSeoOverridesRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";
import { pagePath } from "@/lib/routes";

import { toTrekSeo, toTrekTop } from "../trekPageRows";
import type { TrekPageData } from "../types";

/** Today's address of a trek or blog that was renamed, or undefined. */
export const findMovedPath = async (slug: string) => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.travelGuides);
  cacheLife(DATABASE_CACHE_LIFE);

  const { data, error } = await createDatabaseClient().from("web_redirects").select("to_slug").in("kind", ["trek", "guide"]).eq("from_slug", slug).limit(1);
  if (error) throw new Error(`Could not load redirects: ${error.message}`);
  return data[0] && pagePath(data[0].to_slug);
};

/**
 * Everything a trek's own page shows, read once and cached; null when this website has no such page (the main trek's
 * page is the home page). What the website shares with Home comes from its cached read; the reviews are this trek's own.
 */
export const getTrekPage = async (slug: string): Promise<TrekPageData | null> => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.reviews, CACHE_TAGS.settings);
  cacheLife(DATABASE_CACHE_LIFE);

  const home = await getHomeData();
  const card = home.otherTreks.find((other) => other.slug === slug);
  if (!card?.hasPage) return null;

  const client = createDatabaseClient();
  const [summary, rows, reviews, { hidden, canonicals }, settings] = await Promise.all([
    client.from("web_treks").select("*").eq("slug", slug).eq("locale", WEBSITE_LOCALE).single(),
    readTrekRows(slug),
    client.from("web_reviews").select("*").eq("trek_slug", slug),
    getPageSeoOverrides(),
    getSiteSettings(),
  ]);
  const summaryRow = check(summary, "the trek");
  if (!rows.page) return null;

  return {
    top: toTrekTop(summaryRow, rows.page),
    trek: toHomeTrek({ summary: summaryRow, page: rows.page, photos: rows.photos, guides: rows.guides }, photosPublicBaseUrl, trekFilesPublicBaseUrl),
    card,
    others: [...(home.trekCard ? [home.trekCard] : []), ...home.otherTreks.filter((other) => other.slug !== slug)],
    reviews: toHomeReviews(check(reviews, "the trek's reviews"), photosPublicBaseUrl, new Date()),
    rating: home.rating,
    company: home.company,
    adventures: home.adventures,
    guides: toTrekPageGuides(home.allGuides, rows.page.featured_guide_slug),
    seo: toTrekSeo(summaryRow, rows.page, photosPublicBaseUrl, home.seo.isLive, settings.shareImageBase),
    isHidden: hidden.has(pagePath(slug)),
    canonicalPath: canonicals.get(pagePath(slug)),
  };
};
