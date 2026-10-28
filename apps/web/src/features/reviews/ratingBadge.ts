import type { RatingBadgeData } from "./components/RatingBadge";
import type { RatingSummary } from "./types";

/** A published overall rating as the rating badge shows it, e.g. "4.9" with "128 reviews on Google". */
export const ratingBadgeFor = (summary: RatingSummary): RatingBadgeData => ({
  ratingLabel: summary.rating.toFixed(1),
  stars: Math.round(summary.rating),
  countLabel: `${summary.count} reviews on ${summary.source}`,
  accessibleLabel: `Rated ${summary.rating.toFixed(1)} out of 5 from ${summary.count} reviews on ${summary.source}`,
  href: summary.url,
  isGoogle: summary.source === "Google",
});
