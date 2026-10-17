import { describe, expect, it } from "vitest";

import { defaultGroupIndex, departureOptions } from "./pricing";
import type { GroupPrice } from "./types";

const tier = (label: string, isDefault?: boolean): GroupPrice => ({
  label,
  shortLabel: label,
  priceUsd: 100,
  team: "Guide",
  isDefault,
});

describe("defaultGroupIndex", () => {
  it("picks the group size marked default, else the first", () => {
    expect(defaultGroupIndex([tier("1"), tier("2", true), tier("3")])).toBe(1);
    expect(defaultGroupIndex([tier("1"), tier("2")])).toBe(0);
    expect(defaultGroupIndex([])).toBe(0);
  });
});

describe("departureOptions", () => {
  it("formats the date and prefixes guaranteed departures", () => {
    expect(
      departureOptions([
        { date: "2026-11-02", isGuaranteed: true, note: "4 slots left" },
        { date: "2027-04-12", isGuaranteed: false, note: "Peak season · Open" },
      ]),
    ).toEqual([
      { label: "Nov 02, 2026", note: "Guaranteed · 4 slots left", isGuaranteed: true },
      { label: "Apr 12, 2027", note: "Peak season · Open", isGuaranteed: false },
    ]);
  });
});
