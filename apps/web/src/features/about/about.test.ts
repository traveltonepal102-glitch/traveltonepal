import { describe, expect, it } from "vitest";

import { googleMapsSearchUrl } from "@/lib/googleMaps/links";
import type { PublishedReviews } from "@/features/reviews/types";

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

const NONE: PublishedReviews = { reviews: [], rating: null };

const SOME: PublishedReviews = {
  reviews: ["a", "b", "c", "d"].map((id) => ({ id, quote: "Great trek.", name: "Anna", country: "", source: "Google", url: `https://maps.app.goo.gl/${id}` })),
  rating: { rating: 4.9, count: 37, source: "Google", url: "https://g.page/traveltonepal" },
};

describe("about reviews", () => {
  it("never shows placeholders in production", () => {
    expect(aboutPageReviews(NONE, false)).toEqual([]);
    expect(aboutPageRating(NONE, false)).toBeNull();
  });

  it("shows the design's placeholders in development while there are no reviews", () => {
    expect(aboutPageReviews(NONE, true)).toHaveLength(3);
  });

  it("shows the newest three chosen reviews and the real rating", () => {
    expect(aboutPageReviews(SOME, false).map((review) => review.id)).toEqual(["a", "b", "c"]);
    expect(aboutPageRating(SOME, false)?.ratingLabel).toBe("4.9");
  });
});

describe("googleMapsSearchUrl", () => {
  it("encodes the place", () => {
    expect(googleMapsSearchUrl("Travel To Nepal, Kathmandu")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Travel%20To%20Nepal%2C%20Kathmandu",
    );
  });
});
