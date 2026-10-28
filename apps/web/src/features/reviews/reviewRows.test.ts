import { describe, expect, it } from "vitest";

import type { WebReviewRatingRow, WebReviewRow } from "@/lib/supabase/database.types";

import { reviewMeta, reviewsForTrek, toPublishedReviews } from "./reviewRows";

const row = (overrides: Partial<WebReviewRow> = {}): WebReviewRow => ({
  id: "r1",
  source: "google",
  url: "https://maps.app.goo.gl/review1",
  reviewer_name: " Anna Schmidt ",
  reviewer_country: "",
  rating: 5,
  title: "",
  quote: " Best trek of our lives. ",
  reviewed_on: "2026-10-01",
  trek_slug: "langtang-valley",
  trek_name: "Langtang Valley Trek",
  ...overrides,
});

const rating = (overrides: Partial<WebReviewRatingRow> = {}): WebReviewRatingRow => ({
  source: "google",
  rating: 4.9,
  review_count: 37,
  profile_url: "https://g.page/traveltonepal",
  ...overrides,
});

describe("toPublishedReviews", () => {
  it("shows a review word for word, leaving out what the review site doesn't give", () => {
    const [review] = toPublishedReviews([row()], []).reviews;
    expect(review).toEqual({
      id: "r1",
      trekSlug: "langtang-valley",
      title: undefined,
      rating: 5,
      quote: "Best trek of our lives.",
      name: "Anna Schmidt",
      country: "",
      trekName: "Langtang Valley Trek",
      source: "Google",
      url: "https://maps.app.goo.gl/review1",
    });
  });

  it("puts the newest review first", () => {
    const reviews = toPublishedReviews([row({ id: "old", reviewed_on: "2026-01-05" }), row({ id: "new", reviewed_on: "2026-09-30" })], []).reviews;
    expect(reviews.map((review) => review.id)).toEqual(["new", "old"]);
  });

  it("uses the Google rating first, and no rating when none is typed in", () => {
    const published = toPublishedReviews([], [rating({ source: "tripadvisor", rating: 5, review_count: 3 }), rating()]);
    expect(published.rating).toEqual({ rating: 4.9, count: 37, source: "Google", url: "https://g.page/traveltonepal" });
    expect(toPublishedReviews([], []).rating).toBeNull();
  });

  it("drops a rating link that isn't secure", () => {
    expect(toPublishedReviews([], [rating({ profile_url: "" })]).rating?.url).toBe("");
  });
});

describe("reviewsForTrek and reviewMeta", () => {
  it("keeps one trek's reviews; a company review has no trek", () => {
    const published = toPublishedReviews([row(), row({ id: "company", trek_slug: null, trek_name: null })], []);
    expect(reviewsForTrek(published, "langtang-valley").map((review) => review.id)).toEqual(["r1"]);
    expect(published.reviews[1]?.trekSlug).toBeUndefined();
  });

  it("writes the line under the name without empty parts", () => {
    expect(reviewMeta({ country: "Germany", trekName: "Langtang Valley Trek" })).toBe("Germany · Langtang Valley Trek");
    expect(reviewMeta({ country: "", trekName: "Langtang Valley Trek" })).toBe("Langtang Valley Trek");
    expect(reviewMeta({ country: "", trekName: undefined })).toBe("");
  });
});
