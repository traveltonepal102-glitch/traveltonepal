import { describe, expect, it } from "vitest";

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
});
