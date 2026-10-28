import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { ReviewValues } from "./types";

export const REVIEWS_PATH = ADMIN_SECTIONS.reviews.href;
/** The list with a review's edit panel open (the panel lives on the list, like Authors). */
export const reviewPath = (reviewId: string) => `${REVIEWS_PATH}?review=${reviewId}`;
export const NEW_REVIEW_PATH = reviewPath("new");

/** Hard limits, the same as the database checks (supabase/migrations/20261027130000_reviews.sql). */
export const REVIEW_LIMITS = {
  url: 500,
  name: 80,
  country: 60,
  title: 120,
  quote: 1500,
} as const;

export const REVIEW_SOURCE_VALUES = ["google", "tripadvisor"] as const;

export const REVIEW_SOURCES: { value: (typeof REVIEW_SOURCE_VALUES)[number]; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "tripadvisor", label: "Tripadvisor" },
];

export const STAR_OPTIONS = [5, 4, 3, 2, 1].map((stars) => ({ value: String(stars), label: `${"★".repeat(stars)}${"☆".repeat(5 - stars)}  ${stars} star${stars === 1 ? "" : "s"}` }));

/** A new review: from Google, five stars and shown, as most added reviews are; everything else is pasted in. */
export const EMPTY_REVIEW_VALUES: ReviewValues = {
  source: "google",
  url: "",
  reviewerName: "",
  reviewerCountry: "",
  rating: 5,
  title: "",
  quote: "",
  reviewedOn: "",
  trekId: null,
  isShown: true,
};
