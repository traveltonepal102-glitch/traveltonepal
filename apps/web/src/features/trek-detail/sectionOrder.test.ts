import { TREK_PAGE_SECTIONS, isFullWidthTrekSection, orderTrekSections } from "@ttn/config/trekPageSections";
import { describe, expect, it } from "vitest";

import { fullWidthGroups, trekSectionLinks } from "./sections";

describe("orderTrekSections", () => {
  it("gives the default order when none is saved", () => {
    expect(orderTrekSections([])).toEqual(TREK_PAGE_SECTIONS);
  });

  it("keeps a saved order", () => {
    const main = TREK_PAGE_SECTIONS.filter((section) => !isFullWidthTrekSection(section)).reverse();
    const fullWidth = TREK_PAGE_SECTIONS.filter(isFullWidthTrekSection).reverse();
    expect(orderTrekSections([...main, ...fullWidth])).toEqual([...main, ...fullWidth]);
  });

  it("puts the full-width sections after the others", () => {
    const order = orderTrekSections(["faq", "intro"]);
    expect(order[0]).toBe("intro");
    expect(order.indexOf("faq")).toBe(order.length - 4);
  });

  it("drops unknown and repeated keys", () => {
    const order = orderTrekSections(["reviews", "nope", "reviews", ...TREK_PAGE_SECTIONS]);
    expect(order[0]).toBe("reviews");
    expect(order).toHaveLength(TREK_PAGE_SECTIONS.length);
  });

  it("puts a missing section back after the one it follows by default", () => {
    const saved = TREK_PAGE_SECTIONS.filter((section) => section !== "why_book" && section !== "intro");
    // The admin moved the route map to the top; why_book follows it there, and intro (first by default) leads.
    const moved = ["route_map", ...saved.filter((section) => section !== "route_map")];
    const order = orderTrekSections(moved);
    expect(order.slice(0, 4)).toEqual(["intro", "route_map", "why_book", "overview"]);
  });
});

describe("fullWidthGroups", () => {
  it("lets similar treks and the newsletter share a band when next to each other", () => {
    expect(fullWidthGroups(orderTrekSections([]))).toEqual([["faq"], ["booking_cta"], ["similar", "newsletter"]]);
  });

  it("gives each its own band when apart", () => {
    const order = orderTrekSections(["similar", "faq", "newsletter", "booking_cta"]);
    expect(fullWidthGroups(order)).toEqual([["similar"], ["faq"], ["newsletter"], ["booking_cta"]]);
  });
});

describe("trekSectionLinks", () => {
  it("follows the page's order", () => {
    const order = orderTrekSections(["faq", "packing", "pricing", "route_map", "inclusions", "itinerary"]);
    const ids = trekSectionLinks({ hasReviews: false, order }).map((link) => link.id);
    expect(ids).toEqual(["useful-info", "route-map", "inclusions", "itinerary", "faq"]);
  });

  it("leaves out the sections hidden on every trek page", () => {
    const ids = trekSectionLinks({ hasReviews: true, order: orderTrekSections([]) }).map((link) => link.id);
    expect(ids).not.toContain("pricing");
  });

  it("links to the reviews only when the page shows them", () => {
    const order = orderTrekSections([]);
    expect(trekSectionLinks({ hasReviews: true, order }).some((link) => link.id === "reviews")).toBe(true);
    expect(trekSectionLinks({ hasReviews: false, order }).some((link) => link.id === "reviews")).toBe(false);
  });
});
