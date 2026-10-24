import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebRegionRow } from "@/lib/supabase/database.types";

import type { RegionSummary } from "./regions";
import { REGIONS } from "./regions";

/** The website's order of regions (the first is the big home tile); a region added later goes after them, A–Z. */
const ORDER = REGIONS.map((region) => region.slug);
const placeOf = (slug: string) => (ORDER.includes(slug) ? ORDER.indexOf(slug) : ORDER.length);

/**
 * The web_regions rows as regions, in the website's order. A region still missing its name or highest point
 * isn't shown (every region shows both).
 */
export const toRegionSummaries = (rows: readonly WebRegionRow[], photosBaseUrl: string): RegionSummary[] =>
  rows
    .flatMap((row): RegionSummary[] => {
      const name = firstText(row.name);
      if (!name || row.max_altitude_m === null) return [];
      return [
        {
          slug: row.slug,
          name,
          maxAltitudeM: row.max_altitude_m,
          tagline: firstText(row.tagline, row.summary),
          image: coverImage(row, photosBaseUrl, `${name} region`),
        },
      ];
    })
    .sort((a, b) => placeOf(a.slug) - placeOf(b.slug) || a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug));
