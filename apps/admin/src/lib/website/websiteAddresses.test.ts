import { describe, expect, it } from "vitest";

import { parseRegionWebsiteUrls, websiteAddressOf } from "./websiteAddresses";

describe("website addresses", () => {
  it("reads the region overrides", () => {
    expect(parseRegionWebsiteUrls("manaslu=http://localhost:3002,everest=https://everest.example.com")).toEqual({ manaslu: "http://localhost:3002", everest: "https://everest.example.com" });
    expect(parseRegionWebsiteUrls(undefined)).toEqual({});
  });

  it("sends Travel To Nepal to WEBSITE_URL, whatever Sites says", () => {
    expect(websiteAddressOf({ id: "ttn", url: "https://traveltonepal.com" }, "http://localhost:3000", {})).toBe("http://localhost:3000");
    expect(websiteAddressOf({ id: "ttn", url: "https://traveltonepal.com" }, undefined, {})).toBeNull();
  });

  it("sends a region website to its override, else its address, else nowhere", () => {
    expect(websiteAddressOf({ id: "manaslu", url: "https://manaslutrek.com" }, "http://localhost:3000", { manaslu: "http://localhost:3002" })).toBe("http://localhost:3002");
    expect(websiteAddressOf({ id: "manaslu", url: "https://manaslutrek.com" }, "http://localhost:3000", {})).toBe("https://manaslutrek.com");
    expect(websiteAddressOf({ id: "manaslu", url: null }, "http://localhost:3000", {})).toBeNull();
  });
});
