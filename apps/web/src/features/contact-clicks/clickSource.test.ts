import { describe, expect, it } from "vitest";

import { clickPagePath, isPrefetch } from "./clickSource";

const SITE = "https://www.traveltonepal.com";

describe("clickPagePath", () => {
  it("keeps only the path of one of our own pages", () => {
    expect(clickPagePath(`${SITE}/treks/langtang-valley?start=2027-04-02#book`, SITE)).toBe("/treks/langtang-valley");
    expect(clickPagePath(`${SITE}/`, SITE)).toBe("/");
  });

  it("is empty without a referer, for another site or a broken value", () => {
    expect(clickPagePath(null, SITE)).toBe("");
    expect(clickPagePath("https://evil.example/treks", SITE)).toBe("");
    expect(clickPagePath("not a url", SITE)).toBe("");
  });

  it("cuts a very long path", () => {
    expect(clickPagePath(`${SITE}/${"a".repeat(300)}`, SITE)).toHaveLength(200);
  });
});

describe("isPrefetch", () => {
  it("knows the browser's and Next's prefetches from a click", () => {
    expect(isPrefetch(new Headers({ "next-router-prefetch": "1" }))).toBe(true);
    expect(isPrefetch(new Headers({ "sec-purpose": "prefetch;prerender" }))).toBe(true);
    expect(isPrefetch(new Headers({ purpose: "prefetch" }))).toBe(true);
    expect(isPrefetch(new Headers({ rsc: "1" }))).toBe(false);
  });
});
