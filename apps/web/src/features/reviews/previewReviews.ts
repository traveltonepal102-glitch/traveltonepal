import type { RatingBadgeData } from "./components/RatingBadge";
import type { Review } from "./types";

/**
 * DEVELOPMENT ONLY: the design's bracketed placeholders, so the reviews section can be checked
 * locally before real reviews exist. Never shown in a production build.
 */
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
  age: "[5 months ago]",
}));

const PREVIEW_COMPANY_TOPICS = [
  ["our guide and the trek", "Langtang Valley Trek"],
  ["planning on WhatsApp", "Everest Base Camp"],
  ["safety and acclimatization", "Annapurna Circuit"],
] as const;

/** DEVELOPMENT ONLY: the About page's review placeholders from the design (About.dc.html), one per topic. */
export const PREVIEW_COMPANY_REVIEWS: readonly Review[] = PREVIEW_COMPANY_TOPICS.map(([topic, trekName], index) => ({
  id: `preview-company-${index}`,
  title: "[Review title]",
  quote: `[A real review about ${topic}, copied from Google or TripAdvisor.]`,
  rating: 5,
  name: "[Name]",
  country: "[Country]",
  trekName,
  source: "Google",
  url: "#",
  age: "[5 months ago]",
}));

export const PREVIEW_RATING: RatingBadgeData = {
  ratingLabel: "[4.9]",
  stars: 5,
  countLabel: "[COUNT] reviews on Google",
  accessibleLabel: "Placeholder rating",
  isGoogle: true,
};
