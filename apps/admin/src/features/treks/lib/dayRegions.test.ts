import { describe, expect, it } from "vitest";

import { dayRegionIds } from "./dayRegions";

describe("dayRegionIds", () => {
  it("keeps the region of the day before until a day picks another on the route (day 1: the main region)", () => {
    expect(dayRegionIds([null, "ganesh", null, "everest", "manaslu"], ["langtang", "ganesh", "manaslu"])).toEqual(["langtang", "ganesh", "ganesh", "ganesh", "manaslu"]);
  });

  it("has no regions without a route", () => {
    expect(dayRegionIds([null, "ganesh"], [])).toEqual([]);
  });
});
