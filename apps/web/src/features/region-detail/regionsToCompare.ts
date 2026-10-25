import type { RegionCard } from "@/features/regions/regionRows";

/** How many regions "Compare with other regions" shows when the admin picked none (one row of cards). */
const COMPARE_COUNT = 4;

const distance = (a: RegionCard, b: RegionCard) => Math.hypot(a.location.lat - b.location.lat, a.location.lon - b.location.lon);

/**
 * The regions to compare with: the admin's picks in their order (a pick without a card yet is skipped), or
 * without picks the nearest regions by map pin.
 */
export const regionsToCompare = (region: RegionCard, picks: readonly string[], regions: readonly RegionCard[]): RegionCard[] => {
  const others = regions.filter((other) => other.slug !== region.slug);
  if (picks.length > 0) return picks.flatMap((slug) => others.find((other) => other.slug === slug) ?? []);
  return others
    .toSorted((a, b) => distance(region, a) - distance(region, b) || a.slug.localeCompare(b.slug))
    .slice(0, COMPARE_COUNT);
};
