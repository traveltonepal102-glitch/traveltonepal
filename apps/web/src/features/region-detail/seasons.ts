import type { MonthRating } from "@ttn/ui/lib/bestMonths";

import type { SeasonNote } from "./types";

export type SeasonKey = "spring" | "monsoon" | "autumn" | "winter";

/** Nepal's trekking seasons, as the admin labels them (months 0 = Jan … 11 = Dec). */
const SEASONS: readonly { key: SeasonKey; name: string; months: readonly number[] }[] = [
  { key: "spring", name: "Spring · Mar–May", months: [2, 3, 4] },
  { key: "monsoon", name: "Monsoon · Jun–Aug", months: [5, 6, 7] },
  { key: "autumn", name: "Autumn · Sep–Nov", months: [8, 9, 10] },
  { key: "winter", name: "Winter · Dec–Feb", months: [11, 0, 1] },
];

/** A season's rating: the rating most of its three months have, "possible" when they are all different. */
export const seasonRating = (ratings: readonly MonthRating[], months: readonly number[]): MonthRating => {
  const count = (rating: MonthRating) => months.filter((month) => ratings[month] === rating).length;
  if (count("best") >= 2) return "best";
  if (count("avoid") >= 2) return "avoid";
  return "possible";
};

/** One card per season the admin wrote a note for, rated from the month strip so the two always agree. */
export const toSeasonNotes = (ratings: readonly MonthRating[], notes: Record<SeasonKey, string>): SeasonNote[] =>
  SEASONS.flatMap((season) => {
    const text = notes[season.key].trim();
    return text ? [{ name: season.name, rating: seasonRating(ratings, season.months), text }] : [];
  });
