import { describe, expect, it } from "vitest";

import {
  EMPTY_TREK_FILTERS,
  activeFilterCount,
  countForOption,
  filterAndSortTreks,
  matchesLength,
  parseTrekFilters,
  serializeTrekFilters,
  toggleValue,
} from "./filtering";
import type { TrekFilters } from "./filtering";
import { TREKS } from "./treks";

const REGION_SLUGS = ["everest", "annapurna", "langtang", "manaslu"];
const parse = (query: string) => parseTrekFilters(new URLSearchParams(query), REGION_SLUGS);
const names = (filters: Partial<TrekFilters>) =>
  filterAndSortTreks(TREKS, { ...EMPTY_TREK_FILTERS, ...filters }).map((trek) => trek.slug);

describe("parseTrekFilters", () => {
  it("reads lists, the shortcut and the sort", () => {
    expect(parse("region=everest,langtang&length=9&difficulty=easy&show=quiet&sort=price&q= poon ")).toEqual({
      q: "poon",
      regions: ["everest", "langtang"],
      length: "9",
      difficulties: ["easy"],
      seasons: [],
      shortcut: "quiet",
      sort: "price",
    });
  });

  it("drops unknown values instead of filtering everything out", () => {
    expect(parse("region=atlantis&length=forever&difficulty=impossible&show=x&sort=random&fixed=yes")).toEqual(
      EMPTY_TREK_FILTERS,
    );
  });

  it("reads the home finder's links", () => {
    const filters = parse("region=langtang&length=7&season=");
    expect(filters.regions).toEqual(["langtang"]);
    expect(filters.length).toBe("7");
    expect(filters.seasons).toEqual([]);
  });

  it("keeps one length: the first known one", () => {
    expect(parse("length=forever,5,9").length).toBe("5");
    expect(parse("length=short").length).toBeNull();
  });
});

describe("serializeTrekFilters", () => {
  it("round-trips through the URL", () => {
    const query = "q=everest&region=everest&length=16plus&difficulty=challenging&show=high&sort=altitude";
    expect(serializeTrekFilters(parse(query))).toBe(query);
  });

  it("leaves defaults out", () => {
    expect(serializeTrekFilters(EMPTY_TREK_FILTERS)).toBe("");
  });
});

describe("matchesLength", () => {
  it("shows treks up to the chosen number of days", () => {
    expect([1, 3, 4].map((days) => matchesLength(days, "3"))).toEqual([true, true, false]);
    expect([1, 15, 16].map((days) => matchesLength(days, "15"))).toEqual([true, true, false]);
    expect(matchesLength(1, "1")).toBe(true);
    expect(matchesLength(2, "1")).toBe(false);
  });

  it("shows only treks of 16 days or more with 16+", () => {
    expect([15, 16, 22].map((days) => matchesLength(days, "16plus"))).toEqual([false, true, true]);
  });
});

describe("filterAndSortTreks", () => {
  it("shows every trek with no filters", () => {
    expect(names({})).toHaveLength(TREKS.length);
  });

  it("combines filters with AND, and values within one filter with OR", () => {
    expect(names({ regions: ["annapurna", "langtang"], difficulties: ["moderate"] })).toEqual([
      "annapurna-base-camp",
      "langtang-valley",
    ]);
  });

  it("filters by length", () => {
    expect(names({ length: "9" })).toEqual(TREKS.filter((trek) => trek.days <= 9).map((trek) => trek.slug));
    expect(names({ length: "16plus" })).toEqual(TREKS.filter((trek) => trek.days >= 16).map((trek) => trek.slug));
  });

  it("applies the shortcuts", () => {
    expect(names({ shortcut: "short" })).toEqual(["poon-hill", "tamang-heritage-trail", "mardi-himal", "pikey-peak"]);
    expect(names({ shortcut: "high" }).every((slug) => !["poon-hill", "langtang-valley"].includes(slug))).toBe(true);
    expect(names({ shortcut: "popular" })).toEqual(["everest-base-camp", "annapurna-circuit", "annapurna-base-camp", "langtang-valley"]);
  });

  it("searches name, region and summary, ignoring case", () => {
    expect(names({ q: "POON" })).toEqual(["poon-hill"]);
    expect(names({ q: "khumbu" })).toEqual(["everest-base-camp"]);
  });

  it("sorts by price with unpriced treks last", () => {
    const sorted = filterAndSortTreks(TREKS, { ...EMPTY_TREK_FILTERS, sort: "price" });
    const prices = sorted.map((trek) => trek.priceFromUsd);
    expect(prices.slice(0, 4)).toEqual([890, 1000, 1150, 1280]);
    expect(prices.slice(4).every((price) => price === undefined)).toBe(true);
  });

  it("sorts by duration and altitude", () => {
    expect(names({ sort: "duration" })[0]).toBe("poon-hill");
    expect(names({ sort: "altitude" })[0]).toBe("everest-base-camp");
  });
});

describe("countForOption", () => {
  it("counts a region given the other filters, ignoring the region selection itself", () => {
    const filters = { ...EMPTY_TREK_FILTERS, regions: ["everest"], difficulties: ["challenging"] };
    expect(countForOption(TREKS, filters, "regions", "annapurna")).toBe(1);
    expect(countForOption(TREKS, filters, "regions", "everest")).toBe(2);
  });
});

describe("helpers", () => {
  it("counts active filters and toggles values", () => {
    expect(activeFilterCount({ ...EMPTY_TREK_FILTERS, regions: ["a", "b"], q: "x" })).toBe(3);
    expect(activeFilterCount({ ...EMPTY_TREK_FILTERS, length: "5" })).toBe(1);
    expect(toggleValue(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleValue(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("filtering treks across regions", () => {
  const [base] = TREKS;
  const crossing = { ...base, slug: "langtang-to-manaslu", name: "Langtang to Manaslu", region: "Langtang", regionSlug: "langtang", route: [{ slug: "langtang", name: "Langtang" }, { slug: "ganesh-himal", name: "Ganesh Himal" }, { slug: "manaslu", name: "Manaslu" }] };
  const treks = [...TREKS, crossing];

  it("finds a trek through any region on its route, and counts it there", () => {
    expect(filterAndSortTreks(treks, { ...EMPTY_TREK_FILTERS, regions: ["manaslu"] }).map((trek) => trek.slug)).toContain("langtang-to-manaslu");
    expect(filterAndSortTreks(treks, { ...EMPTY_TREK_FILTERS, q: "ganesh" }).map((trek) => trek.slug)).toEqual(["langtang-to-manaslu"]);
    expect(countForOption(treks, EMPTY_TREK_FILTERS, "regions", "manaslu")).toBe(countForOption(TREKS, EMPTY_TREK_FILTERS, "regions", "manaslu") + 1);
  });
});
