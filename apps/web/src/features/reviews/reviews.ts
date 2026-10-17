import type { RatingSummary, Review } from "./types";

/**
 * Real reviews only, copied from Google or TripAdvisor with a link to each (TRD: ratings only from
 * reviews with a public source). Empty until the owner provides them; the home reviews section
 * stays hidden in production while this is empty. Moves to Payload in the CMS phase.
 */
export const REVIEWS: readonly Review[] = [];

/** Overall Google rating, shown next to the reviews. Null until the real numbers are known. */
export const GOOGLE_RATING: RatingSummary | null = null;
