import { coverImage } from "@ttn/site-data/images";
import type { WebReviewRatingRow, WebReviewRow, WebSitePageRow, WebTravelGuideRow } from "@ttn/site-data/database.types";
import { reviewAge } from "@ttn/site-data/reviewAge";
import { firstText } from "@ttn/site-data/rowText";

import type { HomeGuide, HomeRating, HomeReview, HomeTop } from "./types";

const REVIEWS_SHOWN = 6;

const GUIDE_TOPICS: Record<WebTravelGuideRow["topic"], string> = { planning: "Planning", "best-time": "Best time to trek", health: "Health and safety", gear: "Gear and packing" };

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

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

/** The featured guide first, then the newest. */
export const toHomeGuides = (rows: readonly WebTravelGuideRow[], photosBaseUrl: string): HomeGuide[] =>
  rows
    .toSorted((a, b) => Number(b.is_featured) - Number(a.is_featured) || b.published_on.localeCompare(a.published_on))
    .slice(0, 5)
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      text: firstText(row.card_text) ?? "",
      topic: row.topic,
      tag: GUIDE_TOPICS[row.topic],
      meta: `${DATE.format(new Date(`${row.published_on}T00:00:00Z`))} · ${row.read_minutes} min read`,
      image: coverImage(row, photosBaseUrl, row.title, row.cover_alt),
      isFeatured: row.is_featured,
    }));
