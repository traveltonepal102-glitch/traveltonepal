import { describe, expect, it } from "vitest";

import type { RegionUsageItem } from "../types";
import { toRegionBlockers } from "./regionBlockers";

const ID = "0f0e3b5c-1d2a-4c3b-9a8e-7f6d5c4b3a21";

describe("toRegionBlockers", () => {
  it("is empty when nothing uses the region", () => {
    expect(toRegionBlockers([])).toEqual([]);
  });

  it("groups by kind in a fixed order, each item linking to where it is edited", () => {
    const usage: RegionUsageItem[] = [
      { kind: "region", id: ID, name: "Everest" },
      { kind: "trekking_guide", id: ID, name: "Pasang Sherpa" },
      { kind: "trek", id: ID, name: "Langtang Valley Trek" },
      { kind: "trek", id: "a1b2c3d4-0000-4000-8000-000000000000", name: "Tamang Heritage Trail" },
    ];

    const groups = toRegionBlockers(usage);

    expect(groups.map((group) => group.label)).toEqual(["Treks in this region", "Trekking guides who lead here", "Regions that compare with it"]);
    expect(groups[0].items).toEqual([
      { id: ID, name: "Langtang Valley Trek", href: `/treks/${ID}` },
      { id: "a1b2c3d4-0000-4000-8000-000000000000", name: "Tamang Heritage Trail", href: "/treks/a1b2c3d4-0000-4000-8000-000000000000" },
    ]);
    expect(groups[1].items[0].href).toBe(`/trekking-guides?guide=${ID}`);
    expect(groups[2].items[0].href).toBe(`/regions/${ID}`);
  });

  it("links a travel guide to its editor", () => {
    const [group] = toRegionBlockers([{ kind: "travel_guide", id: ID, name: "Best time to trek Langtang" }]);
    expect(group.label).toBe("Travel guides about this region");
    expect(group.items[0].href).toMatch(new RegExp(`/${ID}$`));
  });
});
