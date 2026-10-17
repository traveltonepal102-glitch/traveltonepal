import { formatAltitude } from "@/features/treks/format";

import type { ItineraryDay } from "./types";

/** Chart box in SVG units, from the design: plot from x 60 to 1020 and from y 30 (top) to 210 (bottom). */
export const ELEVATION_CHART = { width: 1080, height: 250, left: 60, right: 1020, top: 30, bottom: 210 } as const;

const GRID_STEP_M = 1500;
/** Treks start from Kathmandu (1,400 m), so the axis starts at 1,000 m unless a day goes lower. */
const AXIS_FLOOR_M = 1000;
/** Points this close to the chart floor get their label above, not below. */
const NEAR_FLOOR = 30;

export type ElevationPointRole = "start" | "climb" | "highestNight" | "summit" | "descent";

export type ElevationLabel = { text: string; x: number; y: number; anchor: "middle" | "end" };

export type ElevationPoint = {
  day: number;
  place: string;
  altitudeM: number;
  x: number;
  y: number;
  role: ElevationPointRole;
  /** Only the way up is labelled; the way down repeats the same places. */
  label?: ElevationLabel;
};

export type ElevationProfile = {
  points: ElevationPoint[];
  gridLines: { altitudeM: number; y: number }[];
  linePath: string;
  areaPath: string;
  peak: ElevationPoint;
  highestNight: { place: string; altitudeM: number };
  /** Screen-reader summary of the chart. */
  description: string;
};

const round = (value: number) => Math.round(value * 10) / 10;

const roleOf = (index: number, peakIndex: number, nightIndex: number): ElevationPointRole => {
  if (index === peakIndex) return "summit";
  if (index === nightIndex) return "highestNight";
  if (index === 0) return "start";
  return index < peakIndex ? "climb" : "descent";
};

const labelOf = (point: Omit<ElevationPoint, "label">): ElevationLabel | undefined => {
  const { role, place, altitudeM, x, y } = point;
  if (role === "descent") return undefined;
  if (role === "summit") return { text: `${place} ${formatAltitude(altitudeM)}`, x, y: y - 17, anchor: "middle" };
  if (role === "highestNight") return { text: `${place} ${formatAltitude(altitudeM)}`, x: x - 17, y: y - 15, anchor: "end" };
  const isNearFloor = y > ELEVATION_CHART.bottom - NEAR_FLOOR;
  return { text: place, x, y: isNearFloor ? y - 12 : y + 21, anchor: "middle" };
};

/** Daily altitude curve for the itinerary: points, grid, SVG paths and the peak and highest night. */
export const buildElevationProfile = (days: readonly ItineraryDay[]): ElevationProfile | null => {
  if (days.length < 2) return null;

  const altitudes = days.map((day) => day.altitudeM);
  const nights = days.map((day) => day.sleepAltitudeM ?? day.altitudeM);
  const peakIndex = altitudes.indexOf(Math.max(...altitudes));
  const nightIndex = nights.indexOf(Math.max(...nights));

  const floorM = Math.min(...altitudes) >= AXIS_FLOOR_M ? AXIS_FLOOR_M : 0;
  const ceilingM = floorM + GRID_STEP_M * Math.max(1, Math.ceil((altitudes[peakIndex] - floorM) / GRID_STEP_M));
  const { left, right, top, bottom } = ELEVATION_CHART;
  const xAt = (index: number) => round(left + (index * (right - left)) / (days.length - 1));
  const yAt = (meters: number) => round(bottom - ((meters - floorM) / (ceilingM - floorM)) * (bottom - top));

  const points = days.map((day, index): ElevationPoint => {
    const point = {
      day: index + 1,
      place: day.place,
      altitudeM: day.altitudeM,
      x: xAt(index),
      y: yAt(day.altitudeM),
      role: roleOf(index, peakIndex, nightIndex),
    };
    return { ...point, label: index <= peakIndex ? labelOf(point) : undefined };
  });

  const gridLines = Array.from({ length: (ceilingM - floorM) / GRID_STEP_M + 1 }, (_, step) => {
    const altitudeM = floorM + step * GRID_STEP_M;
    return { altitudeM, y: yAt(altitudeM) };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const peak = points[peakIndex];
  const goesBackDown = last.altitudeM < peak.altitudeM ? ", then back down" : "";

  return {
    points,
    gridLines,
    linePath,
    areaPath: `${linePath} L${last.x} ${bottom} L${first.x} ${bottom} Z`,
    peak,
    highestNight: { place: days[nightIndex].place, altitudeM: nights[nightIndex] },
    description: `Altitude profile: from ${formatAltitude(first.altitudeM)} in ${first.place} up to ${formatAltitude(peak.altitudeM)} on ${peak.place} on day ${peak.day}${goesBackDown}.`,
  };
};
