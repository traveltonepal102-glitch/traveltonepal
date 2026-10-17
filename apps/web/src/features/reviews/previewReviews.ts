import type { RatingBadgeData } from "./components/RatingBadge";
import type { ReviewCardData } from "./components/ReviewCard";

/**
 * DEVELOPMENT ONLY: the design's bracketed placeholders, so the reviews section can be checked
 * locally before real reviews exist. Never shown in a production build.
 */
const PREVIEW_TREKS = ["Langtang Valley", "Everest Base Camp", "Annapurna Circuit"] as const;

export const PREVIEW_REVIEW_CARDS: readonly ReviewCardData[] = PREVIEW_TREKS.map((trek) => ({
  key: trek,
  quote: `[A real review from Google or TripAdvisor about the ${trek} trek goes here.]`,
  name: "[Name]",
  meta: `[Country] · ${trek}`,
}));

export const PREVIEW_RATING: RatingBadgeData = {
  ratingLabel: "[4.9]",
  stars: 5,
  countLabel: "[COUNT] reviews on Google",
  accessibleLabel: "Placeholder rating",
};
