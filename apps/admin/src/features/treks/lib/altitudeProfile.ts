const GRID_STEP_M = 1500;
/** Like the trek page: treks start from Kathmandu (1,400 m), so the axis starts at 1,000 m unless a day is lower. */
const AXIS_FLOOR_M = 1000;

/** x and y are percentages of the plot (0–100, y from the top), so the page lays out the labels at any width. */
export type AltitudePoint = { day: number; altitudeM: number; x: number; y: number };

export type AltitudeProfile = {
  points: AltitudePoint[];
  /** Where each day sits across the plot (every day, with or without an altitude), for its "Day n" label. */
  dayXs: number[];
  gridLines: { altitudeM: number; y: number }[];
  /** In a 100 × 100 box, drawn stretched to the plot. */
  linePath: string;
  areaPath: string;
  peak: AltitudePoint;
};

/** "4,773" or "4 773" → 4773; anything else → null (still being typed, or empty). */
export const parseAltitude = (value: string): number | null => {
  const cleaned = value.replace(/[,\s]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  return Number(cleaned);
};

const round = (value: number) => Math.round(value * 10) / 10;

/**
 * The altitude line for the day-by-day plan (one point per day with an altitude), with grid lines every
 * 1,500 m and the highest point. null with fewer than 2 days, as there is no line to draw.
 */
export const buildAltitudeProfile = (altitudes: (number | null)[]): AltitudeProfile | null => {
  const days = altitudes.flatMap((altitudeM, index) => (altitudeM === null ? [] : [{ day: index + 1, altitudeM }]));
  if (days.length < 2) return null;

  const highest = Math.max(...days.map((day) => day.altitudeM));
  const floor = Math.min(AXIS_FLOOR_M, Math.floor(Math.min(...days.map((day) => day.altitudeM)) / 500) * 500);
  const ceiling = Math.max(floor + GRID_STEP_M, Math.ceil(highest / GRID_STEP_M) * GRID_STEP_M);
  const lastDay = altitudes.length;

  const xOf = (day: number) => round(lastDay === 1 ? 0 : ((day - 1) / (lastDay - 1)) * 100);
  const yOf = (altitudeM: number) => round(((ceiling - altitudeM) / (ceiling - floor)) * 100);

  const points = days.map((day) => ({ ...day, x: xOf(day.day), y: yOf(day.altitudeM) }));
  const linePath = `M${points.map((point) => `${point.x} ${point.y}`).join(" L")}`;
  const gridLines = [];
  for (let altitudeM = Math.ceil(floor / GRID_STEP_M) * GRID_STEP_M; altitudeM <= ceiling; altitudeM += GRID_STEP_M) {
    gridLines.push({ altitudeM, y: yOf(altitudeM) });
  }

  return {
    points,
    dayXs: altitudes.map((_, index) => xOf(index + 1)),
    gridLines,
    linePath,
    areaPath: `${linePath} L${points[points.length - 1].x} 100 L${points[0].x} 100 Z`,
    peak: points.reduce((best, point) => (point.altitudeM > best.altitudeM ? point : best)),
  };
};
