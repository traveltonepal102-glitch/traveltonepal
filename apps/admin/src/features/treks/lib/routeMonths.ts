import type { MonthRating } from "@/lib/supabase/database.types";

import type { RegionOption } from "../types";

const WORSE_FIRST: readonly MonthRating[] = ["avoid", "possible", "best"];

/**
 * The route's month ratings (Jan–Dec), as the trek page colours its start months (web_trek_pages): each month as good
 * as the worst region on the route. Null without a region.
 */
export const routeMonthRatings = (regions: readonly RegionOption[]): MonthRating[] | null => {
  if (!regions.length) return null;
  return Array.from({ length: 12 }, (_, month) => WORSE_FIRST.find((rating) => regions.some((region) => region.monthRatings[month] === rating)) ?? "avoid");
};
