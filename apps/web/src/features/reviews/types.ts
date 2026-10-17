export type ReviewSource = "Google" | "TripAdvisor";

/** A real, published review. Every review must link to where it was published (TRD). */
export type Review = {
  id: string;
  /** The trek page that shows this review (slug in TREKS); left out for reviews about the company. */
  trekSlug?: string;
  /** The reviewer's own headline, when the review site has one. */
  title?: string;
  /** Stars the reviewer gave (1–5), exactly as published. */
  rating?: 1 | 2 | 3 | 4 | 5;
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
