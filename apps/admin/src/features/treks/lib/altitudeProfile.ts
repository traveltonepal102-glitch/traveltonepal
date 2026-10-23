/** Chart box in SVG units: the plot runs from x 76 to 1000 (room for "6,000 m" on the left) and from y 16 to 176. */
export const ALTITUDE_CHART = { width: 1020, height: 210, left: 76, right: 1000, top: 16, bottom: 176 } as const;

const GRID_STEP_M = 1500;
/** Like the trek page: treks start from Kathmandu (1,400 m), so the axis starts at 1,000 m unless a day is lower. */
const AXIS_FLOOR_M = 1000;

export type AltitudePoint = { day: number; altitudeM: number; x: number; y: number };

export type AltitudeProfile = {
  points: AltitudePoint[];
  gridLines: { altitudeM: number; y: number }[];
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

  const { left, right, top, bottom } = ALTITUDE_CHART;
  const highest = Math.max(...days.map((day) => day.altitudeM));
  const floor = Math.min(AXIS_FLOOR_M, Math.floor(Math.min(...days.map((day) => day.altitudeM)) / 500) * 500);
  const ceiling = Math.max(floor + GRID_STEP_M, Math.ceil(highest / GRID_STEP_M) * GRID_STEP_M);
  const lastDay = altitudes.length;

  const xOf = (day: number) => round(lastDay === 1 ? left : left + ((day - 1) / (lastDay - 1)) * (right - left));
  const yOf = (altitudeM: number) => round(bottom - ((altitudeM - floor) / (ceiling - floor)) * (bottom - top));

  const points = days.map((day) => ({ ...day, x: xOf(day.day), y: yOf(day.altitudeM) }));
  const linePath = `M${points.map((point) => `${point.x} ${point.y}`).join(" L")}`;
  const gridLines = [];
  for (let altitudeM = Math.ceil(floor / GRID_STEP_M) * GRID_STEP_M; altitudeM <= ceiling; altitudeM += GRID_STEP_M) {
    gridLines.push({ altitudeM, y: yOf(altitudeM) });
  }

  return {
    points,
    gridLines,
    linePath,
    areaPath: `${linePath} L${points[points.length - 1].x} ${bottom} L${points[0].x} ${bottom} Z`,
    peak: points.reduce((best, point) => (point.altitudeM > best.altitudeM ? point : best)),
  };
};
