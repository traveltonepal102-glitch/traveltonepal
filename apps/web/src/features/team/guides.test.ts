import { describe, expect, it } from "vitest";

import { TREK_DETAIL_SLUGS, getTrekDetail } from "@/features/trek-detail/trekDetails";

import { GUIDES, getGuides } from "./guides";

describe("guides", () => {
  it("has unique ids", () => {
    const ids = GUIDES.map((guide) => guide.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("returns guides in the requested order and skips unknown ids", () => {
    expect(getGuides(["safety-lead", "nobody", "senior-trek-leader"]).map((guide) => guide.id)).toEqual([
      "safety-lead",
      "senior-trek-leader",
    ]);
  });

  it("finds every guide a trek page lists", () => {
    for (const slug of TREK_DETAIL_SLUGS) {
      const ids = getTrekDetail(slug)?.guides.guideIds ?? [];
      expect(getGuides(ids), slug).toHaveLength(ids.length);
    }
  });
});
