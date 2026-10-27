import { describe, expect, it } from "vitest";

import { defaultGroupIndex } from "./pricing";
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
