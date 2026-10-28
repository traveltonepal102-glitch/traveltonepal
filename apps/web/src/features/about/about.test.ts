import { describe, expect, it } from "vitest";

import { googleMapsSearchUrl } from "@/lib/googleMaps/links";

import { aboutSectionLinks } from "./sections";

describe("aboutSectionLinks", () => {
  it("starts with the four beliefs, and links to the team only when it is shown", () => {
    expect(aboutSectionLinks({ hasTeam: true }).map((link) => link.id)).toEqual(["why-us", "our-story", "team", "licences", "responsible-travel", "visit-us"]);
    expect(aboutSectionLinks({ hasTeam: false }).map((link) => link.id)).not.toContain("team");
  });
});

describe("googleMapsSearchUrl", () => {
  it("encodes the place", () => {
    expect(googleMapsSearchUrl("Travel To Nepal, Kathmandu")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Travel%20To%20Nepal%2C%20Kathmandu",
    );
  });
});
