const NUMBER = new Intl.NumberFormat("en-US");
const FEET_PER_METER = 3.28084;
const MILES_PER_KM = 0.621371;

/** 5545 → "5,545 m" */
export const formatAltitude = (meters: number) => `${NUMBER.format(meters)} m`;

/** 4773 → "4,773 m / 15,659 ft" */
export const formatAltitudeWithFeet = (meters: number) =>
  `${formatAltitude(meters)} / ${NUMBER.format(Math.round(meters * FEET_PER_METER))} ft`;

/** 75 → "~75 km / 47 miles" (trail distances are always approximate) */
export const formatDistance = (km: number) => `~${NUMBER.format(km)} km / ${NUMBER.format(Math.round(km * MILES_PER_KM))} miles`;

/** 1000 → "$1,000" */
export const formatUsd = (amount: number) => `$${NUMBER.format(amount)}`;

// UTC: departure dates are calendar days, the same for every visitor.
const DEPARTURE_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

/** "2026-11-02" → "Nov 02, 2026" */
export const formatDepartureDate = (isoDate: string) => DEPARTURE_DATE.format(new Date(isoDate));
