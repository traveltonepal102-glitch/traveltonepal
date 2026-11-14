import "server-only";
import { latestOf, toPageDates } from "@ttn/site-data/pageDates";
import { photoShareUrl } from "@ttn/ui/lib/photos";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";

import { toHomeAdventures, toHomeCompany } from "../homeCompanyRows";
import { toAllGuides, toHomeRating, toHomeReviews, toHomeTop, toLatestGuides, toTrekPageGuides } from "../homeRows";
import { toHomeTrek, toTrekCard } from "../homeTrekRows";
import type { HomeData } from "../types";
import { check, readTrekRows } from "./trekRowsRepository";

/**
 * Everything the home page shows, read once and cached. Throws when the database can't be read (a failed refresh keeps
 * the last good page). The website's rows only: the client says which website is asking.
 */
export const getHomeData = async (): Promise<HomeData> => {
  "use cache";
  cacheTag(CACHE_TAGS.pages, CACHE_TAGS.treks, CACHE_TAGS.reviews, CACHE_TAGS.travelGuides, CACHE_TAGS.settings, CACHE_TAGS.trekkingGuides, CACHE_TAGS.adventures);
  cacheLife(DATABASE_CACHE_LIFE);

  const client = createDatabaseClient();
  const [site, page, about, treks, reviews, ratings, guides, adventures, adventureSection] = await Promise.all([
    client.from("web_site").select("*").single(),
    client.from("web_site_pages").select("*").eq("slug", "home").single(),
    client.from("web_site_pages").select("*").eq("slug", "about").maybeSingle(),
    client.from("web_treks").select("*").eq("locale", WEBSITE_LOCALE),
    client.from("web_reviews").select("*"),
    client.from("web_review_ratings").select("*"),
    client.from("web_travel_guides").select("*").eq("locale", WEBSITE_LOCALE),
    client.from("web_adventures").select("*"),
    client.from("web_adventure_section").select("*").maybeSingle(),
  ]);
  if (about.error) throw new Error(`Could not load the About page: ${about.error.message}`);
  if (adventureSection.error) throw new Error(`Could not load the adventures' words: ${adventureSection.error.message}`);
  const siteRow = check(site, "the website");
  const pageRow = check(page, "the home page");
  const trekRows = check(treks, "the treks");
  const guideRows = check(guides, "the travel guides");

  const homeSlug = siteRow.home_trek_slug;
  const summary = trekRows.find((row) => row.slug === homeSlug);
  const homeRows = homeSlug && summary ? await readTrekRows(homeSlug) : null;
  const top = toHomeTop(pageRow, photosPublicBaseUrl);
  const allGuides = toAllGuides(guideRows, photosPublicBaseUrl);
  const shareId = pageRow.share_id ?? pageRow.cover_id;

  return {
    top,
    trek: summary && homeRows?.page ? toHomeTrek({ summary, page: homeRows.page, photos: homeRows.photos, guides: homeRows.guides }, photosPublicBaseUrl, trekFilesPublicBaseUrl) : null,
    trekCard: summary ? toTrekCard(summary, photosPublicBaseUrl, homeSlug) : null,
    otherTreks: trekRows.filter((row) => row.slug !== homeSlug).map((row) => toTrekCard(row, photosPublicBaseUrl, homeSlug)),
    reviews: toHomeReviews(check(reviews, "the reviews"), photosPublicBaseUrl, new Date()),
    rating: toHomeRating(check(ratings, "the rating")),
    // Home is the main trek's page: it shows the posts that trek picked, as on the other treks' pages.
    guides: toTrekPageGuides(allGuides, homeRows?.page?.guide_slugs ?? []),
    allGuides,
    latestGuides: toLatestGuides(guideRows, photosPublicBaseUrl),
    company: toHomeCompany(about.data, photosPublicBaseUrl),
    adventures: toHomeAdventures(adventureSection.data, check(adventures, "the adventures"), photosPublicBaseUrl),
    seo: {
      title: pageRow.seo_title.trim() || top.heading,
      description: pageRow.seo_description.trim() || top.intro,
      shareImageBase: shareId ? photoShareUrl(`${photosPublicBaseUrl}/${shareId}`) : undefined,
      isLive: siteRow.is_live,
      // The page is the top and the trek: whichever was saved last.
      dates: toPageDates(pageRow.published_at, latestOf(pageRow.updated_at, summary?.updated_at)),
    },
  };
};
