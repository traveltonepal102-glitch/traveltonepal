import { describe, expect, it } from "vitest";

import { groupIndexFor, groupRanges, nextGroupTip, travellersText } from "./groupSizes";

const prices = [
  { label: "1 person", priceUsd: 1590 },
  { label: "2 people", priceUsd: 1420 },
  { label: "3–5 people", priceUsd: 1280 },
  { label: "6-10 people", priceUsd: 1190 },
  { label: "11+ people", priceUsd: 1110 },
];
const ranges = groupRanges(prices);

describe("group sizes", () => {
  it("reads how many travellers each price is for from its label", () => {
    expect(ranges).toEqual([{ min: 1, max: 1 }, { min: 2, max: 2 }, { min: 3, max: 5 }, { min: 6, max: 10 }, { min: 11, max: 20 }]);
  });

  it("reads the other ways a group size gets typed", () => {
    expect(groupRanges([{ label: "2 to 4 people" }])).toEqual([{ min: 2, max: 4 }]);
    expect(groupRanges([{ label: "Up to 4" }, { label: "5+" }])).toEqual([{ min: 1, max: 4 }, { min: 5, max: 20 }]);
  });

  it("says nothing when the next group isn't cheaper", () => {
    expect(nextGroupTip(groupRanges([{ label: "1 person" }, { label: "2 people" }]), [{ priceUsd: 900 }, { priceUsd: 900 }], 1)).toBeNull();
  });

  it("follows the group before when a label has no number", () => {
    expect(groupRanges([{ label: "2 people" }, { label: "A bigger group" }])).toEqual([{ min: 2, max: 2 }, { min: 3, max: 3 }]);
  });

  it("finds the price for a number of travellers, and the last one beyond them all", () => {
    expect(groupIndexFor(ranges, 4)).toBe(2);
    expect(groupIndexFor(ranges, 11)).toBe(4);
    expect(groupIndexFor(ranges, 40)).toBe(4);
  });

  it("never quotes a cheaper group when the labels leave a gap or start higher", () => {
    expect(groupIndexFor(groupRanges([{ label: "1 person" }, { label: "2 people" }, { label: "6–10 people" }]), 3)).toBe(1);
    expect(groupIndexFor(groupRanges([{ label: "2 people" }, { label: "3–5 people" }]), 1)).toBe(0);
  });

  it("says how many more bring the price down, and nothing in the last group", () => {
    expect(nextGroupTip(ranges, prices, 4)).toEqual({ more: 2, priceUsd: 1190 });
    expect(nextGroupTip(ranges, prices, 12)).toBeNull();
  });

  it("counts travellers in words", () => {
    expect(travellersText(1)).toBe("1 traveller");
    expect(travellersText(3)).toBe("3 travellers");
  });
});
