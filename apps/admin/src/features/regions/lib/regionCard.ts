import { formatBestMonths } from "@ttn/ui/lib/bestMonths";

import type { Photo } from "@/features/photos/types";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { Region } from "../types";
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
  basics: "Top of the page",
  facts: "Key facts",
  about: "About",
  where: "Where it is",
  treks: "Treks",
  months: "Best time",
  guides: "Guides",
  photos: "Photos",
  articles: "Travel guides",
  faq: "Questions",
  compare: "Other regions",
  seo: "Google",
};
const SECTION_KEYS: ReadySectionKey[] = ["basics", "facts", "about", "where", "treks", "months", "guides", "photos", "articles", "faq", "compare", "seo"];

export const toRegionCardItem = (region: Region): RegionCardItem => {
  const readiness = getRegionReadiness(region, region.photos, region.leadingGuideIds, region.articleIds);
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
