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

/** The route's stops from the day-by-day plan (days without a place are left out). */
export const routeStops = (days: readonly ItineraryDay[]): RouteStop[] =>
  days.reduce<RouteStop[]>((stops, day, index) => {
    const place = day.place.trim();
    if (!place) return stops;

    const dayNumber = index + 1;
    const last = stops.at(-1);
    if (last && samePlace(last.place, place)) {
      last.lastDay = dayNumber;
      last.altitudeM = Math.max(last.altitudeM, day.altitudeM);
      if (day.isHighPoint) last.kind = "summit";
      return stops;
    }

    const kind = day.isHighPoint ? "summit" : stops.length === 0 ? "start" : "stop";
    stops.push({ place, altitudeM: day.altitudeM, firstDay: dayNumber, lastDay: dayNumber, kind });
    return stops;
  }, []);

/** "Day 3", or "Days 9–10" for a stop of more than one day. */
export const stopDays = ({ firstDay, lastDay }: RouteStop) => (firstDay === lastDay ? `Day ${firstDay}` : `Days ${firstDay}–${lastDay}`);
