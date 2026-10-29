import { DIFFICULTIES } from "./difficulty";
import { TREK_LENGTHS, TREK_SEASONS, TREK_SHORTCUTS, TREK_SORTS } from "./filters";
import type { TrekLength, TrekShortcut, TrekSort } from "./filters";
import type { TrekSummary } from "./types";

/** Treks page filter state. The URL is its source of truth (see parse/serialize below). */
export type TrekFilters = {
  q: string;
  regions: readonly string[];
  /** One at a time: "Up to 5 days" already holds the shorter ones. */
  length: TrekLength | null;
  difficulties: readonly string[];
  seasons: readonly string[];
  shortcut: TrekShortcut | null;
  sort: TrekSort;
};

export const EMPTY_TREK_FILTERS: TrekFilters = {
  q: "",
  regions: [],
  length: null,
  difficulties: [],
  seasons: [],
  shortcut: null,
  sort: "recommended",
};

const HIGH_ALTITUDE_M = 5000;
const DIFFICULTY_VALUES = DIFFICULTIES.map((level) => level.value);
const LENGTH_VALUES = TREK_LENGTHS.map((length) => length.value);

const isOneOf = <T extends string>(allowed: readonly T[], value: string): value is T =>
  (allowed as readonly string[]).includes(value);

const readList = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

/** Reads filters from the URL. Unknown values are dropped, so a bad link shows all treks instead of none. */
export const parseTrekFilters = (params: URLSearchParams, regionSlugs: readonly string[]): TrekFilters => {
  const shortcut = params.get("show") ?? "";
  const sort = params.get("sort") ?? "";
  return {
    q: (params.get("q") ?? "").trim(),
    regions: readList(params, "region").filter((value) => regionSlugs.includes(value)),
    length: readList(params, "length").find((value) => isOneOf(LENGTH_VALUES, value)) ?? null,
    difficulties: readList(params, "difficulty").filter((value) => DIFFICULTY_VALUES.includes(value)),
    seasons: readList(params, "season").filter((value) => TREK_SEASONS.some((season) => season.value === value)),
    shortcut: isOneOf(TREK_SHORTCUTS.map((item) => item.value), shortcut) ? shortcut : null,
    sort: isOneOf(TREK_SORTS.map((item) => item.value), sort) ? sort : "recommended",
  };
};

/** Writes filters to a query string; defaults are left out so URLs stay short. */
export const serializeTrekFilters = (filters: TrekFilters): string => {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.regions.length) params.set("region", filters.regions.join(","));
  if (filters.length) params.set("length", filters.length);
  if (filters.difficulties.length) params.set("difficulty", filters.difficulties.join(","));
  if (filters.seasons.length) params.set("season", filters.seasons.join(","));
  if (filters.shortcut) params.set("show", filters.shortcut);
  if (filters.sort !== "recommended") params.set("sort", filters.sort);
  return params.toString();
};

/** Whether a trek of this many days is in the chosen length ("Up to 5 days": 1–5; "16+ days": 16 or more). */
export const matchesLength = (days: number, length: TrekLength) => {
  const option = TREK_LENGTHS.find((item) => item.value === length);
  return option !== undefined && days >= option.minDays && days <= option.maxDays;
};

const difficultyValue = (trek: TrekSummary) => trek.difficulty.toLowerCase();

const matchesShortcut = (trek: TrekSummary, shortcut: TrekShortcut) => {
  switch (shortcut) {
    case "popular":
      return trek.isPopular;
    case "short":
      // "Under 10 days": day hikes too.
      return trek.days < 10;
    case "easy":
      return trek.difficulty === "Easy";
    case "quiet":
      return trek.tags.includes("off-the-beaten-path");
    case "high":
      return trek.maxAltitudeM >= HIGH_ALTITUDE_M;
  }
};

const matchesSearch = (trek: TrekSummary, q: string) => {
  const needle = q.toLowerCase();
  return [trek.name, trek.region, trek.summary].some((text) => text.toLowerCase().includes(needle));
};

/** A sidebar list whose option counts ignore its own selection (so options never count 0 just because another is picked). */
export type CountedDimension = "regions" | "difficulties";

export const matchesTrek = (trek: TrekSummary, filters: TrekFilters, ignore?: CountedDimension): boolean => {
  if (filters.q && !matchesSearch(trek, filters.q)) return false;
  if (ignore !== "regions" && filters.regions.length && !filters.regions.includes(trek.regionSlug)) return false;
  if (filters.length && !matchesLength(trek.days, filters.length)) return false;
  if (ignore !== "difficulties" && filters.difficulties.length && !filters.difficulties.includes(difficultyValue(trek)))
    return false;
  if (filters.seasons.length && !filters.seasons.some((season) => trek.seasons.some((s) => s === season))) return false;
  if (filters.shortcut && !matchesShortcut(trek, filters.shortcut)) return false;
  return true;
};

const COMPARE: Record<Exclude<TrekSort, "recommended">, (a: TrekSummary, b: TrekSummary) => number> = {
  popular: (a, b) => Number(b.isPopular) - Number(a.isPopular),
  // Treks without a price go last.
  price: (a, b) => (a.priceFromUsd ?? Infinity) - (b.priceFromUsd ?? Infinity),
  duration: (a, b) => a.days - b.days,
  altitude: (a, b) => b.maxAltitudeM - a.maxAltitudeM,
};

/** Stable sort: equal treks keep their "Recommended" order. */
export const sortTreks = (treks: readonly TrekSummary[], sort: TrekSort): TrekSummary[] =>
  sort === "recommended" ? [...treks] : [...treks].sort(COMPARE[sort]);

export const filterAndSortTreks = (treks: readonly TrekSummary[], filters: TrekFilters): TrekSummary[] =>
  sortTreks(
    treks.filter((trek) => matchesTrek(trek, filters)),
    filters.sort,
  );

/** How many treks an option would show, given every other active filter. */
export const countForOption = (
  treks: readonly TrekSummary[],
  filters: TrekFilters,
  dimension: CountedDimension,
  value: string,
): number =>
  treks.filter(
    (trek) =>
      matchesTrek(trek, filters, dimension) &&
      (dimension === "regions" ? trek.regionSlug === value : difficultyValue(trek) === value),
  ).length;

/** Number of filters set in the sidebar or search (the shortcut and sort don't count). */
export const activeFilterCount = (filters: TrekFilters): number =>
  filters.regions.length +
  Number(filters.length !== null) +
  filters.difficulties.length +
  filters.seasons.length +
  Number(Boolean(filters.q));

export const toggleValue = <T extends string>(values: readonly T[], value: T): T[] =>
  values.includes(value) ? values.filter((existing) => existing !== value) : [...values, value];
