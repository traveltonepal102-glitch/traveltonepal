import type { SiteImageSource } from "@/lib/images";

/** The review site's name as visitors see it. */
export type ReviewSource = "Google" | "Tripadvisor";

/** A real review the admin chose to show, copied word for word; it links to the original (TRD). */
export type Review = {
  id: string;
  /** The trek page that shows this review; left out for reviews about the company. */
  trekSlug?: string;
  /** The reviewer's own headline, when the review site has one. */
  title?: string;
  /** Stars the reviewer gave (1–5), exactly as published. */
  rating?: 1 | 2 | 3 | 4 | 5;
  quote: string;
  name: string;
  /** "" when the review site doesn't say (Google doesn't). */
  country: string;
  /** The trek it is about, while that trek is published. */
  trekName?: string;
  source: ReviewSource;
  /** The review itself on the review site, used as the quote's `cite`. */
  url: string;
  /** When it was written, the way Google says it, e.g. "5 months ago". */
  age: string;
  /** The reviewer's photo; without one, the card shows their initial. */
  photo?: SiteImageSource;
};

/** The agency's overall rating on a public review site. */
export type RatingSummary = {
  rating: number;
  count: number;
  source: ReviewSource;
  /** The profile with all the reviews ("" when not set in Site settings). */
  url: string;
};

/** What the website shows: the chosen reviews (newest first) and the overall rating, Google first. */
export type PublishedReviews = { reviews: readonly Review[]; rating: RatingSummary | null };
