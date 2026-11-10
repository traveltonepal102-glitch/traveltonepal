import { describe, expect, it } from "vitest";

import type { TrekUsageItem } from "../types";
import { toTrekBlockers } from "./trekBlockers";

const ID = "0f0e3b5c-1d2a-4c3b-9a8e-7f6d5c4b3a21";

describe("toTrekBlockers", () => {
  it("is empty when nothing uses the trek", () => {
    expect(toTrekBlockers([])).toEqual([]);
  });

  it("groups by kind in a fixed order, each item linking to where it is fixed", () => {
    const usage: TrekUsageItem[] = [
      { kind: "travel_guide", id: ID, name: "Manaslu permits" },
      { kind: "region", id: ID, name: "Manaslu" },
      { kind: "website", id: "manaslu", name: "Manaslu Trek" },
    ];

    const groups = toTrekBlockers(usage);

    expect(groups.map((group) => group.label)).toEqual(["Main trek of the website", "Regions that feature it", "Travel guides that show it"]);
    expect(groups[0].items).toEqual([{ id: "manaslu", name: "Manaslu Trek", href: "/pages/home" }]);
    expect(groups[1].items[0].href).toBe(`/regions/${ID}`);
    expect(groups[2].items[0].href).toBe(`/travel-guides/${ID}`);
  });
});
