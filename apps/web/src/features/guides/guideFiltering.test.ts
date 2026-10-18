import { describe, expect, it } from "vitest";

import { filterGuides, guideListHref, parseGuideFilters, serializeGuideFilters } from "./guideFiltering";
import { TRAVEL_GUIDES } from "./travelGuides";

const REGION_SLUGS = ["langtang", "everest"];
const parse = (query: string) => parseGuideFilters(new URLSearchParams(query), REGION_SLUGS);

describe("parseGuideFilters", () => {
  it("reads search, topic, region and page", () => {
    expect(parse("q=%20permits%20&topic=planning&region=langtang&page=2")).toEqual({
      q: "permits",
      topic: "planning",
      region: "langtang",
      page: 2,
    });
  });

  it("drops unknown topics and bad pages", () => {
    expect(parse("topic=food&region=mars&page=abc")).toEqual({ q: "", topic: null, region: null, page: 1 });
    expect(parse("page=-3").page).toBe(1);
    expect(parse("page=1.5").page).toBe(1);
  });
});

describe("serializeGuideFilters", () => {
  it("leaves out defaults and round-trips", () => {
    expect(serializeGuideFilters({ q: "", topic: null, region: null, page: 1 })).toBe("");
    const filters = { q: "altitude sickness", topic: "health" as const, region: "everest", page: 3 };
    expect(parse(serializeGuideFilters(filters))).toEqual(filters);
  });
});

describe("guideListHref", () => {
  it("links to the list section with the filters", () => {
    expect(guideListHref({})).toBe("/travel-guides#all-guides");
    expect(guideListHref({ topic: "gear", page: 2 })).toBe("/travel-guides?topic=gear&page=2#all-guides");
  });
});

describe("filterGuides", () => {
  it("lists every guide newest first without filters", () => {
    const shown = filterGuides(TRAVEL_GUIDES, { q: "", topic: null, region: null });
    expect(shown).toHaveLength(TRAVEL_GUIDES.length);
    expect(shown[0]?.publishedOn >= (shown[1]?.publishedOn ?? "")).toBe(true);
  });

  it("keeps one topic", () => {
    expect(filterGuides(TRAVEL_GUIDES, { q: "", topic: "gear", region: null }).every((guide) => guide.topic === "gear")).toBe(true);
  });

  it("matches every search word in any order, ignoring case", () => {
    const slugs = filterGuides(TRAVEL_GUIDES, { q: "COST langtang", topic: null, region: null }).map((guide) => guide.slug);
    expect(slugs).toEqual(["langtang-valley-trek-cost"]);
  });

  it("finds guides by their topic name", () => {
    expect(filterGuides(TRAVEL_GUIDES, { q: "packing", topic: null, region: null }).length).toBeGreaterThan(0);
  });

  it("keeps guides about a region", () => {
    const slugs = filterGuides(TRAVEL_GUIDES, { q: "", topic: "planning", region: "langtang" }).map((guide) => guide.slug);
    expect(slugs).toEqual(["langtang-valley-trek-cost", "nepal-trekking-permits-by-region"]);
  });

  it("returns nothing when no guide matches", () => {
    expect(filterGuides(TRAVEL_GUIDES, { q: "scuba", topic: null, region: null })).toEqual([]);
  });
});
