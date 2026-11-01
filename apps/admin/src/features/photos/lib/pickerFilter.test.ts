import { describe, expect, it } from "vitest";

import { filterValue, parseFilterValue, searchKey } from "./pickerFilter";

const ID = "1b671a64-40d5-491e-99b0-da01ff1f3341";

describe("filterValue / parseFilterValue", () => {
  it("round-trips every filter", () => {
    for (const filter of [{ kind: "all" }, { kind: "trek", id: ID }, { kind: "region", id: ID }] as const) {
      expect(parseFilterValue(filterValue(filter))).toEqual(filter);
    }
  });

  it("shows all photos for anything it doesn't know", () => {
    expect(parseFilterValue("")).toEqual({ kind: "all" });
    expect(parseFilterValue("region:")).toEqual({ kind: "all" });
    expect(parseFilterValue("author:abc")).toEqual({ kind: "all" });
  });
});

describe("searchKey", () => {
  it("is the same for the same search, whatever the spaces or letter case", () => {
    expect(searchKey(" Langtang ", { kind: "all" })).toBe(searchKey("langtang", { kind: "all" }));
  });

  it("differs when the words or the filter differ", () => {
    expect(searchKey("langtang", { kind: "all" })).not.toBe(searchKey("langtang", { kind: "region", id: ID }));
    expect(searchKey("langtang", { kind: "all" })).not.toBe(searchKey("manaslu", { kind: "all" }));
  });
});
