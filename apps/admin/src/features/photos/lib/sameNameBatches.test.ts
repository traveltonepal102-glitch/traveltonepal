import { describe, expect, it } from "vitest";

import { sameNameBatches } from "./sameNameBatches";

describe("sameNameBatches", () => {
  it("looks each name up once, trimmed, ignoring letter case", () => {
    expect(sameNameBatches(["a.jpg", " A.JPG ", "b.jpg"])).toEqual([["a.jpg", "b.jpg"]]);
  });

  it("leaves out empty names, and asks nothing for none", () => {
    expect(sameNameBatches(["", "  "])).toEqual([]);
    expect(sameNameBatches([])).toEqual([]);
  });

  it("splits a big upload into goes of the batch size", () => {
    const names = Array.from({ length: 5 }, (_, index) => `${index}.jpg`);
    expect(sameNameBatches(names, 2)).toEqual([["0.jpg", "1.jpg"], ["2.jpg", "3.jpg"], ["4.jpg"]]);
  });
});
