import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { toHomeReviews } from "@/features/home/homeRows";
import { toHomeTrek } from "@/features/home/homeTrekRows";
import { getHomeData } from "@/features/home/services/homeRepository";
import { check, readTrekRows } from "@/features/home/services/trekRowsRepository";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";
import { ROUTES, pagePath } from "@/lib/routes";

import { toTrekSeo, toTrekTop } from "../trekPageRows";
import { toTrekSeoOverrides } from "../trekSeoOverrides";
import type { TrekPageData } from "../types";

/** This website's treks that have their own page: all with a page but the main one, which is the home page. */
export const listTrekPages = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createDatabaseClient();
  const [site, treks] = await Promise.all([client.from("web_site").select("home_trek_slug").single(), client.from("web_treks").select("slug, updated_at, has_page").eq("locale", WEBSITE_LOCALE)]);
  const homeSlug = check(site, "the website").home_trek_slug;
  return check(treks, "the treks").flatMap((row) => (row.has_page && row.slug !== homeSlug ? [{ slug: row.slug, modified: row.updated_at }] : []));
};

/** The Google cards' choices for this website's treks (Throws on a database error). */
const getTrekSeoOverrides = async () => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.pages);
  cacheLife(DATABASE_CACHE_LIFE);

  const [rows, treks] = await Promise.all([createDatabaseClient().from("web_page_seo_overrides").select("*").eq("locale", WEBSITE_LOCALE), listTrekPages()]);
  return toTrekSeoOverrides(check(rows, "the treks' Google settings"), new Set<string>([ROUTES.home, ROUTES.about, ROUTES.contact, ...treks.map((trek) => pagePath(trek.slug))]));
};

/** The trek pages the sitemap lists: not hidden, and their own main version. */
export const listListedTrekPages = async () => {
  const [treks, { hidden, canonicals }] = await Promise.all([listTrekPages(), getTrekSeoOverrides()]);
  return treks.filter((trek) => !hidden.has(trek.slug) && !canonicals.has(trek.slug));
};

/** Today's address of a trek that was renamed, or undefined. */
export const findMovedTrekPath = async (slug: string) => {
  "use cache";
  cacheTag(CACHE_TAGS.treks);
  cacheLife(DATABASE_CACHE_LIFE);

  const moved = await createDatabaseClient().from("web_redirects").select("to_slug").eq("kind", "trek").eq("from_slug", slug).maybeSingle();
  if (moved.error) throw new Error(`Could not load redirects: ${moved.error.message}`);
  return moved.data ? pagePath(moved.data.to_slug) : undefined;
};

/**
 * Everything a trek's own page shows, read once and cached; null when this website has no such page (the main trek's
 * page is the home page). What the website shares with Home comes from its cached read; the reviews are this trek's own.
 */
export const getTrekPage = async (slug: string): Promise<TrekPageData | null> => {
  "use cache";
  cacheTag(CACHE_TAGS.treks, CACHE_TAGS.reviews);
  cacheLife(DATABASE_CACHE_LIFE);

  const home = await getHomeData();
  const card = home.otherTreks.find((other) => other.slug === slug);
  if (!card?.hasPage) return null;

  const client = createDatabaseClient();
  const [summary, rows, reviews, { hidden, canonicals }] = await Promise.all([
    client.from("web_treks").select("*").eq("slug", slug).eq("locale", WEBSITE_LOCALE).single(),
    readTrekRows(slug),
    client.from("web_reviews").select("*").eq("trek_slug", slug),
    getTrekSeoOverrides(),
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
    guides: home.guides,
    seo: toTrekSeo(summaryRow, rows.page, photosPublicBaseUrl, home.seo.isLive),
    isHidden: hidden.has(slug),
    canonicalPath: canonicals.get(slug),
  };
};
