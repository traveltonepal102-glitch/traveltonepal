/**
 * The altitude chart's points and axis, shared by the admin's "Altitude chart" and the website's "Route and elevation
 * profile", so both draw the same line from the same days. Each night sits on its day; a day that goes higher than
 * where you sleep (a pass, a day hike) adds its high point halfway into the day: Dharmasala → Larkya La → Bhimthang.
 * x and y are percentages of the plot (0–100, y from the top); each app scales them to its own drawing.
 */

const GRID_STEP_M = 1500;
/** Treks start from Kathmandu (1,400 m), so the axis starts at 1,000 m unless a point is lower. */
const AXIS_FLOOR_M = 1000;

/** A day's highest point and where you sleep (null or left out: the same as the highest point, or not typed yet). */
export type AltitudeDay = { altitudeM: number | null; sleepAltitudeM?: number | null };

/** "high": the top of a day that goes higher than where you sleep; "night": where the day ends. day is 1-based. */
export type AltitudeStop = { day: number; kind: "high" | "night"; altitudeM: number; x: number; y: number };

export type AltitudeChart = {
  /** In walking order. */
  stops: AltitudeStop[];
  /** Where each day sits across the plot (every day, with or without an altitude), for its day label. */
  dayXs: number[];
  /** Every 1,500 m. */
  gridLines: { altitudeM: number; y: number }[];
  /** The highest stop (the first one on a tie). */
  peakIndex: number;
  /** The highest night (the first one on a tie). */
  highestNightIndex: number;
};

const round = (value: number) => Math.round(value * 10) / 10;

type Placed = Omit<AltitudeStop, "x" | "y"> & { position: number };

/** A day's stops in order: its high point (half a day in) when it goes higher than the night, then the night. */
const stopsOf = ({ altitudeM, sleepAltitudeM }: AltitudeDay, index: number): Placed[] => {
  const night = sleepAltitudeM ?? altitudeM;
  if (night === null) return [];
  const nightStop: Placed = { day: index + 1, kind: "night", altitudeM: night, position: index };
  if (altitudeM === null || altitudeM <= night) return [nightStop];
  return [{ day: index + 1, kind: "high", altitudeM, position: index - 0.5 }, nightStop];
};

const firstHighest = (stops: readonly Placed[], isCounted: (stop: Placed) => boolean) =>
  stops.reduce((best, stop, index) => (isCounted(stop) && (best < 0 || stop.altitudeM > stops[best].altitudeM) ? index : best), -1);

/** The chart for the day-by-day plan; null with fewer than 2 stops, as there is no line to draw. */
export const buildAltitudeChart = (days: readonly AltitudeDay[]): AltitudeChart | null => {
  const placed = days.flatMap(stopsOf);
  if (placed.length < 2) return null;

  const altitudes = placed.map((stop) => stop.altitudeM);
  const floor = Math.min(AXIS_FLOOR_M, Math.floor(Math.min(...altitudes) / 500) * 500);
  const ceiling = Math.max(floor + GRID_STEP_M, Math.ceil(Math.max(...altitudes) / GRID_STEP_M) * GRID_STEP_M);
  // Day 1 going higher puts its high point half a day before it.
  const first = Math.min(0, placed[0].position);
  const span = days.length - 1 - first;

  const xOf = (position: number) => round(span === 0 ? 0 : ((position - first) / span) * 100);
  const yOf = (altitudeM: number) => round(((ceiling - altitudeM) / (ceiling - floor)) * 100);

  const gridLines = [];
  for (let altitudeM = Math.ceil(floor / GRID_STEP_M) * GRID_STEP_M; altitudeM <= ceiling; altitudeM += GRID_STEP_M) {
    gridLines.push({ altitudeM, y: yOf(altitudeM) });
  }

  return {
    stops: placed.map(({ position, ...stop }) => ({ ...stop, x: xOf(position), y: yOf(stop.altitudeM) })),
    dayXs: days.map((_, index) => xOf(index)),
    gridLines,
    peakIndex: firstHighest(placed, () => true),
    highestNightIndex: firstHighest(placed, (stop) => stop.kind === "night"),
  };
};
