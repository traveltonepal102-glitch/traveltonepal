import { coverImage } from "@/lib/images";
import type { WebReviewRatingRow, WebReviewRow } from "@/lib/supabase/database.types";

import { reviewAge } from "./reviewAge";
import type { PublishedReviews, Review, ReviewSource } from "./types";

const SOURCE_LABELS: Record<WebReviewRow["source"], ReviewSource> = { google: "Google", tripadvisor: "Tripadvisor" };

/** Google first: it has the most reviews and is where trekkers check. */
const RATING_ORDER: readonly WebReviewRow["source"][] = ["google", "tripadvisor"];

const isStars = (value: number): value is NonNullable<Review["rating"]> => Number.isInteger(value) && value >= 1 && value <= 5;

/** The reviewer's photo, as a library photo of the sizes the website has. */
const reviewerPhoto = (row: WebReviewRow, photosBaseUrl: string) =>
  coverImage(
    {
      cover_id: row.photo_id,
      cover_width: null,
      cover_height: null,
      cover_variant_widths: row.photo_variant_widths,
      cover_placeholder: row.photo_placeholder,
      cover_place: null,
    },
    photosBaseUrl,
    row.reviewer_name,
    row.reviewer_name.trim(),
  );

/** A web_reviews row as the review cards show it (its age as of `now`); blank optional texts are left out. */
export const toReview = (row: WebReviewRow, photosBaseUrl: string, now: Date): Review => ({
  id: row.id,
  trekSlug: row.trek_slug ?? undefined,
  title: row.title.trim() || undefined,
  rating: isStars(row.rating) ? row.rating : undefined,
  quote: row.quote.trim(),
  name: row.reviewer_name.trim(),
  country: row.reviewer_country.trim(),
  trekName: row.trek_name?.trim() || undefined,
  source: SOURCE_LABELS[row.source],
  url: row.url,
  age: reviewAge(row.reviewed_on, now),
  photo: reviewerPhoto(row, photosBaseUrl),
});

/** Newest first; the overall rating of the first review site that has one (a link only when it is secure). */
export const toPublishedReviews = (
  reviews: readonly WebReviewRow[],
  ratings: readonly WebReviewRatingRow[],
  photosBaseUrl: string,
  now: Date,
): PublishedReviews => {
  const rating = RATING_ORDER.map((source) => ratings.find((row) => row.source === source)).find((row) => row !== undefined);
  return {
    reviews: [...reviews].sort((a, b) => b.reviewed_on.localeCompare(a.reviewed_on)).map((row) => toReview(row, photosBaseUrl, now)),
    rating: rating
      ? {
          rating: Number(rating.rating),
          count: rating.review_count,
          source: SOURCE_LABELS[rating.source],
          url: rating.profile_url.startsWith("https://") ? rating.profile_url : "",
        }
      : null,
  };
};

/** The reviews shown on one trek's page. */
export const reviewsForTrek = (published: PublishedReviews, trekSlug: string): Review[] =>
  published.reviews.filter((review) => review.trekSlug === trekSlug);

/** The line under a reviewer's name, e.g. "Germany · Langtang Valley Trek" (blank parts left out). */
export const reviewMeta = (review: Pick<Review, "country" | "trekName">) => [review.country, review.trekName].filter(Boolean).join(" · ");
