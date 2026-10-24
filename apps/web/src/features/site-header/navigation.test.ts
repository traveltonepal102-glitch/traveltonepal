import { describe, expect, it } from "vitest";

import type { RegionSummary } from "@/features/regions/regions";
import { TREKS } from "@/features/treks/treks";
import type { TrekSummary } from "@/features/treks/types";

import { regionLinks, trekColumns, treksMenuNote } from "./navigation";

const trek = (slug: string, overrides: Partial<TrekSummary> = {}): TrekSummary => {
  const summary = TREKS.find((item) => item.slug === slug);
  if (!summary) throw new Error(`No trek ${slug}`);
  return { ...summary, ...overrides };
};

const region = (slug: string, overrides: Partial<RegionSummary> = {}): RegionSummary => ({ slug, name: slug, maxAltitudeM: 4984, ...overrides });

describe("trekColumns", () => {
  it("lists popular treks that have a page, with days and price", () => {
    const [popular] = trekColumns([trek("langtang-valley", { isPopular: true, days: 10, priceFromUsd: 890 }), trek("everest-base-camp", { isPopular: true })]);
    expect(popular.title).toBe("Popular treks");
    expect(popular.links).toEqual([{ name: "Langtang Valley Trek", meta: "10 days · from $890", href: "/treks/langtang-valley", icon: "hiking" }]);
  });

  it("shows only the days without a price, and “1 day” for one", () => {
    const [popular] = trekColumns([trek("langtang-valley", { isPopular: true, days: 1, priceFromUsd: undefined })]);
    expect(popular.links[0].meta).toBe("1 day");
  });

  it("leaves out the popular column while there is no popular trek with a page", () => {
    const titles = (treks: TrekSummary[]) => trekColumns(treks).map((column) => column.title);
    expect(titles([])).toEqual(["By length", "By style"]);
    expect(titles([trek("langtang-valley", { isPopular: false }), trek("everest-base-camp", { isPopular: true })])).toEqual(["By length", "By style"]);
  });

  it("lists at most four popular treks", () => {
    const treks = Array.from({ length: 6 }, (_, index) => trek("langtang-valley", { isPopular: true, name: `Trek ${index}` }));
    expect(trekColumns(treks)[0].links).toHaveLength(4);
  });
});

describe("treksMenuNote", () => {
  it("counts the treks and regions", () => {
    expect(treksMenuNote(12, 9)).toBe("12 treks across 9 regions · private treks on your dates");
    expect(treksMenuNote(1, 1)).toBe("1 trek across 1 region · private treks on your dates");
  });

  it("drops the counts when there is nothing to count", () => {
    expect(treksMenuNote(0, 9)).toBe("Private treks on your dates");
    expect(treksMenuNote(3, 0)).toBe("Private treks on your dates");
  });
});

describe("regionLinks", () => {
  it("opens the region's page, or its treks while it has no page yet", () => {
    const links = regionLinks([region("langtang", { name: "Langtang" }), region("everest", { name: "Everest", maxAltitudeM: 5545 })]);
    expect(links).toEqual([
      { name: "Langtang", meta: "Up to 4,984 m", href: "/regions/langtang", image: undefined },
      { name: "Everest", meta: "Up to 5,545 m", href: "/treks?region=everest", image: undefined },
    ]);
  });

  it("keeps the region's photo for its tile", () => {
    const image = { src: "https://photos.example.com/p1", alt: "Langtang", variantWidths: [400] };
    expect(regionLinks([region("langtang", { image })])[0].image).toBe(image);
  });
});
