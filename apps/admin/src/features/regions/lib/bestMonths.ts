import type { MonthRating } from "@/lib/supabase/database.types";

import { MONTH_NAMES } from "../constants";

/**
 * The best months as short ranges: "Mar–May, Oct–Nov". A run over the new year joins up ("Nov–Feb").
 * Empty when no month is rated best.
 */
export const formatBestMonths = (ratings: MonthRating[]): string => {
  const runs: [number, number][] = [];
  ratings.forEach((rating, month) => {
    if (rating !== "best") return;
    const last = runs.at(-1);
    if (last && last[1] === month - 1) last[1] = month;
    else runs.push([month, month]);
  });

  const first = runs[0];
  const last = runs.at(-1);
  if (runs.length > 1 && first?.[0] === 0 && last?.[1] === 11) {
    runs.shift();
    last[1] = first[1];
  }

  return runs
    .map(([start, end]) => (start === end ? MONTH_NAMES[start] : `${MONTH_NAMES[start]}–${MONTH_NAMES[end]}`))
    .join(", ");
};
