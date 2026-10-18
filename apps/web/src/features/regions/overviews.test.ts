import { describe, expect, it } from "vitest";

import { monthsFromCode } from "./overviews";

describe("monthsFromCode", () => {
  it("reads one rating per month, ignoring the reading spaces", () => {
    expect(monthsFromCode("ooggg xxx oggo")).toEqual([
      "possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible",
    ]);
  });

  it("fails on a typo instead of showing a wrong month", () => {
    expect(() => monthsFromCode("oogzg xxx oggo")).toThrow('Unknown month code "z"');
  });
});
