import type { DepartureStatus } from "@/features/treks/types";

import type { DepartureItem } from "../types";
import { monthTitle } from "./dates";

export type DepartureFilters = { trekId: string; status: DepartureStatus | "all"; showPast: boolean };

export const NO_DEPARTURE_FILTERS: DepartureFilters = { trekId: "", status: "all", showPast: false };

/** A date is past from the day after it starts (`today`: "YYYY-MM-DD" in Nepal); the website hides it then. */
export const isPast = (departure: Pick<DepartureItem, "startDate">, today: string) => departure.startDate < today;

export type MonthGroup = { key: string; title: string; departures: DepartureItem[] };

/**
 * The dates to list, in date order and grouped by month (design: one card per month). Past dates, when shown,
 * come first in one "Past dates" group, newest first; the status filter applies to upcoming dates only.
 */
export const groupDepartures = (departures: DepartureItem[], { trekId, status, showPast }: DepartureFilters, today: string): MonthGroup[] => {
  const forTrek = departures.filter((departure) => !trekId || departure.trekId === trekId);
  const upcoming = forTrek
    .filter((departure) => !isPast(departure, today) && (status === "all" || departure.status === status))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const months = new Map<string, DepartureItem[]>();
  for (const departure of upcoming) {
    const key = departure.startDate.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), departure]);
  }
  const groups = [...months].map(([key, items]) => ({ key, title: monthTitle(key), departures: items }));
  if (!showPast) return groups;

  const past = forTrek.filter((departure) => isPast(departure, today)).sort((a, b) => b.startDate.localeCompare(a.startDate));
  return past.length ? [{ key: "past", title: "Past dates", departures: past }, ...groups] : groups;
};

/** Upcoming dates per status, for the filter chips and the tiles. */
export const countByStatus = (departures: DepartureItem[], today: string) => {
  const counts: Record<DepartureStatus | "all", number> = { all: 0, guaranteed: 0, open: 0, almost_full: 0, full: 0 };
  for (const departure of departures) {
    if (isPast(departure, today)) continue;
    counts.all += 1;
    counts[departure.status] += 1;
  }
  return counts;
};

/** How many treks have at least one upcoming date. */
export const treksWithUpcomingDates = (departures: DepartureItem[], today: string) =>
  new Set(departures.filter((departure) => !isPast(departure, today)).map((departure) => departure.trekId)).size;

/** The main trekking months (design: "Main trekking season"): March to May and October to November. */
export const isMainSeason = (monthKey: string) => ["03", "04", "05", "10", "11"].includes(monthKey.slice(5, 7));
