import { describe, expect, it } from "vitest";

import { newSiteSchema } from "./newSiteSchema";

const REGION_ID = "4f8c2b1e-6a3d-4c5b-9e7f-1a2b3c4d5e6f";
const VALID = { name: "Manaslu Trek", id: "manaslu", regionId: REGION_ID, url: "" };

describe("newSiteSchema", () => {
  it("accepts a new region site without an address yet", () => {
    expect(newSiteSchema.parse(VALID)).toEqual(VALID);
  });

  it("lowercases the id and the address and drops the address's trailing slash", () => {
    const parsed = newSiteSchema.parse({ ...VALID, id: " Mardi-Himal ", url: "https://MardiTrekking.com/" });
    expect(parsed).toMatchObject({ id: "mardi-himal", url: "https://marditrekking.com" });
  });

  it.each(["m", "manaslu trek", "manaslu--trek", "-manaslu", "manaslu_trek"])("refuses the id %j", (id) => {
    expect(newSiteSchema.safeParse({ ...VALID, id }).success).toBe(false);
  });

  it.each(["http://manaslutrek.com", "https://manaslutrek.com/treks", "manaslutrek.com", "https://localhost"])("refuses the address %j", (url) => {
    expect(newSiteSchema.safeParse({ ...VALID, url }).success).toBe(false);
  });

  it("needs a name and a region", () => {
    const result = newSiteSchema.safeParse({ ...VALID, name: " ", regionId: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0]).sort()).toEqual(["name", "regionId"]);
  });
});
