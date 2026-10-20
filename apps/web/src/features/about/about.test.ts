import { describe, expect, it } from "vitest";

import { googleMapsSearchUrl } from "@/lib/googleMaps/links";
import { REVIEWS } from "@/features/reviews/reviews";

import { aboutPageRating, aboutPageReviews } from "./reviews";
import { aboutSectionLinks } from "./sections";
import { aboutTeam } from "./team";

describe("aboutSectionLinks", () => {
  it("lists Reviews only when the page shows them", () => {
    expect(aboutSectionLinks({ hasReviews: true }).map((link) => link.id)).toContain("reviews");
    expect(aboutSectionLinks({ hasReviews: false }).map((link) => link.id)).not.toContain("reviews");
  });
});

describe("aboutTeam", () => {
  it("puts the office team first, then the guides, with unique ids", () => {
    const team = aboutTeam();
    const groups = team.map((member) => member.group);
    expect(groups.indexOf("guides")).toBeGreaterThan(groups.lastIndexOf("office"));
    expect(new Set(team.map((member) => member.id)).size).toBe(team.length);
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
