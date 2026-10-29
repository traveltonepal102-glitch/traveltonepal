import { describe, expect, it } from "vitest";

import type { RegionCard } from "@/features/regions/regionRows";

import { dayRangesLabel, dayRegionSlugs, toRouteStops } from "./routeRegions";

const LANGTANG = { slug: "langtang", name: "Langtang" };
const GANESH = { slug: "ganesh-himal", name: "Ganesh Himal" };
const MANASLU = { slug: "manaslu", name: "Manaslu" };
const ROUTE = [LANGTANG, GANESH, MANASLU];

const card = (slug: string, overrides: Partial<RegionCard> = {}): RegionCard => ({
  slug,
  name: slug,
  maxAltitudeM: 5000,
  tagline: `${slug} tagline`,
  hasPage: true,
  district: "",
  location: { lat: 28, lon: 85 },
  trekLength: "",
  difficulty: "Moderate",
  access: { short: "", long: "", isFlight: false },
  permits: `${slug} permit`,
  bestFor: "",
  bestForTags: [],
  summary: "",
  months: Array.from({ length: 12 }, () => "best" as const),
  ...overrides,
});

describe("dayRegionSlugs", () => {
  it("keeps a day in the region of the day before until a new one is set (day 1: the main region)", () => {
    expect(dayRegionSlugs([null, null, "ganesh-himal", null, "manaslu", "everest"], ROUTE)).toEqual([
      "langtang",
      "langtang",
      "ganesh-himal",
      "ganesh-himal",
      "manaslu",
      "manaslu",
    ]);
  });

  it("guesses nothing when no day has a region, or the trek stays in one region", () => {
    expect(dayRegionSlugs([null, null], ROUTE)).toEqual([]);
    expect(dayRegionSlugs(["langtang"], [LANGTANG])).toEqual([]);
  });
});

describe("dayRangesLabel", () => {
  it("writes runs of days", () => {
    expect(dayRangesLabel([4])).toBe("Day 4");
    expect(dayRangesLabel([1, 2, 3, 9])).toBe("Days 1–3, 9");
  });
});

describe("toRouteStops", () => {
  it("gives each region on the route its place, details, link and days", () => {
    const stops = toRouteStops(ROUTE, [card("langtang"), card("manaslu", { hasPage: false })], ["langtang", "langtang", "ganesh-himal", "manaslu"]);
    expect(stops.map((stop) => [stop.slug, stop.place, stop.days])).toEqual([
      ["langtang", "start", "Days 1–2"],
      ["ganesh-himal", "through", "Day 3"],
      ["manaslu", "end", "Day 4"],
    ]);
    expect(stops[0]).toMatchObject({ tagline: "langtang tagline", permits: "langtang permit", href: "/regions/langtang" });
    // Without its own card (no map pin yet): just its name, linking to its treks.
    expect(stops[1]).toMatchObject({ name: "Ganesh Himal", permits: "", href: "/treks?region=ganesh-himal" });
    expect(stops[2].href).toBe("/treks?region=manaslu");
  });

  it("has no stops for a trek in one region, and no days when the days have no regions", () => {
    expect(toRouteStops([LANGTANG], [card("langtang")], [])).toEqual([]);
    expect(toRouteStops(ROUTE, [], []).every((stop) => stop.days === undefined)).toBe(true);
  });
});
