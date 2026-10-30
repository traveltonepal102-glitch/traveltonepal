import { buildAltitudeChart } from "@ttn/config/altitudeChart";
import type { AltitudeDay, AltitudeStop } from "@ttn/config/altitudeChart";

/**
 * A point of the chart: a day's night, or its high point when it goes higher (@ttn/config/altitudeChart, the same
 * points as the trek page). x and y are percentages of the plot, so the page lays out the labels at any width.
 */
export type AltitudePoint = AltitudeStop;

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

/** The altitude line for the day-by-day plan, as the trek page draws it. null with fewer than 2 points. */
export const buildAltitudeProfile = (days: readonly AltitudeDay[]): AltitudeProfile | null => {
  const chart = buildAltitudeChart(days);
  if (!chart) return null;

  const { stops: points, dayXs, gridLines, peakIndex } = chart;
  const linePath = `M${points.map((point) => `${point.x} ${point.y}`).join(" L")}`;

  return {
    points,
    dayXs,
    gridLines,
    linePath,
    areaPath: `${linePath} L${points[points.length - 1].x} 100 L${points[0].x} 100 Z`,
    peak: points[peakIndex],
  };
};
