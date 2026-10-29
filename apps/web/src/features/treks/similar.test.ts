import { describe, expect, it } from "vitest";

import { similarTreks } from "./similar";
import type { TrekSummary } from "./types";

const trek = (slug: string, regionSlug: string, days: number, isPopular = false): TrekSummary => ({
  slug,
  name: slug,
  region: regionSlug,
  regionSlug,
  route: [{ slug: regionSlug, name: regionSlug }],
  summary: "",
  days,
  maxAltitudeM: 4000,
  difficulty: "Moderate",
  seasonLabel: "",
  seasons: [],
  tags: [],
  isPopular,
  hasPage: true,
});

const current = trek("langtang", "langtang", 10);
const all = [
  current,
  trek("far-long", "everest", 22),
  trek("popular", "annapurna", 14, true),
  trek("neighbour", "langtang", 7),
  trek("close-length", "manaslu", 10),
];

describe("similarTreks", () => {
  it("never suggests the trek itself and respects the limit", () => {
    const result = similarTreks(current, 3, all);
    expect(result.map((item) => item.slug)).not.toContain("langtang");
    expect(result).toHaveLength(3);
  });

  it("ranks the same region first, then popular treks, then similar lengths", () => {
    expect(similarTreks(current, 4, all).map((item) => item.slug)).toEqual(["neighbour", "popular", "close-length", "far-long"]);
  });
});

describe("similarTreks across regions", () => {
  it("counts a trek passing through the same region as the same region", () => {
    const crossing = { ...trek("langtang-to-manaslu", "langtang", 16), route: [{ slug: "langtang", name: "Langtang" }, { slug: "manaslu", name: "Manaslu" }] };
    const manaslu = trek("manaslu-circuit", "manaslu", 16);
    const everest = trek("everest-base-camp", "everest", 16, true);
    expect(similarTreks(manaslu, 1, [manaslu, everest, crossing]).map((other) => other.slug)).toEqual(["langtang-to-manaslu"]);
  });
});
