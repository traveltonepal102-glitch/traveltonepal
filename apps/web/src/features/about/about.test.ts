import { describe, expect, it } from "vitest";

import { googleMapsSearchUrl } from "@/lib/googleMaps/links";
import { REVIEWS } from "@/features/reviews/reviews";

import { aboutPageRating, aboutPageReviews } from "./reviews";
import { aboutSectionLinks } from "./sections";

const ALL_SHOWN = { hasReviews: true, hasPromises: true, hasTeam: true };

describe("aboutSectionLinks", () => {
  it("links only to the sections the page shows", () => {
    expect(aboutSectionLinks(ALL_SHOWN).map((link) => link.id)).toEqual(expect.arrayContaining(["reviews", "why-us", "team"]));
    const ids = aboutSectionLinks({ hasReviews: false, hasPromises: false, hasTeam: false }).map((link) => link.id);
    expect(ids).not.toContain("reviews");
    expect(ids).not.toContain("team");
    expect(ids).toContain("our-story");
  });
});

describe("about reviews", () => {
  it("never shows placeholders in production", () => {
    if (REVIEWS.length === 0) expect(aboutPageReviews(false)).toEqual([]);
    expect(aboutPageReviews(false).every((review) => review.url !== "#")).toBe(true);
    expect(aboutPageRating(false)?.ratingLabel ?? "").not.toContain("[");
  });

  it("shows the design's placeholders in development while there are no reviews", () => {
    if (REVIEWS.length === 0) expect(aboutPageReviews(true)).toHaveLength(3);
  });
});

describe("googleMapsSearchUrl", () => {
  it("encodes the place", () => {
    expect(googleMapsSearchUrl("Travel To Nepal, Kathmandu")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Travel%20To%20Nepal%2C%20Kathmandu",
    );
  });
});
