import { describe, expect, it } from "vitest";

import { trekPageJsonLd, trekPageMetadata } from "./seo";
import type { TrekPageData } from "./types";

const data = {
  trek: { slug: "nar-phu", name: "Nar Phu", photos: [], pricing: { prices: [{ priceUsd: 570 }] }, faq: { items: [] } },
  seo: { title: "Nar Phu Trek", description: "Two villages", isLive: true, dates: { published: "2026-10-23", modified: "2026-11-03" } },
  isHidden: false,
} as unknown as TrekPageData;

describe("trekPageMetadata", () => {
  it("uses the trek's own address and exact title", () => {
    const metadata = trekPageMetadata(data);
    expect(metadata.alternates?.canonical).toBe("/nar-phu");
    expect(metadata.title).toEqual({ absolute: "Nar Phu Trek" });
  });

  it("follows the Google card's hide switch and canonical address", () => {
    expect(trekPageMetadata({ ...data, isHidden: true }).robots).toEqual({ index: false, follow: true });
    expect(trekPageMetadata({ ...data, canonicalPath: "/other" }).alternates?.canonical).toBe("/other");
  });
});

describe("trekPageJsonLd", () => {
  it("is this page's trek with its breadcrumb", () => {
    const text = JSON.stringify(trekPageJsonLd(data));
    expect(text).toContain("/nar-phu");
    expect(text).toContain("TouristTrip");
    expect(text).toContain('"BreadcrumbList"');
  });
});
