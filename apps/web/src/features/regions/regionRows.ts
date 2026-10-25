import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebRegionRow } from "@/lib/supabase/database.types";

import type { RegionDifficulty, RegionOverview } from "./overviews";
import type { RegionSummary } from "./regions";
import { REGIONS } from "./regions";

/** The website's order of regions (the first is the big home tile); a region added later goes after them, A–Z. */
const ORDER = REGIONS.map((region) => region.slug);
const placeOf = (slug: string) => (ORDER.includes(slug) ? ORDER.indexOf(slug) : ORDER.length);

const DIFFICULTY: Record<NonNullable<WebRegionRow["difficulty"]>, RegionDifficulty> = {
  easy: "Easy",
  easy_moderate: "Easy–moderate",
  moderate: "Moderate",
  easy_challenging: "Easy–challenging",
  challenging: "Challenging",
  strenuous: "Strenuous",
};

/** One row as a region summary; undefined while it is missing its name or highest point (every region shows both). */
const toRegionSummary = (row: WebRegionRow, photosBaseUrl: string): RegionSummary | undefined => {
  const name = firstText(row.name);
  if (!name || row.max_altitude_m === null) return undefined;
  return {
    slug: row.slug,
    name,
    maxAltitudeM: row.max_altitude_m,
    tagline: firstText(row.tagline, row.summary),
    image: coverImage(row, photosBaseUrl, `${name} region`),
  };
};

/** The web_regions rows as regions (home, header), in the website's order. */
export const toRegionSummaries = (rows: readonly WebRegionRow[], photosBaseUrl: string): RegionSummary[] =>
  rows
    .flatMap((row) => toRegionSummary(row, photosBaseUrl) ?? [])
    .sort((a, b) => placeOf(a.slug) - placeOf(b.slug) || a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug));

/** A region as the Regions page's map, cards and tables show it. */
export type RegionCard = RegionSummary &
  RegionOverview & {
    /** Up to three phrases, e.g. "Close to Kathmandu"; the card shows the first, the table all. */
    bestForTags: readonly string[];
  };

/**
 * The web_regions rows as region cards, west to east (by their map pin; the order of the numbered pins). A region
 * shows here once it has its map pin and difficulty too (the map and the tables need them). Blank texts stay
 * blank (""), for the page to leave out.
 */
export const toRegionCards = (rows: readonly WebRegionRow[], photosBaseUrl: string): RegionCard[] =>
  rows
    .flatMap((row): RegionCard[] => {
      const summary = toRegionSummary(row, photosBaseUrl);
      if (!summary || row.latitude === null || row.longitude === null || row.difficulty === null) return [];
      const bestForTags = row.best_for.flatMap((tag) => firstText(tag) ?? []);
      const gettingThere = row.getting_there.trim();
      return [
        {
          ...summary,
          shortName: firstText(row.short_name),
          district: row.district.trim(),
          location: { lat: row.latitude, lon: row.longitude },
          trekLength: row.trek_length.trim(),
          difficulty: DIFFICULTY[row.difficulty],
          access: { short: gettingThere, long: firstText(row.getting_there_details) ?? gettingThere, isFlight: row.is_flight },
          permits: row.permits.trim(),
          bestFor: bestForTags.join(", "),
          bestForTags,
          summary: row.summary.trim(),
          months: row.month_ratings,
        },
      ];
    })
    .sort((a, b) => a.location.lon - b.location.lon || a.slug.localeCompare(b.slug));
