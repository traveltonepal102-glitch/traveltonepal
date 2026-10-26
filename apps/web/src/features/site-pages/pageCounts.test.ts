import { describe, expect, it } from "vitest";

import { fillPageCounts } from "./pageCounts";

const counts = { regions: 9, treks: 12 };

describe("fillPageCounts", () => {
  it("writes the count as a word, capitalised at the start of a sentence", () => {
    expect(fillPageCounts("{regions} trekking regions, guides born in the valleys.", counts)).toBe("Nine trekking regions, guides born in the valleys.");
    expect(fillPageCounts("Compare Nepal's {regions} regions. {regions} of them have guides.", counts)).toBe("Compare Nepal's nine regions. Nine of them have guides.");
  });

  it("writes larger counts as digits", () => {
    expect(fillPageCounts("All {treks} treks", counts)).toBe("All 12 treks");
  });

  it("leaves out a zero count, without a double space", () => {
    expect(fillPageCounts("Compare Nepal's {regions} trekking regions", { regions: 0, treks: 0 })).toBe("Compare Nepal's trekking regions");
    expect(fillPageCounts("{regions} trekking regions", { regions: 0, treks: 0 })).toBe("Trekking regions");
  });

  it("keeps text without tokens, and unknown braces, as they are", () => {
    expect(fillPageCounts("Nepal treks {guides}", counts)).toBe("Nepal treks {guides}");
  });
});
