import { REGION_OVERVIEWS, getRegionOverview } from "@/features/regions/overviews";
import type { RegionOverview } from "@/features/regions/overviews";
import { REGIONS } from "@/features/regions/regions";
import type { RegionSummary } from "@/features/regions/regions";
import { treksFilterPath } from "@/features/treks/filters";
import { regionPath } from "@/lib/routes";

import { LANGTANG } from "./content/langtang";
import type { RegionDetail, RegionDetailContent } from "./types";

/** Regions that have a full page so far. Each needs a summary in REGIONS and an overview (same slug). */
const REGION_DETAIL_CONTENT: readonly RegionDetailContent[] = [LANGTANG];

export const REGION_DETAIL_SLUGS: readonly string[] = REGION_DETAIL_CONTENT.map((content) => content.slug);

/** True when the region has its own page (links go there; others go to its treks instead). */
export const hasRegionPage = (slug: string) => REGION_DETAIL_SLUGS.includes(slug);

/** Where a region link goes: its page, or the Treks page filtered to it while it has no page. */
export const regionHref = (slug: string) => (hasRegionPage(slug) ? regionPath(slug) : treksFilterPath({ region: slug }));

/** A region as cards and tables need it: the summary (name, highest point, photo) and its overview. */
export type RegionCardData = RegionSummary & RegionOverview;

const summaryOf = (slug: string) => REGIONS.find((region) => region.slug === slug);

/** Summary, overview and page content joined, or undefined when the region has no page. */
export const getRegionDetail = (slug: string): RegionDetail | undefined => {
  const summary = summaryOf(slug);
  const overview = getRegionOverview(slug);
  const content = REGION_DETAIL_CONTENT.find((item) => item.slug === slug);
  if (!summary || !overview || !content) return undefined;
  return { ...summary, ...overview, ...content };
};

/** Every region with both a summary and an overview, west to east (the Regions map order). */
export const regionCards = (): RegionCardData[] =>
  REGION_OVERVIEWS.flatMap((overview) => {
    const summary = summaryOf(overview.slug);
    return summary ? [{ ...summary, ...overview }] : [];
  });

/** The regions to compare with, in the given order; unknown slugs are skipped. */
export const regionsToCompare = (slugs: readonly string[]): RegionCardData[] =>
  slugs.flatMap((slug) => regionCards().find((region) => region.slug === slug) ?? []);
