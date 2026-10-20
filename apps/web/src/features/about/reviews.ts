import type { RatingBadgeData } from "@/features/reviews/components/RatingBadge";
import { PREVIEW_COMPANY_REVIEWS, PREVIEW_RATING } from "@/features/reviews/previewReviews";
import { ratingBadgeFor } from "@/features/reviews/ratingBadge";
import { GOOGLE_RATING, REVIEWS } from "@/features/reviews/reviews";
import type { Review } from "@/features/reviews/types";

const ABOUT_REVIEW_COUNT = 3;

const isDevelopmentBuild = () => process.env.NODE_ENV === "development";

/**
 * Reviews for the About page: the first published ones. With none yet, `pnpm dev` shows the design's
 * placeholders to check the layout, and production builds leave the section (and its link) out.
 */
export const aboutPageReviews = (isDevelopment = isDevelopmentBuild()): readonly Review[] => {
  if (REVIEWS.length > 0) return REVIEWS.slice(0, ABOUT_REVIEW_COUNT);
  return isDevelopment ? PREVIEW_COMPANY_REVIEWS : [];
};

/** The published overall rating (hero stat and reviews badge); a placeholder in `pnpm dev`, else null. */
export const aboutPageRating = (isDevelopment = isDevelopmentBuild()): RatingBadgeData | null => {
  if (GOOGLE_RATING) return ratingBadgeFor(GOOGLE_RATING);
  return isDevelopment ? PREVIEW_RATING : null;
};
