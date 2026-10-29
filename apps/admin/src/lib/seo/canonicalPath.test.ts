import { describe, expect, it } from "vitest";

import { canonicalPathField } from "./canonicalPath";

const parse = (value: string) => canonicalPathField.safeParse(value);

describe("canonicalPathField", () => {
  it("keeps an empty field empty: the page is its own main version", () => {
    expect(parse("  ").data).toBe("");
  });

  it("takes a path on this website, tidied up", () => {
    expect(parse("/treks/everest-base-camp").data).toBe("/treks/everest-base-camp");
    expect(parse(" /Treks/Everest-Base-Camp/ ").data).toBe("/treks/everest-base-camp");
    expect(parse("/").data).toBe("/");
  });

  it("refuses a full address, so a page never points at another website", () => {
    for (const value of ["https://www.acethehimalaya.com/trip/everest-base-camp-trek/", "http://traveltonepal.com/treks", "www.traveltonepal.com/treks"]) {
      expect(parse(value).error?.issues[0].message).toMatch(/part after the domain/);
    }
  });

  it("refuses what isn't a page address", () => {
    for (const value of ["treks/everest", "/treks//everest", "/treks?ref=1", "/treks/everest base camp", `/${"a".repeat(200)}`]) {
      expect(parse(value).success).toBe(false);
    }
  });
});
