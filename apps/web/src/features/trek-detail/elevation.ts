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
  /** "high": the top of a day that goes higher than where you sleep (a pass, a day hike), halfway into the day; "night": where the day ends. */
  kind: "high" | "night";
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

/** Where a day tops out: its highest point's name when it sleeps lower ("" on days saved before it had one), else where it sleeps. */
export const topPlaceOf = <Day extends Pick<ItineraryDay, "place" | "highPlace" | "sleepAltitudeM">>(day: Day | undefined) =>
  day && (day.sleepAltitudeM === undefined ? day.place : (day.highPlace ?? ""));

type Stop = Pick<ElevationPoint, "day" | "kind" | "place" | "altitudeM"> & { position: number };

/** A day's points in order: its high point when it goes higher than the night, then the night (on the day itself). */
const stopsOf = (day: ItineraryDay, index: number): Stop[] => {
  const night: Stop = { day: index + 1, kind: "night", place: day.place, altitudeM: day.sleepAltitudeM ?? day.altitudeM, position: index };
  if (night.altitudeM >= day.altitudeM) return [night];
  return [{ day: index + 1, kind: "high", place: day.highPlace ?? "", altitudeM: day.altitudeM, position: index - 0.5 }, night];
};

const withAltitude = (place: string, altitudeM: number) => [place, formatAltitude(altitudeM)].filter(Boolean).join(" ");

const roleOf = (index: number, peakIndex: number, nightIndex: number): ElevationPointRole => {
  if (index === peakIndex) return "summit";
  if (index === nightIndex) return "highestNight";
  if (index === 0) return "start";
  return index < peakIndex ? "climb" : "descent";
};

const labelOf = (point: Omit<ElevationPoint, "label">): ElevationLabel | undefined => {
  const { role, place, altitudeM, x, y } = point;
  if (role === "descent") return undefined;
  if (role === "summit") return { text: withAltitude(place, altitudeM), x, y: y - 17, anchor: "middle" };
  if (role === "highestNight") return { text: withAltitude(place, altitudeM), x: x - 17, y: y - 15, anchor: "end" };
  if (!place) return undefined;
  const isNearFloor = y > ELEVATION_CHART.bottom - NEAR_FLOOR;
  return { text: place, x, y: isNearFloor ? y - 12 : y + 21, anchor: "middle" };
};

/**
 * Daily altitude curve for the itinerary: points, grid, SVG paths and the peak and highest night. Each night sits on
 * its day; a day that goes higher than where you sleep adds its high point halfway into the day (Dharmasala →
 * Larkya La → Bhimthang).
 */
export const buildElevationProfile = (days: readonly ItineraryDay[]): ElevationProfile | null => {
  if (days.length < 2) return null;

  const stops = days.flatMap(stopsOf);
  const altitudes = stops.map((stop) => stop.altitudeM);
  const peakIndex = altitudes.indexOf(Math.max(...altitudes));
  const nightIndex = stops.reduce((best, stop, index) => (stop.kind === "night" && (best < 0 || stop.altitudeM > stops[best].altitudeM) ? index : best), -1);

  const floorM = Math.min(...altitudes) >= AXIS_FLOOR_M ? AXIS_FLOOR_M : 0;
  const ceilingM = floorM + GRID_STEP_M * Math.max(1, Math.ceil((altitudes[peakIndex] - floorM) / GRID_STEP_M));
  const { left, right, top, bottom } = ELEVATION_CHART;
  // Day 1 going higher puts its high point half a day before it.
  const first = Math.min(0, stops[0].position);
  const xAt = (position: number) => round(left + ((position - first) * (right - left)) / (days.length - 1 - first));
  const yAt = (meters: number) => round(bottom - ((meters - floorM) / (ceilingM - floorM)) * (bottom - top));

  const points = stops.map(({ position, ...stop }, index): ElevationPoint => {
    const point = { ...stop, x: xAt(position), y: yAt(stop.altitudeM), role: roleOf(index, peakIndex, nightIndex) };
    return { ...point, label: index <= peakIndex ? labelOf(point) : undefined };
  });

  const gridLines = Array.from({ length: (ceilingM - floorM) / GRID_STEP_M + 1 }, (_, step) => {
    const altitudeM = floorM + step * GRID_STEP_M;
    return { altitudeM, y: yAt(altitudeM) };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const firstPoint = points[0];
  const last = points[points.length - 1];
  const peak = points[peakIndex];
  const goesBackDown = last.altitudeM < peak.altitudeM ? ", then back down" : "";

  return {
    points,
    gridLines,
    linePath,
    areaPath: `${linePath} L${last.x} ${bottom} L${firstPoint.x} ${bottom} Z`,
    peak,
    highestNight: { place: stops[nightIndex].place, altitudeM: stops[nightIndex].altitudeM },
    description: `Altitude profile: from ${formatAltitude(firstPoint.altitudeM)}${firstPoint.place ? ` in ${firstPoint.place}` : ""} up to ${formatAltitude(peak.altitudeM)}${peak.place ? ` on ${peak.place}` : ""} on day ${peak.day}${goesBackDown}.`,
  };
};
