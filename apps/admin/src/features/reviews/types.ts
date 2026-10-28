import type { REVIEW_SOURCE_VALUES } from "./constants";

export type ReviewSource = (typeof REVIEW_SOURCE_VALUES)[number];

/** What the review form edits: the review exactly as published, plus where the website shows it. */
export type ReviewValues = {
  source: ReviewSource;
  /** The review itself on the review site ("Share review" link). */
  url: string;
  reviewerName: string;
  /** "" when the review site doesn't say (Google doesn't). */
  reviewerCountry: string;
  /** Stars the reviewer gave, 1–5. */
  rating: number;
  /** Tripadvisor reviews have one; Google reviews don't. */
  title: string;
  quote: string;
  /** "YYYY-MM-DD"; "" in a new, empty form. */
  reviewedOn: string;
  /** The trek it is about; null: about the company. */
  trekId: string | null;
  isShown: boolean;
};

export type Review = ReviewValues & { id: string; updatedAt: string };

/** A trek a review can be about. */
export type ReviewTrekOption = { id: string; name: string };

/** The overall rating on a review site, from that site's own numbers. */
export type ReviewRating = { source: ReviewSource; rating: number; reviewCount: number };
