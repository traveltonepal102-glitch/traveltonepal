import { describe, expect, it } from "vitest";

import { KATHMANDU, projectToMap } from "@/features/regions/nepalMap";

import { regionHref } from "./regionDetails";

describe("regionHref", () => {
  it("opens the region's page, or its treks while it has no page", () => {
    expect(regionHref({ slug: "langtang", hasPage: true })).toBe("/regions/langtang");
    expect(regionHref({ slug: "everest", hasPage: false })).toBe("/treks?region=everest");
  });
});

describe("Nepal map", () => {
  it("places Langtang north of Kathmandu", () => {
    const langtang = projectToMap(85.56, 28.21);
    expect(langtang.y).toBeLessThan(KATHMANDU.y);
    // Same formula as the design: x = (85.32 − 80) × 118 + 20, y = (30.5 − 27.7) × 110 + 20.
    expect(KATHMANDU).toEqual({ x: 648, y: 328 });
  });
});
