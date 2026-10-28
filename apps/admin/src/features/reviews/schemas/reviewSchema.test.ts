import { describe, expect, it } from "vitest";

import { readRatingsForm, reviewSchema } from "./reviewSchema";

const FORM = {
  source: "google",
  url: "https://maps.app.goo.gl/AbC123",
  reviewerName: " Anna Schmidt ",
  reviewerCountry: "",
  rating: "5",
  title: "",
  quote: "Best trek of our lives.",
  reviewedOn: "2026-10-01",
  trekId: "",
  isShown: "on",
};

const formData = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};

describe("reviewSchema", () => {
  it("accepts a pasted Google review about the company", () => {
    expect(reviewSchema.parse(FORM)).toEqual({ ...FORM, reviewerName: "Anna Schmidt", rating: 5, trekId: null, isShown: true });
  });

  it("needs the review's own secure link, its text and its stars", () => {
    expect(reviewSchema.safeParse({ ...FORM, url: "" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...FORM, url: "http://maps.app.goo.gl/AbC123" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...FORM, quote: "   " }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...FORM, rating: "6" }).success).toBe(false);
  });

  it("refuses a date in the future or that doesn't exist", () => {
    expect(reviewSchema.safeParse({ ...FORM, reviewedOn: "2999-01-01" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...FORM, reviewedOn: "2026-02-30" }).success).toBe(false);
  });

  it("keeps a review hidden when the switch is off", () => {
    expect(reviewSchema.parse({ ...FORM, isShown: "" }).isShown).toBe(false);
  });
});

describe("readRatingsForm", () => {
  it("reads a rating with its count, and leaves out a site with neither", () => {
    expect(readRatingsForm(formData({ googleRating: "4,9", googleCount: "1,234", tripadvisorRating: "", tripadvisorCount: "" }))).toEqual({
      ok: true,
      ratings: [{ source: "google", rating: 4.9, reviewCount: 1234 }],
    });
  });

  it("asks for both numbers, and for a real rating", () => {
    const result = readRatingsForm(formData({ googleRating: "4.9", googleCount: "", tripadvisorRating: "4.95", tripadvisorCount: "3" }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(["googleCount", "tripadvisorRating"]);
  });
});
