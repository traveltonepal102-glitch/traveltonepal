import { describe, expect, it } from "vitest";

import { siteInitials } from "./siteInitials";

describe("siteInitials", () => {
  it.each([
    ["Travel To Nepal", "TTN"],
    ["Manaslu Trek", "MT"],
    ["mardi trekking", "MT"],
    ["Everest", "EV"],
    ["Annapurna Base Camp Treks", "ABC"],
    ["Langtang-Valley Trek", "LVT"],
    ["  ", "?"],
  ])("%j → %j", (name, initials) => {
    expect(siteInitials(name)).toBe(initials);
  });
});
