import { buildAltitudeChart } from "@ttn/config/altitudeChart";

import { formatAltitude } from "@/features/treks/format";

import type { ItineraryDay } from "./types";

/** Chart box in SVG units, from the design: plot from x 60 to 1020 and from y 30 (top) to 210 (bottom). */
export const ELEVATION_CHART = { width: 1080, height: 250, left: 60, right: 1020, top: 30, bottom: 210 } as const;

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
  /** Only the way up is labelled; the way down repeats the same places (its points are still drawn). */
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

/** Where a day tops out: its highest point's name when it sleeps lower ("" on days saved before it had one), else where it sleeps. */
export const topPlaceOf = <Day extends Pick<ItineraryDay, "place" | "highPlace" | "sleepAltitudeM">>(day: Day | undefined) =>
  day && (day.sleepAltitudeM === undefined ? day.place : (day.highPlace ?? ""));

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
 * Daily altitude curve for the itinerary: the same points and axis as the admin's chart (@ttn/config/altitudeChart:
 * each night on its day, and a day's high point halfway into it when the day goes higher than where you sleep),
 * scaled to the design's chart box, with the website's labels, the peak and the highest night.
 */
export const buildElevationProfile = (days: readonly ItineraryDay[]): ElevationProfile | null => {
  const chart = buildAltitudeChart(days);
  if (!chart) return null;

  const { left, right, top, bottom } = ELEVATION_CHART;
  const xAt = (percent: number) => Math.round((left + (percent / 100) * (right - left)) * 10) / 10;
  const yAt = (percent: number) => Math.round((top + (percent / 100) * (bottom - top)) * 10) / 10;
  const { peakIndex, highestNightIndex } = chart;

  const points = chart.stops.map((stop, index): ElevationPoint => {
    const day = days[stop.day - 1];
    const point = {
      ...stop,
      place: stop.kind === "high" ? (day.highPlace ?? "") : day.place,
      x: xAt(stop.x),
      y: yAt(stop.y),
      role: roleOf(index, peakIndex, highestNightIndex),
    };
    return { ...point, label: index <= peakIndex ? labelOf(point) : undefined };
  });

  const gridLines = chart.gridLines.map((line) => ({ altitudeM: line.altitudeM, y: yAt(line.y) }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const firstPoint = points[0];
  const last = points[points.length - 1];
  const peak = points[peakIndex];
  const highestNight = points[highestNightIndex];
  const goesBackDown = last.altitudeM < peak.altitudeM ? ", then back down" : "";

  return {
    points,
    gridLines,
    linePath,
    areaPath: `${linePath} L${last.x} ${bottom} L${firstPoint.x} ${bottom} Z`,
    peak,
    highestNight: { place: highestNight.place, altitudeM: highestNight.altitudeM },
    description: `Altitude profile: from ${formatAltitude(firstPoint.altitudeM)}${firstPoint.place ? ` in ${firstPoint.place}` : ""} up to ${formatAltitude(peak.altitudeM)}${peak.place ? ` on ${peak.place}` : ""} on day ${peak.day}${goesBackDown}.`,
  };
};
