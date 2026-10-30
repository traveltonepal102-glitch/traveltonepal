const GRID_STEP_M = 1500;
/** Like the trek page: treks start from Kathmandu (1,400 m), so the axis starts at 1,000 m unless a day is lower. */
const AXIS_FLOOR_M = 1000;

/** A day's altitudes as the chart reads them: the highest point, and where you sleep (null while not typed yet). */
export type DayAltitudes = { altitudeM: number | null; sleepAltitudeM: number | null };

/**
 * "high": the top of a day that goes higher than where you sleep (a pass or a day hike), drawn halfway into the day;
 * "night": where the day ends, on the day's place on the axis.
 * x and y are percentages of the plot (0–100, y from the top), so the page lays out the labels at any width.
 */
export type AltitudePoint = { day: number; kind: "high" | "night"; altitudeM: number; x: number; y: number };

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

/** A day's points in order: its high point when it goes higher than the night, then the night. */
const dayPoints = ({ altitudeM, sleepAltitudeM }: DayAltitudes, index: number) => {
  const night = sleepAltitudeM ?? altitudeM;
  const goesHigher = altitudeM !== null && night !== null && altitudeM > night;
  return [
    ...(goesHigher ? [{ day: index + 1, kind: "high" as const, altitudeM, position: index - 0.5 }] : []),
    ...(night === null ? [] : [{ day: index + 1, kind: "night" as const, altitudeM: night, position: index }]),
  ];
};

/**
 * The altitude line for the day-by-day plan: each night on its day, and a day's high point halfway into it when the
 * day goes higher (Dharmasala → Larkya La → Bhimthang), with grid lines every 1,500 m and the highest point.
 * null with fewer than 2 points, as there is no line to draw.
 */
export const buildAltitudeProfile = (days: DayAltitudes[]): AltitudeProfile | null => {
  const stops = days.flatMap(dayPoints);
  if (stops.length < 2) return null;

  const altitudes = stops.map((stop) => stop.altitudeM);
  const highest = Math.max(...altitudes);
  const floor = Math.min(AXIS_FLOOR_M, Math.floor(Math.min(...altitudes) / 500) * 500);
  const ceiling = Math.max(floor + GRID_STEP_M, Math.ceil(highest / GRID_STEP_M) * GRID_STEP_M);
  // Day 1 going higher puts its high point half a day before it.
  const first = Math.min(0, stops[0].position);
  const span = days.length - 1 - first;

  const xOf = (position: number) => round(span === 0 ? 0 : ((position - first) / span) * 100);
  const yOf = (altitudeM: number) => round(((ceiling - altitudeM) / (ceiling - floor)) * 100);

  const points = stops.map(({ position, ...stop }) => ({ ...stop, x: xOf(position), y: yOf(stop.altitudeM) }));
  const linePath = `M${points.map((point) => `${point.x} ${point.y}`).join(" L")}`;
  const gridLines = [];
  for (let altitudeM = Math.ceil(floor / GRID_STEP_M) * GRID_STEP_M; altitudeM <= ceiling; altitudeM += GRID_STEP_M) {
    gridLines.push({ altitudeM, y: yOf(altitudeM) });
  }

  return {
    points,
    dayXs: days.map((_, index) => xOf(index)),
    gridLines,
    linePath,
    areaPath: `${linePath} L${points[points.length - 1].x} 100 L${points[0].x} 100 Z`,
    peak: points.reduce((best, point) => (point.altitudeM > best.altitudeM ? point : best)),
  };
};
