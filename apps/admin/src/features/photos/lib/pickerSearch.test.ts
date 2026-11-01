import { describe, expect, it } from "vitest";

import { PICKER_PAGE_SIZE, PICKER_QUERY_MAX, pickerSearchSchema, toPage, usageLabel } from "./pickerSearch";

const REGION_ID = "1b671a64-40d5-491e-99b0-da01ff1f3341";

describe("pickerSearchSchema", () => {
  it("reads a search with the words trimmed", () => {
    const search = pickerSearchSchema.parse({ query: "  Kyanjin Gompa ", filter: { kind: "all" }, offset: 0 });
    expect(search).toEqual({ query: "Kyanjin Gompa", filter: { kind: "all" }, offset: 0 });
  });

  it("reads a region or trek filter by id", () => {
    expect(pickerSearchSchema.parse({ query: "", filter: { kind: "region", id: REGION_ID }, offset: 40 }).filter).toEqual({ kind: "region", id: REGION_ID });
    expect(pickerSearchSchema.parse({ query: "", filter: { kind: "trek", id: REGION_ID }, offset: 0 }).filter.kind).toBe("trek");
  });

  it("refuses a filter that isn't an id, an unknown filter and a filter id on 'all'", () => {
    expect(pickerSearchSchema.safeParse({ query: "", filter: { kind: "region", id: "langtang" }, offset: 0 }).success).toBe(false);
    expect(pickerSearchSchema.safeParse({ query: "", filter: { kind: "author", id: REGION_ID }, offset: 0 }).success).toBe(false);
    expect(pickerSearchSchema.parse({ query: "", filter: { kind: "all", id: REGION_ID }, offset: 0 }).filter).toEqual({ kind: "all" });
  });

  it("refuses words that are too long", () => {
    const result = pickerSearchSchema.safeParse({ query: "a".repeat(PICKER_QUERY_MAX + 1), filter: { kind: "all" }, offset: 0 });
    expect(result.success).toBe(false);
  });

  it("refuses a negative, broken or runaway offset", () => {
    for (const offset of [-1, 1.5, Number.NaN, 1_000_000]) {
      expect(pickerSearchSchema.safeParse({ query: "", filter: { kind: "all" }, offset }).success).toBe(false);
    }
  });
});

describe("toPage", () => {
  it("says there are more when the extra row came back, and leaves it out", () => {
    const rows = Array.from({ length: PICKER_PAGE_SIZE + 1 }, (_, index) => index);
    const page = toPage(rows);
    expect(page.rows).toHaveLength(PICKER_PAGE_SIZE);
    expect(page.hasMore).toBe(true);
  });

  it("says there are no more for a full or short last page", () => {
    expect(toPage([1, 2, 3], 3)).toEqual({ rows: [1, 2, 3], hasMore: false });
    expect(toPage([], 3)).toEqual({ rows: [], hasMore: false });
  });
});

describe("usageLabel", () => {
  it("words the badge for none, one and several uses", () => {
    expect(usageLabel(0)).toBe("Not used yet");
    expect(usageLabel(1)).toBe("Used in 1 place");
    expect(usageLabel(4)).toBe("Used in 4 places");
  });
});
