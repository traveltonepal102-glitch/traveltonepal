import { describe, expect, it } from "vitest";

import type { GuideSummary } from "@/features/guides/types";
import { popularTreksWithPage } from "@/features/trek-detail/trekDetails";
import { TREKS } from "@/features/treks/treks";
import type { TrekSummary } from "@/features/treks/types";

import { allRegionsLabel, homeGuides, homeRegions, homeTrekFilters, moreRegionsText, regionsHeading } from "./homeContent";

const trek = (slug: string, overrides: Partial<TrekSummary> = {}): TrekSummary => {
  const summary = TREKS.find((item) => item.slug === slug);
  if (!summary) throw new Error(`No trek ${slug}`);
  return { ...summary, ...overrides };
};

const guide = (slug: string): GuideSummary => ({ slug, title: slug, excerpt: "", tag: "Planning", tagIcon: "description", image: { src: "/x.jpg", alt: "" } });

describe("popularTreksWithPage", () => {
  it("lists popular treks that have a page, not drafts of a page that doesn't exist yet", () => {
    const treks = [
      trek("langtang-valley", { isPopular: true }),
      trek("everest-base-camp", { isPopular: true, hasPage: false }),
      trek("tamang-heritage-trail", { isPopular: false }),
    ];
    expect(popularTreksWithPage(treks).map((item) => item.slug)).toEqual(["langtang-valley"]);
  });

  it("leaves out a trek with a page that isn't popular", () => {
    expect(popularTreksWithPage([trek("langtang-valley", { isPopular: false })])).toEqual([]);
  });
});

describe("homeGuides", () => {
  it("shows up to three guides, in the order given (featured first), with or without their page yet", () => {
    const guides = ["featured", "b", "c", "d"].map(guide);
    expect(homeGuides(guides).map((item) => item.slug)).toEqual(["featured", "b", "c"]);
    expect(homeGuides([guide("no-page-yet")]).map((item) => item.slug)).toEqual(["no-page-yet"]);
  });

  it("shows none without guides (the section is then left out)", () => {
    expect(homeGuides([])).toEqual([]);
  });
});

describe("home copy", () => {
  it("counts the regions in words", () => {
    expect(regionsHeading(12)).toBe("12 iconic regions. Each one a different Nepal.");
    expect(regionsHeading(1)).toBe("One iconic region. A different Nepal.");
  });

  it("labels the finder's any-region choice", () => {
    expect(allRegionsLabel(9)).toBe("All 9 regions");
    expect(allRegionsLabel(2)).toBe("All 2 regions");
    expect(allRegionsLabel(1)).toBe("All regions");
    expect(allRegionsLabel(0)).toBe("All regions");
  });
});

describe("homeTrekFilters", () => {
  const keysFor = (treks: TrekSummary[]) => homeTrekFilters(treks).map((filter) => filter.key);

  it("offers only chips that match at least one trek", () => {
    expect(keysFor([trek("langtang-valley", { tags: ["classic"], days: 10 })])).toEqual(["classic"]);
    expect(keysFor([trek("langtang-valley", { tags: [], days: 7 })])).toEqual(["short"]);
    expect(keysFor([trek("langtang-valley", { tags: [], days: 10 })])).toEqual([]);
  });

  it("matches classic, quiet and under-10-day treks", () => {
    const treks = [trek("langtang-valley", { tags: ["classic"], days: 10 }), trek("mardi-himal", { tags: ["off-the-beaten-path"], days: 9 })];
    const filters = homeTrekFilters(treks);
    expect(filters.map((filter) => filter.key)).toEqual(["classic", "quiet", "short"]);
    expect(filters.map((filter) => treks.filter(filter.matches).map((item) => item.slug))).toEqual([["langtang-valley"], ["mardi-himal"], ["mardi-himal"]]);
  });
});

describe("homeRegions and moreRegionsText", () => {
  const regions = ["Everest", "Annapurna", "Manaslu", "Langtang", "Dolpo", "Kanchenjunga", "Makalu", "Mustang", "Nar Phu", "Pikey Peak", "Tamang Heritage Trail", "Rolwaling"];

  it("shows eight regions and keeps the rest for the See more card", () => {
    const { shown, more } = homeRegions(regions);
    expect(shown).toHaveLength(8);
    expect(more).toEqual(["Nar Phu", "Pikey Peak", "Tamang Heritage Trail", "Rolwaling"]);
    expect(homeRegions(regions.slice(0, 5)).more).toEqual([]);
  });

  it("names up to three of the regions not shown", () => {
    expect(moreRegionsText(["Nar Phu", "Pikey Peak", "Tamang Heritage Trail", "Rolwaling"])).toBe("Nar Phu, Pikey Peak, Tamang Heritage Trail and more.");
    expect(moreRegionsText(["Nar Phu", "Pikey Peak", "Tamang Heritage Trail"])).toBe("Nar Phu, Pikey Peak and Tamang Heritage Trail.");
    expect(moreRegionsText(["Nar Phu", "Pikey Peak"])).toBe("Nar Phu and Pikey Peak.");
    expect(moreRegionsText(["Nar Phu"])).toBe("Also Nar Phu.");
    expect(moreRegionsText([])).toBe("");
  });
});
