import { describe, expect, it } from "vitest";

import type { Site } from "../types";
import { pickCurrentSite, siteDomain } from "./pickCurrentSite";

const site = (id: string, kind: Site["kind"], url: string | null = null): Site => ({
  id,
  kind,
  regionId: kind === "main" ? null : `region-${id}`,
  name: id,
  url,
  isLive: false,
  position: 1,
});

const SITES = [site("ttn", "main", "https://traveltonepal.com"), site("manaslu", "region")];

describe("pickCurrentSite", () => {
  it("picks the site in the cookie", () => {
    expect(pickCurrentSite(SITES, "manaslu")?.id).toBe("manaslu");
  });

  it("falls back to the main site for no cookie or a site that no longer exists", () => {
    expect(pickCurrentSite(SITES, undefined)?.id).toBe("ttn");
    expect(pickCurrentSite(SITES, "everest")?.id).toBe("ttn");
  });

  it("is null without any site", () => {
    expect(pickCurrentSite([], "ttn")).toBeNull();
  });
});

describe("siteDomain", () => {
  it("shows the host only", () => {
    expect(siteDomain({ url: "https://traveltonepal.com" })).toBe("traveltonepal.com");
    expect(siteDomain({ url: null })).toBeNull();
  });
});
