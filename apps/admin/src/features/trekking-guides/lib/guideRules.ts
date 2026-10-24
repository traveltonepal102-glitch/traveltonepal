import type { LicenceStatus, TrekkingGuide, TrekkingGuideValues } from "../types";

/** Whether something valid to the end of `month` ("YYYY-MM", null: no end) still is on `today` ("YYYY-MM-DD" in Nepal). */
export const isValidThrough = (month: string | null, today: string) => !month || month >= today.slice(0, 7);

/**
 * Whether the guide's licence counts as checked: a number, and valid through `today`'s month ("YYYY-MM-DD"
 * in Nepal). A licence without an end month counts as valid.
 */
export const licenceStatus = ({ licenceNumber, licenceValidUntil }: Pick<TrekkingGuideValues, "licenceNumber" | "licenceValidUntil">, today: string): LicenceStatus => {
  if (!licenceNumber.trim()) return "none";
  return isValidThrough(licenceValidUntil, today) ? "valid" : "expired";
};

/** "Briddim, Rasuwa" */
export const homeLine = ({ homeVillage, homeDistrict }: Pick<TrekkingGuideValues, "homeVillage" | "homeDistrict">) =>
  [homeVillage.trim(), homeDistrict.trim()].filter(Boolean).join(", ");

/** "Senior trek leader · 14 yrs" */
export const roleLine = ({ role, yearsGuiding }: Pick<TrekkingGuideValues, "role" | "yearsGuiding">) =>
  yearsGuiding === null ? role : `${role} · ${yearsGuiding} yrs`;

export type GuideFilters = { query: string; regionId: string; language: string };

export const NO_GUIDE_FILTERS: GuideFilters = { query: "", regionId: "", language: "" };

/** The guides matching the search (name, role or home village or district), the region and the language. */
export const filterGuides = (guides: TrekkingGuide[], { query, regionId, language }: GuideFilters) => {
  const words = query.trim().toLowerCase();
  return guides.filter(
    (guide) =>
      (!words || [guide.name, guide.role, guide.homeVillage, guide.homeDistrict].some((text) => text.toLowerCase().includes(words))) &&
      (!regionId || guide.regionIds.includes(regionId)) &&
      (!language || guide.languages.includes(language)),
  );
};

/** Every language the guides speak, A–Z, for the language filter. */
export const spokenLanguages = (guides: TrekkingGuide[]) => [...new Set(guides.flatMap((guide) => guide.languages))].sort((a, b) => a.localeCompare(b));
