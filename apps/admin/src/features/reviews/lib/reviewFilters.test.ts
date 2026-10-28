import { describe, expect, it } from "vitest";

import { EMPTY_REVIEW_VALUES } from "../constants";
import type { Review } from "../types";
import { COMPANY_FILTER, NO_REVIEW_FILTERS, filterReviews, reviewTopic } from "./reviewFilters";

const TREK_ID = "11111111-1111-4111-8111-111111111111";

const review = (id: string, overrides: Partial<Review> = {}): Review => ({
  ...EMPTY_REVIEW_VALUES,
  id,
  updatedAt: "2026-10-27T00:00:00Z",
  photo: null,
  url: `https://maps.app.goo.gl/${id}`,
  reviewerName: "Anna",
  quote: "Great guide and teahouses.",
  reviewedOn: "2026-10-01",
  ...overrides,
});

const REVIEWS = [review("a", { trekId: TREK_ID }), review("b", { isShown: false, reviewerName: "Ben", quote: "Lovely food." }), review("c")];

const ids = (reviews: Review[]) => reviews.map((item) => item.id);

describe("filterReviews", () => {
  it("keeps everything without filters", () => {
    expect(ids(filterReviews(REVIEWS, NO_REVIEW_FILTERS))).toEqual(["a", "b", "c"]);
  });

  it("filters by shown or hidden", () => {
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, visibility: "hidden" }))).toEqual(["b"]);
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, visibility: "shown" }))).toEqual(["a", "c"]);
  });

  it("filters by trek, or reviews about the company", () => {
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, trek: TREK_ID }))).toEqual(["a"]);
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, trek: COMPANY_FILTER }))).toEqual(["b", "c"]);
  });

  it("searches the name and the text, ignoring case", () => {
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, query: "FOOD" }))).toEqual(["b"]);
    expect(ids(filterReviews(REVIEWS, { ...NO_REVIEW_FILTERS, query: "ben" }))).toEqual(["b"]);
  });
});

describe("reviewTopic", () => {
  it("names the trek, the company, or a trek that was removed", () => {
    expect(reviewTopic({ trekId: TREK_ID }, [{ id: TREK_ID, name: "Langtang Valley Trek" }])).toBe("Langtang Valley Trek");
    expect(reviewTopic({ trekId: null }, [])).toBe("About the company");
    expect(reviewTopic({ trekId: TREK_ID }, [])).toBe("A removed trek");
  });
});
