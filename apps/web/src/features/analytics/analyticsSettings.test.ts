import { describe, expect, it } from "vitest";

import { analyticsIdsFrom } from "./analyticsSettings";

describe("analyticsIdsFrom", () => {
  it("uses well-formed ids on the live site", () => {
    expect(analyticsIdsFrom({ googleAnalytics: " G-AB12CD34EF ", tagManager: " GTM-WS39JM64 ", clarity: "abc123def4", isProduction: true })).toEqual({
      googleAnalytics: "G-AB12CD34EF",
      tagManager: "GTM-WS39JM64",
      clarity: "abc123def4",
    });
  });

  it("never reports from development", () => {
    expect(analyticsIdsFrom({ googleAnalytics: "G-AB12CD34EF", tagManager: "GTM-WS39JM64", clarity: "abc123def4", isProduction: false })).toEqual({});
  });

  it("leaves out an id that is missing or malformed", () => {
    expect(analyticsIdsFrom({ googleAnalytics: "UA-12345-1", tagManager: "G-AB12CD34EF", clarity: "", isProduction: true })).toEqual({
      googleAnalytics: undefined,
      tagManager: undefined,
      clarity: undefined,
    });
    expect(analyticsIdsFrom({ tagManager: "GTM-AB12\"><script>", isProduction: true }).tagManager).toBeUndefined();
    expect(analyticsIdsFrom({ clarity: "<script>", isProduction: true }).clarity).toBeUndefined();
  });
});
