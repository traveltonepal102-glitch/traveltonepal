export type ReviewSource = "Google" | "TripAdvisor";

/** A real, published review. Every review must link to where it was published (TRD). */
export type Review = {
  id: string;
  quote: string;
  name: string;
  country: string;
  trekName: string;
  source: ReviewSource;
  /** Public page of this review, used as the quote's `cite`. */
  url: string;
};

/** The agency's overall rating on a public review site. */
export type RatingSummary = {
  rating: number;
  count: number;
  source: ReviewSource;
  url: string;
};
