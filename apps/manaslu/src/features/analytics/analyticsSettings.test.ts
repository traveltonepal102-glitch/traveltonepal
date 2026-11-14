import { describe, expect, it } from "vitest";

import { tagManagerIdFrom } from "./analyticsSettings";

describe("tagManagerIdFrom", () => {
  it("uses a well-formed id on the live site", () => {
    expect(tagManagerIdFrom({ tagManager: " GTM-AB12CD34 ", isProduction: true })).toBe("GTM-AB12CD34");
  });

  it("never reports from development", () => {
    expect(tagManagerIdFrom({ tagManager: "GTM-AB12CD34", isProduction: false })).toBeUndefined();
  });

  it("leaves out an id that is missing or malformed", () => {
    expect(tagManagerIdFrom({ isProduction: true })).toBeUndefined();
    expect(tagManagerIdFrom({ tagManager: "G-AB12CD34EF", isProduction: true })).toBeUndefined();
    expect(tagManagerIdFrom({ tagManager: 'GTM-AB12"><script>', isProduction: true })).toBeUndefined();
  });
});
