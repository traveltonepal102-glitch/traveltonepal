import { PREVIEW_TREK_REVIEWS } from "@/features/reviews/previewReviews";
import { reviewsForTrek } from "@/features/reviews/reviewRows";
import type { PublishedReviews, Review } from "@/features/reviews/types";

/**
 * Reviews for a trek page: the ones the admin chose for this trek. With none yet, `pnpm dev` shows the design's
 * placeholders to check the layout, and production builds leave the section (and its link) out.
 */
export const trekPageReviews = (
  published: PublishedReviews,
  trekSlug: string,
  isDevelopment = process.env.NODE_ENV === "development",
): readonly Review[] => {
  const chosen = reviewsForTrek(published, trekSlug);
  if (chosen.length > 0) return chosen;
  return isDevelopment ? PREVIEW_TREK_REVIEWS : [];
};
