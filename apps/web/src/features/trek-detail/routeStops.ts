import type { ItineraryDay, RoutePinKind } from "./types";

/** A place on the route, in walking order: consecutive days in the same place (a rest day) are one stop. */
export type RouteStop = {
  place: string;
  /** The highest point reached while there. */
  altitudeM: number;
  firstDay: number;
  lastDay: number;
  kind: Exclude<RoutePinKind, "option">;
};

const samePlace = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Adds a place reached on a day, or extends the last stop when it is the same place. */
const addStop = (stops: RouteStop[], place: string, altitudeM: number, dayNumber: number, isSummit: boolean) => {
  if (!place) return;
  const last = stops.at(-1);
  if (last && samePlace(last.place, place)) {
    last.lastDay = dayNumber;
    last.altitudeM = Math.max(last.altitudeM, altitudeM);
    if (isSummit) last.kind = "summit";
    return;
  }
  const kind = isSummit ? "summit" : stops.length === 0 ? "start" : "stop";
  stops.push({ place, altitudeM, firstDay: dayNumber, lastDay: dayNumber, kind });
};

/**
 * The route's stops from the day-by-day plan (days without a place are left out). A day that goes higher than where
 * you sleep adds its highest point (e.g. Larkya La) before the night; a day saved without that name stays one stop.
 */
export const routeStops = (days: readonly ItineraryDay[]): RouteStop[] =>
  days.reduce<RouteStop[]>((stops, day, index) => {
    const dayNumber = index + 1;
    const top = day.sleepAltitudeM === undefined ? "" : (day.highPlace?.trim() ?? "");
    if (top) addStop(stops, top, day.altitudeM, dayNumber, Boolean(day.isHighPoint));
    addStop(stops, day.place.trim(), top ? (day.sleepAltitudeM ?? day.altitudeM) : day.altitudeM, dayNumber, Boolean(day.isHighPoint) && !top);
    return stops;
  }, []);

/** "Day 3", or "Days 9–10" for a stop of more than one day. */
export const stopDays = ({ firstDay, lastDay }: RouteStop) => (firstDay === lastDay ? `Day ${firstDay}` : `Days ${firstDay}–${lastDay}`);
