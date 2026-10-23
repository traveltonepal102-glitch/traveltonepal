import type { Photo } from "@/features/photos/types";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { Region } from "../types";
import { formatBestMonths } from "./bestMonths";
import type { ReadySectionKey } from "./readiness";
import { getRegionReadiness } from "./readiness";

/** What a card on the Regions list shows. */
export type RegionCardItem = {
  id: string;
  name: string;
  district: string;
  websiteDomain: string | null;
  cover: Photo | null;
  monthRatings: MonthRating[];
  bestMonths: string;
  doneCount: number;
  sectionCount: number;
  /** The first thing still missing, e.g. "Questions: Only 2 questions". */
  nextStep?: string;
};

/** In the editor's order, with the short names the cards use. */
const SECTION_NAMES: Record<ReadySectionKey, string> = {
  basics: "Basics",
  photos: "Photos",
  facts: "Facts",
  months: "Months",
  treks: "Treks",
  guides: "Guides",
  faq: "Questions",
  seo: "Google",
};
const SECTION_KEYS: ReadySectionKey[] = ["basics", "photos", "facts", "months", "treks", "guides", "faq", "seo"];

export const toRegionCardItem = (region: Region): RegionCardItem => {
  const readiness = getRegionReadiness(region, region.photos, region.leadingGuideIds);
  const openKeys = SECTION_KEYS.filter((key) => readiness[key].status !== "done");
  const next = openKeys[0];

  return {
    id: region.id,
    name: region.name,
    district: region.district,
    websiteDomain: region.websiteDomain,
    cover: region.photos.cover,
    monthRatings: region.monthRatings,
    bestMonths: formatBestMonths(region.monthRatings),
    doneCount: SECTION_KEYS.length - openKeys.length,
    sectionCount: SECTION_KEYS.length,
    nextStep: next && `${SECTION_NAMES[next]}: ${readiness[next].note}`,
  };
};
