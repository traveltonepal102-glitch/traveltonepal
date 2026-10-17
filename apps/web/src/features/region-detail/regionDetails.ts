import { REGIONS } from "@/features/regions/regions";
import type { RegionSummary } from "@/features/regions/regions";
import { TREKS } from "@/features/treks/treks";

import { LANGTANG } from "./content/langtang";
import type { RegionDetail, RegionDetailContent } from "./types";

/** Regions that have a full page so far. Each needs a matching summary in REGIONS (same slug). */
const REGION_DETAIL_CONTENT: readonly RegionDetailContent[] = [LANGTANG];

export const REGION_DETAIL_SLUGS: readonly string[] = REGION_DETAIL_CONTENT.map((content) => content.slug);

/** True when the region has its own page (links go there; others go to its treks instead). */
export const hasRegionPage = (slug: string) => REGION_DETAIL_SLUGS.includes(slug);

/** The summary (menus, tiles) and the page content joined, or undefined when the region has no page. */
export const getRegionDetail = (slug: string): RegionDetail | undefined => {
  const summary = REGIONS.find((region) => region.slug === slug);
  const content = REGION_DETAIL_CONTENT.find((item) => item.slug === slug);
  if (!summary || !content) return undefined;
  return { ...summary, ...content };
};

/** "6–8 days" from the region's treks, or "10 days" when they are all one length; undefined without treks. */
export const regionDaysLabel = (regionSlug: string): string | undefined => {
  const days = TREKS.filter((trek) => trek.regionSlug === regionSlug).map((trek) => trek.days);
  if (days.length === 0) return undefined;
  const [min, max] = [Math.min(...days), Math.max(...days)];
  return min === max ? `${min} days` : `${min}–${max} days`;
};

/** The regions to compare with, in content order; unknown slugs are skipped. */
export const regionsToCompare = (slugs: readonly string[]): RegionSummary[] =>
  slugs.flatMap((slug) => REGIONS.find((region) => region.slug === slug) ?? []);
