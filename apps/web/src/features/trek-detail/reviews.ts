import { PREVIEW_TREK_REVIEWS } from "@/features/reviews/previewReviews";
import { reviewsForTrek } from "@/features/reviews/reviews";
import type { Review } from "@/features/reviews/types";

/**
 * Reviews for a trek page: the real, published ones. With none yet, `pnpm dev` shows the design's
 * placeholders to check the layout, and production builds leave the section (and its link) out.
 */
export const trekPageReviews = (trekSlug: string, isDevelopment = process.env.NODE_ENV === "development"): readonly Review[] => {
  const published = reviewsForTrek(trekSlug);
  if (published.length > 0) return published;
  return isDevelopment ? PREVIEW_TREK_REVIEWS : [];
};
