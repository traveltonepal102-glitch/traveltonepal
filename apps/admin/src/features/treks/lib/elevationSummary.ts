/** A day's altitudes as the altitude chart and its boxes use them (as typed in Day-by-day itinerary). */
export type DayAltitude = { place: string; duration: string; altitudeM: number | null; sleepAltitudeM: number | null };

/** One box beside the chart; dayIndex null while no day qualifies yet. */
export type ElevationBox = { label: string; dayIndex: number | null; place: string; altitudeM: number | null };

/** Where a night is spent: the sleep altitude, or the day's altitude when it is the same. */
const nightAltitude = (day: DayAltitude) => day.sleepAltitudeM ?? day.altitudeM;

/** The first day with the highest value (days without one are skipped). */
const highestDay = (days: DayAltitude[], valueOf: (day: DayAltitude) => number | null) =>
  days.reduce<number | null>((best, day, index) => {
    const value = valueOf(day);
    if (value === null) return best;
    return best !== null && (valueOf(days[best]) ?? 0) >= value ? best : index;
  }, null);

/**
 * The trek page's three boxes beside the chart: where trekking starts (the first day with a walking or drive time),
 * the highest night and the high point.
 */
export const elevationSummary = (days: DayAltitude[]): ElevationBox[] => {
  const start = days.findIndex((day) => day.duration.trim() && day.altitudeM !== null);
  const box = (label: string, index: number | null, valueOf: (day: DayAltitude) => number | null): ElevationBox =>
    index === null || index < 0
      ? { label, dayIndex: null, place: "", altitudeM: null }
      : { label, dayIndex: index, place: days[index].place, altitudeM: valueOf(days[index]) };

  return [
    box("Trek start", start, (day) => day.altitudeM),
    box("Highest night", highestDay(days, nightAltitude), nightAltitude),
    box("High point", highestDay(days, (day) => day.altitudeM), (day) => day.altitudeM),
  ];
};
