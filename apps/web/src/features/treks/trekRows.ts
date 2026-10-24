import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTrekRow } from "@/lib/supabase/database.types";

import type { TrekDifficulty, TrekSummary } from "./types";

const DIFFICULTY: Record<WebTrekRow["difficulty"], TrekDifficulty> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  strenuous: "Strenuous",
};

/**
 * The web_treks rows (published treks) as trek summaries, A–Z. A trek still missing its name, days or highest
 * point isn't shown (every card shows them).
 */
export const toTrekSummaries = (rows: readonly WebTrekRow[], photosBaseUrl: string): TrekSummary[] =>
  rows
    .flatMap((row): TrekSummary[] => {
      const name = firstText(row.name);
      if (!name || row.days === null || row.max_altitude_m === null) return [];
      return [
        {
          slug: row.slug,
          name,
          region: row.region_name.trim(),
          regionSlug: row.region_slug,
          summary: row.summary.trim(),
          days: row.days,
          maxAltitudeM: row.max_altitude_m,
          difficulty: DIFFICULTY[row.difficulty],
          priceFromUsd: row.price_from_usd ?? undefined,
          seasonLabel: row.season_label.trim(),
          seasons: row.seasons,
          tags: row.tags,
          badge: firstText(row.card_badge),
          isPopular: row.is_popular,
          hasFixedDates: row.has_fixed_dates,
          image: coverImage(row, photosBaseUrl, name),
        },
      ];
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug));
