import "server-only";
import { latestOf, toPageDates } from "@ttn/site-data/pageDates";
import { photoShareUrl } from "@ttn/ui/lib/photos";
import { cacheLife, cacheTag } from "next/cache";

import { photosPublicBaseUrl, trekFilesPublicBaseUrl } from "@/env";
import { CACHE_TAGS, DATABASE_CACHE_LIFE, WEBSITE_LOCALE, createDatabaseClient } from "@/lib/database";

import { toHomeAdventures, toHomeCompany } from "../homeCompanyRows";
import { toHomeGuides, toHomeRating, toHomeReviews, toHomeTop } from "../homeRows";
import { toHomeTrek, toTrekCard } from "../homeTrekRows";
import type { HomeData } from "../types";

const check = <Row>({ data, error }: { data: Row | null; error: { message: string } | null }, what: string): Row => {
  if (error || data === null) throw new Error(`Could not load ${what}: ${error?.message ?? "nothing found"}`);
  return data;
};

/** The main trek's own rows, when the website has one that is published with a page. */
const readTrekRows = async (slug: string) => {
  const client = createDatabaseClient();
  const [page, photos, guides] = await Promise.all([
    client.from("web_trek_pages").select("*").eq("slug", slug).eq("locale", WEBSITE_LOCALE).maybeSingle(),
    client.from("web_trek_photos").select("*").eq("trek_slug", slug),
    client.from("web_trek_guides").select("*").eq("trek_slug", slug).eq("locale", WEBSITE_LOCALE),
  ]);
  if (page.error) throw new Error(`Could not load the trek "${slug}": ${page.error.message}`);
  return { page: page.data, photos: check(photos, "the trek's photos"), guides: check(guides, "the trek's guides") };
};

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

  const homeSlug = siteRow.home_trek_slug;
  const summary = trekRows.find((row) => row.slug === homeSlug);
  const homeRows = homeSlug && summary ? await readTrekRows(homeSlug) : null;
  const top = toHomeTop(pageRow, photosPublicBaseUrl);
  const shareId = pageRow.share_id ?? pageRow.cover_id;

  return {
    top,
    trek: summary && homeRows?.page ? toHomeTrek({ summary, page: homeRows.page, photos: homeRows.photos, guides: homeRows.guides }, photosPublicBaseUrl, trekFilesPublicBaseUrl) : null,
    trekCard: summary ? toTrekCard(summary, photosPublicBaseUrl) : null,
    otherTreks: trekRows.filter((row) => row.slug !== homeSlug).map((row) => toTrekCard(row, photosPublicBaseUrl)),
    reviews: toHomeReviews(check(reviews, "the reviews"), photosPublicBaseUrl, new Date()),
    rating: toHomeRating(check(ratings, "the rating")),
    guides: toHomeGuides(check(guides, "the travel guides"), photosPublicBaseUrl),
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
