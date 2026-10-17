import type { RatingBadgeData } from "./components/RatingBadge";
import type { ReviewCardData } from "./components/ReviewCard";
import type { Review } from "./types";

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

const PREVIEW_TOPICS = ["about the trek", "about the guide", "about teahouses and food"] as const;

/** DEVELOPMENT ONLY: the trek page's review placeholders from the design (Trek.dc.html). */
export const PREVIEW_TREK_REVIEWS: readonly Review[] = PREVIEW_TOPICS.map((topic, index) => ({
  id: `preview-${index}`,
  title: "[Review title]",
  quote: `[A real review ${topic}, copied from Google or TripAdvisor.]`,
  rating: 5,
  name: "[Reviewer name]",
  country: "[City, country]",
  trekName: "[Trek]",
  source: "Google",
  url: "#",
}));

export const PREVIEW_RATING: RatingBadgeData = {
  ratingLabel: "[4.9]",
  stars: 5,
  countLabel: "[COUNT] reviews on Google",
  accessibleLabel: "Placeholder rating",
};
