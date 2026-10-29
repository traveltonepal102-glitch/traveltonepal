import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTrekRow } from "@/lib/supabase/database.types";

import { readRoute } from "./route";
import type { TrekDifficulty, TrekSummary } from "./types";

const DIFFICULTY: Record<WebTrekRow["difficulty"], TrekDifficulty> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
  strenuous: "Strenuous",
};

/** The website's "Recommended" order: popular treks first, then A–Z, then by address so it never flips. */
const byRecommended = (a: TrekSummary, b: TrekSummary) =>
  Number(b.isPopular) - Number(a.isPopular) || a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug);

/**
 * The web_treks rows (published treks) as trek summaries, in the "Recommended" order. A trek still missing its
 * name, days or highest point isn't shown (every card shows them).
 */
export const toTrekSummaries = (rows: readonly WebTrekRow[], photosBaseUrl: string): TrekSummary[] =>
  rows
    .flatMap((row): TrekSummary[] => {
      const name = firstText(row.name);
      if (!name || row.days === null || row.max_altitude_m === null) return [];
      const region = row.region_name.trim();
      return [
        {
          slug: row.slug,
          name,
          region,
          regionSlug: row.region_slug,
          route: readRoute(row.route_regions, { slug: row.region_slug, name: region }),
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
          hasPage: row.has_page,
          updatedAt: row.updated_at,
          image: coverImage(row, photosBaseUrl, name),
        },
      ];
    })
    .sort(byRecommended);
