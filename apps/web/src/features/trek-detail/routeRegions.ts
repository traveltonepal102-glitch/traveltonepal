import { regionHref } from "@/features/region-detail/regionDetails";
import type { RegionCard } from "@/features/regions/regionRows";
import type { TrekRouteRegion } from "@/features/treks/types";

import type { TrekRouteStop } from "./types";

/**
 * Each day's region along the route, from the regions saved on the days (trek_days.region_id): a day without one,
 * or with one that isn't on the route, is in the same region as the day before (day 1: the main region). Empty when
 * no day has a region saved, so the page never guesses the days.
 */
export const dayRegionSlugs = (saved: readonly (string | null)[], route: readonly TrekRouteRegion[]): string[] => {
  const onRoute = (slug: string | null): slug is string => slug !== null && route.some((stop) => stop.slug === slug);
  if (route.length < 2 || !saved.some(onRoute)) return [];
  let current = route[0].slug;
  return saved.map((slug) => (current = onRoute(slug) ? slug : current));
};

/** Day numbers in runs, e.g. [1, 2, 3, 9] → "Days 1–3, 9"; one day → "Day 4". */
export const dayRangesLabel = (dayNumbers: readonly number[]): string => {
  const runs: [number, number][] = [];
  for (const day of dayNumbers) {
    const last = runs.at(-1);
    if (last && day === last[1] + 1) last[1] = day;
    else runs.push([day, day]);
  }
  const text = runs.map(([first, end]) => (first === end ? `${first}` : `${first}–${end}`)).join(", ");
  return `${dayNumbers.length === 1 ? "Day" : "Days"} ${text}`;
};

/**
 * "Regions on this route": one stop per region in route order, with its details from the region's own card
 * (Regions page) and its days. Empty for a trek in one region (the section is left out).
 */
export const toRouteStops = (route: readonly TrekRouteRegion[], regions: readonly RegionCard[], daySlugs: readonly string[]): TrekRouteStop[] => {
  if (route.length < 2) return [];
  return route.map((stop, index) => {
    const card = regions.find((region) => region.slug === stop.slug);
    const dayNumbers = daySlugs.flatMap((slug, day) => (slug === stop.slug ? day + 1 : []));
    return {
      slug: stop.slug,
      name: stop.name,
      place: index === 0 ? "start" : index === route.length - 1 ? "end" : "through",
      tagline: card?.tagline,
      image: card?.image,
      maxAltitudeM: card?.maxAltitudeM,
      difficulty: card?.difficulty,
      permits: card?.permits ?? "",
      months: card?.months,
      href: regionHref(card ?? { slug: stop.slug, hasPage: false }),
      days: dayNumbers.length ? dayRangesLabel(dayNumbers) : undefined,
    };
  });
};
