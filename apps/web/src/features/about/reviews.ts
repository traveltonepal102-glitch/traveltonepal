import type { RatingBadgeData } from "@/features/reviews/components/RatingBadge";
import { PREVIEW_COMPANY_REVIEWS, PREVIEW_RATING } from "@/features/reviews/previewReviews";
import { ratingBadgeFor } from "@/features/reviews/ratingBadge";
import type { PublishedReviews, Review } from "@/features/reviews/types";

const ABOUT_REVIEW_COUNT = 3;

const isDevelopmentBuild = () => process.env.NODE_ENV === "development";

/**
 * Reviews for the About page: the newest ones the admin chose. With none yet, `pnpm dev` shows the design's
 * placeholders to check the layout, and production builds leave the section (and its link) out.
 */
export const aboutPageReviews = (published: PublishedReviews, isDevelopment = isDevelopmentBuild()): readonly Review[] => {
  if (published.reviews.length > 0) return published.reviews.slice(0, ABOUT_REVIEW_COUNT);
  return isDevelopment ? PREVIEW_COMPANY_REVIEWS : [];
};

/** The overall rating (hero stat and reviews badge); a placeholder in `pnpm dev`, else null until one is typed in. */
export const aboutPageRating = (published: PublishedReviews, isDevelopment = isDevelopmentBuild()): RatingBadgeData | null => {
  if (published.rating) return ratingBadgeFor(published.rating);
  return isDevelopment ? PREVIEW_RATING : null;
};
