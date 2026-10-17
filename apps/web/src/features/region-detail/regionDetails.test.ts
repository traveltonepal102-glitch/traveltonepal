import { describe, expect, it } from "vitest";

import { getGuides } from "@/features/team/guides";
import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { TREKS } from "@/features/treks/treks";

import { KATHMANDU, projectToMap } from "./nepalMap";
import { REGION_DETAIL_SLUGS, getRegionDetail, regionDaysLabel, regionsToCompare } from "./regionDetails";
import { regionJsonLd } from "./seo";
import type { RegionDetail } from "./types";

describe("getRegionDetail", () => {
  it("joins the region summary and page content", () => {
    const region = getRegionDetail("langtang");
    expect(region?.name).toBe("Langtang");
    expect(region?.maxAltitudeM).toBe(4984);
    expect(region?.district).toBe("Rasuwa, Nepal");
  });

  it("returns undefined for a region without a page", () => {
    expect(getRegionDetail("everest")).toBeUndefined();
    expect(getRegionDetail("atlantis")).toBeUndefined();
  });

  it("has valid content for every region page", () => {
    for (const slug of REGION_DETAIL_SLUGS) {
      const region = getRegionDetail(slug) as RegionDetail;
      expect(region, slug).toBeDefined();
      expect(region.months, slug).toHaveLength(12);
      expect(hasTrekPage(region.featuredTrek.slug), slug).toBe(true);
      for (const nearby of region.nearbyTreks) expect(TREKS.some((trek) => trek.slug === nearby.slug), nearby.slug).toBe(true);
      expect(getGuides(region.guideIds), slug).toHaveLength(region.guideIds.length);
      expect(regionsToCompare(region.compareWith), slug).toHaveLength(region.compareWith.length);
      expect(region.compareWith, slug).not.toContain(slug);
    }
  });
});

describe("regionDaysLabel", () => {
  it("gives the range of the region's trek lengths", () => {
    expect(regionDaysLabel("annapurna")).toBe("5–16 days");
    expect(regionDaysLabel("langtang")).toBe("10 days");
    expect(regionDaysLabel("atlantis")).toBeUndefined();
  });
});

describe("Nepal map", () => {
  it("places Langtang north of Kathmandu", () => {
    const langtang = projectToMap(85.56, 28.21);
    expect(langtang.y).toBeLessThan(KATHMANDU.y);
    // Same formula as the design: x = (85.32 − 80) × 118 + 20, y = (30.5 − 27.7) × 110 + 20.
    expect(KATHMANDU).toEqual({ x: 648, y: 328 });
  });
});

describe("region JSON-LD", () => {
  it("describes the destination with coordinates and lists the FAQ", () => {
    const region = getRegionDetail("langtang") as RegionDetail;
    const graph = regionJsonLd(region)["@graph"] as Record<string, unknown>[];
    const place = graph.find((node) => node["@type"] === "TouristDestination");
    expect(place?.geo).toEqual({ "@type": "GeoCoordinates", latitude: 28.21, longitude: 85.56 });
    const faq = graph.find((node) => node["@type"] === "FAQPage")?.mainEntity as unknown[];
    expect(faq).toHaveLength(region.faqs.length);
  });
});
