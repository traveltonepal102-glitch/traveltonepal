import type { DepartureItem } from "../types";
import type { RepeatPattern } from "./dates";
import { clashWith, nextYearSameWeekday, repeatDates, seasonOf } from "./dates";

export type RepeatMode = "pattern" | "copy";

export type PlannedDate = {
  startDate: string;
  /** Copied with the date (copy a season); empty for a pattern. */
  note: string;
  /** "same_day": the trek already has it (it is skipped); "same_week": worth a look. */
  clash: "same_day" | "same_week" | null;
};

/** The seasons a trek already has dates in, newest first, to copy one year on. */
export const seasonsWithDates = (trekDates: DepartureItem[]) => {
  const seasons = new Map<string, { key: string; label: string; count: number }>();
  for (const departure of trekDates) {
    const season = seasonOf(departure.startDate);
    const known = seasons.get(season.key);
    seasons.set(season.key, { ...season, count: (known?.count ?? 0) + 1 });
  }
  return [...seasons.values()].sort((a, b) => b.key.localeCompare(a.key));
};

/**
 * The dates "Repeat dates" would add for one trek: a weekday pattern, or a season copied one year on (same
 * weekday, notes copied; special prices are not). Each is checked against the trek's existing dates.
 */
export const planDates = (mode: RepeatMode, pattern: RepeatPattern, seasonKey: string, trekDates: DepartureItem[]): PlannedDate[] => {
  const existing = trekDates.map((departure) => departure.startDate);
  const planned =
    mode === "pattern"
      ? repeatDates(pattern).map((startDate) => ({ startDate, note: "" }))
      : trekDates
          .filter((departure) => seasonOf(departure.startDate).key === seasonKey)
          .sort((a, b) => a.startDate.localeCompare(b.startDate))
          .map((departure) => ({ startDate: nextYearSameWeekday(departure.startDate), note: departure.note }));

  return planned.map((date) => ({ ...date, clash: clashWith(date.startDate, existing) }));
};
