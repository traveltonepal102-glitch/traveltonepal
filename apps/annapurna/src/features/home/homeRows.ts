import { coverImage } from "@ttn/site-data/images";
import type { WebReviewRatingRow, WebReviewRow, WebSitePageRow, WebTravelGuideRow } from "@ttn/site-data/database.types";
import { reviewAge } from "@ttn/site-data/reviewAge";
import { firstText } from "@ttn/site-data/rowText";

import type { HomeGuide, HomeRating, HomeReview, HomeTop } from "./types";

const REVIEWS_SHOWN = 6;

export const GUIDE_TOPICS: Record<WebTravelGuideRow["topic"], string> = { planning: "Planning", "best-time": "Best time to trek", health: "Health and safety", gear: "Gear and packing" };

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "Oct 25, 2026" from a saved date. */
export const formatGuideDate = (day: string) => DATE.format(new Date(`${day}T00:00:00Z`));

const textOf = (content: unknown, key: string) => {
  const value = content && typeof content === "object" && key in content ? (content as Record<string, unknown>)[key] : "";
  return typeof value === "string" ? value.trim() : "";
};

/** The top of the page from its row: `content` holds what only a region website's Home has (read leniently). */
export const toHomeTop = (row: WebSitePageRow, photosBaseUrl: string): HomeTop => ({
  eyebrow: row.eyebrow.trim(),
  heading: row.heading.trim(),
  intro: row.intro.trim(),
  photo: coverImage(row, photosBaseUrl, row.heading, textOf(row.content, "photoAlt")),
  buttonLabel: textOf(row.content, "buttonLabel") || "Plan my trek on WhatsApp",
  secondLabel: textOf(row.content, "secondLabel"),
});

/** The newest reviews; "5 months ago" is worked out here, so it stays true while the page is cached. */
export const toHomeReviews = (rows: readonly WebReviewRow[], photosBaseUrl: string, now: Date): HomeReview[] =>
  rows
    .toSorted((a, b) => b.reviewed_on.localeCompare(a.reviewed_on))
    .slice(0, REVIEWS_SHOWN)
    .map((row) => ({
      id: row.id,
      source: row.source,
      name: row.reviewer_name,
      when: reviewAge(row.reviewed_on, now),
      rating: row.rating,
      text: row.quote,
      url: row.url,
      photo: row.photo_id && row.photo_variant_widths?.length
        ? { src: `${photosBaseUrl}/${row.photo_id}`, alt: "", variantWidths: row.photo_variant_widths, fileName: row.photo_file_name ?? undefined, placeholder: row.photo_placeholder ?? undefined }
        : undefined,
    }));

/** Google's overall rating as typed in the admin, never one worked out from the chosen reviews. */
export const toHomeRating = (rows: readonly WebReviewRatingRow[]): HomeRating | null => {
  const google = rows.find((row) => row.source === "google");
  return google ? { rating: Number(google.rating), count: google.review_count, profileUrl: google.profile_url } : null;
};

const toGuide = (row: WebTravelGuideRow, photosBaseUrl: string): HomeGuide => ({
  slug: row.slug,
  title: row.title,
  text: firstText(row.card_text) ?? "",
  topic: row.topic,
  tag: GUIDE_TOPICS[row.topic],
  meta: `${formatGuideDate(row.published_on)} · ${row.read_minutes} min read`,
  image: coverImage(row, photosBaseUrl, row.title, row.cover_alt),
  isFeatured: row.is_featured,
  regionSlugs: row.region_slugs,
});

/** Every guide, the featured one first, then the newest. */
export const toAllGuides = (rows: readonly WebTravelGuideRow[], photosBaseUrl: string): HomeGuide[] =>
  rows.toSorted((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.published_on.localeCompare(a.published_on)).map((row) => toGuide(row, photosBaseUrl));

/** The newest guides, whichever is featured: the menu's ten, or every one for the Blogs page. */
export const toLatestGuides = (rows: readonly WebTravelGuideRow[], photosBaseUrl: string, count = 10): HomeGuide[] =>
  rows.toSorted((a, b) => b.published_on.localeCompare(a.published_on)).slice(0, count).map((row) => toGuide(row, photosBaseUrl));

/** How many guides "Read before you go" shows: one large and four beside and under it. */
const SHOWN_GUIDES = 5;

/**
 * The guides a trek page shows: the post its trek picked first (the admin's "Blog post shown first"), then the others
 * in the website's order. A pick that isn't published (any more) is ignored, as if none was made.
 */
export const toTrekPageGuides = (allGuides: readonly HomeGuide[], featuredSlug: string | null): HomeGuide[] => {
  const picked = allGuides.find((guide) => guide.slug === featuredSlug);
  const ordered = picked ? [picked, ...allGuides.filter((guide) => guide !== picked)] : allGuides;
  return ordered.slice(0, SHOWN_GUIDES);
};
