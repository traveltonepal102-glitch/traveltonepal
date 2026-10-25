import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebRegionGuideRow } from "@/lib/supabase/database.types";

import type { RegionGuide } from "./types";

/** Most experienced first, then A–Z, then by id so the order never flips. */
const byExperience = (a: WebRegionGuideRow, b: WebRegionGuideRow) =>
  (b.years_guiding ?? 0) - (a.years_guiding ?? 0) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

/** The web_region_guides rows as "Your guides" cards; a guide still missing a name or role isn't shown. */
export const toRegionGuides = (rows: readonly WebRegionGuideRow[], photosBaseUrl: string): RegionGuide[] =>
  rows.toSorted(byExperience).flatMap((row): RegionGuide[] => {
    const name = firstText(row.name);
    const role = firstText(row.role);
    if (!name || !role) return [];
    return [
      {
        id: row.id,
        name,
        role,
        experience: row.years_guiding ? `${row.years_guiding}+ yrs guiding` : undefined,
        quote: firstText(row.quote),
        languages: row.languages.flatMap((language) => firstText(language) ?? []),
        isLicensed: row.is_licensed,
        // A portrait: its image text is the guide's name, not where it was taken.
        photo: coverImage(row, photosBaseUrl, name, name),
      },
    ];
  });
