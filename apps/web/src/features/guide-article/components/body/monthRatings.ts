import type { MonthRating } from "@/features/regions/overviews";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Label and colors per rating: the bar in the season strip and the verdict chip in the month table. */
export const RATING_LOOK: Record<MonthRating, { label: string; bar: string; chip: string }> = {
  best: { label: "Best", bar: "bg-month-best", chip: "bg-green-tint text-[#0f5e2e]" },
  possible: { label: "Possible", bar: "bg-month-possible", chip: "bg-saffron-tint text-saffron-ink" },
  avoid: { label: "Not ideal", bar: "bg-month-avoid", chip: "bg-muted text-muted-foreground" },
};

export const RATINGS: readonly MonthRating[] = ["best", "possible", "avoid"];
