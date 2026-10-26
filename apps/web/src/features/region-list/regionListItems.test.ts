import { describe, expect, it } from "vitest";

import type { RegionCard } from "@/features/regions/regionRows";
import { TREKS } from "@/features/treks/treks";
import type { TrekSummary } from "@/features/treks/types";

import { regionListItems, trekCountLabel } from "./regionListItems";
import { regionsDescription } from "./seo";

const card = (slug: string, overrides: Partial<RegionCard> = {}): RegionCard => ({
  slug,
  name: slug,
  maxAltitudeM: 5000,
  district: "",
  location: { lat: 28.21, lon: 85.56 },
  trekLength: "",
  difficulty: "Moderate",
  access: { short: "", long: "", isFlight: false },
  permits: "",
  bestFor: "",
  bestForTags: [],
  summary: "",
  months: Array.from({ length: 12 }, () => "possible" as const),
  hasPage: false,
  ...overrides,
});

const trek = (slug: string, overrides: Partial<TrekSummary> = {}): TrekSummary => {
  const summary = TREKS.find((item) => item.slug === slug);
  if (!summary) throw new Error(`No trek ${slug}`);
  return { ...summary, ...overrides };
};

describe("regionListItems", () => {
  const items = regionListItems(
    [card("annapurna"), card("langtang", { name: "Langtang", hasPage: true }), card("everest")],
    [trek("langtang-valley", { regionSlug: "langtang" }), trek("everest-base-camp", { regionSlug: "everest", name: "Everest Base Camp", hasPage: false })],
  );
  const [annapurna, langtang, everest] = items;

  it("numbers the regions in the order given (west to east)", () => {
    expect(items.map((item) => [item.slug, item.number])).toEqual([["annapurna", 1], ["langtang", 2], ["everest", 3]]);
  });

  it("links a region with a page to it, and others to their treks", () => {
    expect(langtang).toMatchObject({ hasPage: true, href: "/regions/langtang", treksHref: "/treks?region=langtang" });
    expect(everest).toMatchObject({ hasPage: false, href: "/treks?region=everest" });
  });

  it("lists only the published treks given, each to its page or to WhatsApp while it has none", () => {
    expect(langtang.treks).toEqual([expect.objectContaining({ name: "Langtang Valley Trek", days: 10, isInquiry: false, href: "/treks/langtang-valley" })]);
    expect(everest.treks).toEqual([expect.objectContaining({ name: "Everest Base Camp", isInquiry: true })]);
    expect(everest.treks[0].href).toMatch(/^https:\/\/wa\.me\//);
    expect(annapurna.treks).toEqual([]);
  });

  it("asks on WhatsApp for a region with no page and no published trek (its treks list would be empty)", () => {
    expect(items.map((item) => [item.slug, item.isAskOnly])).toEqual([["annapurna", true], ["langtang", false], ["everest", false]]);
    expect(annapurna.inquiryUrl).toMatch(/^https:\/\/wa\.me\//);
  });

  it("embeds a keyless Google terrain map centred on the region", () => {
    const url = new URL(langtang.mapEmbedUrl);
    expect(url.origin).toBe("https://maps.google.com");
    expect(Object.fromEntries(url.searchParams)).toEqual({ q: "28.21,85.56", z: "9", t: "p", output: "embed" });
  });

  it("shows nothing for no regions", () => {
    expect(regionListItems([], [trek("langtang-valley")])).toEqual([]);
  });

  it("counts treks", () => {
    expect(trekCountLabel(0)).toBe("0 treks");
    expect(trekCountLabel(1)).toBe("1 trek");
    expect(trekCountLabel(3)).toBe("3 treks");
  });
});

describe("regionsDescription", () => {
  it("counts the regions, and leaves the count out for fewer than two", () => {
    expect(regionsDescription(9)).toMatch(/^Compare Nepal's 9 trekking regions on one map:/);
    expect(regionsDescription(1)).toMatch(/^Compare Nepal's trekking regions on one map:/);
  });
});
