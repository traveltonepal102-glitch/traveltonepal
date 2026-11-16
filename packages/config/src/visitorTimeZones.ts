/**
 * Places the Contact page can show the office hours for ("Time difference"), in the visitor's summer and winter
 * time. The admin picks up to four in Pages › Contact; the website shows them in this order. `placeDe`: the
 * German website's name for the place.
 */
export const VISITOR_TIME_ZONES = [
  { timeZone: "Europe/Berlin", place: "Germany (Berlin)", placeDe: "Deutschland (Berlin)" },
  { timeZone: "Europe/Zurich", place: "Switzerland (Zurich)", placeDe: "Schweiz (Zürich)" },
  { timeZone: "Europe/Paris", place: "France (Paris)", placeDe: "Frankreich (Paris)" },
  { timeZone: "Europe/Amsterdam", place: "Netherlands (Amsterdam)", placeDe: "Niederlande (Amsterdam)" },
  { timeZone: "Europe/London", place: "United Kingdom (London)", placeDe: "Großbritannien (London)" },
  { timeZone: "America/New_York", place: "USA (New York)", placeDe: "USA (New York)" },
  { timeZone: "America/Los_Angeles", place: "USA (Los Angeles)", placeDe: "USA (Los Angeles)" },
  { timeZone: "America/Toronto", place: "Canada (Toronto)", placeDe: "Kanada (Toronto)" },
  { timeZone: "Australia/Sydney", place: "Australia (Sydney)", placeDe: "Australien (Sydney)" },
  { timeZone: "Asia/Kolkata", place: "India (Delhi)", placeDe: "Indien (Delhi)" },
  { timeZone: "Asia/Singapore", place: "Singapore", placeDe: "Singapur" },
  { timeZone: "Asia/Tokyo", place: "Japan (Tokyo)", placeDe: "Japan (Tokio)" },
] as const;

export type VisitorTimeZone = (typeof VISITOR_TIME_ZONES)[number]["timeZone"];

export const MAX_VISITOR_TIME_ZONES = 4;
