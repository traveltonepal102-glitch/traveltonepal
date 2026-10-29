import { ROUTES } from "@/lib/routes";

/**
 * Trek filters, shared by the home trek finder, the header Treks menu and the Treks page, so a
 * link like /treks?length=6-9 means the same thing everywhere. Values are the URL values.
 */
export type TrekFilterParam = "q" | "region" | "length" | "difficulty" | "season" | "show" | "sort";

/**
 * "How long": ranges that don't overlap (one choice at a time), as the client asked on 2026-10-29.
 * The URL value names the range, e.g. /treks?length=6-9.
 */
export const TREK_LENGTHS = [
  { value: "1", label: "1 Day Hike", minDays: 1, maxDays: 1 },
  { value: "2-5", label: "2 to 5 Days", minDays: 2, maxDays: 5 },
  { value: "6-9", label: "6 to 9 Days", minDays: 6, maxDays: 9 },
  { value: "10-15", label: "10 to 15 Days", minDays: 10, maxDays: 15 },
  { value: "16plus", label: "15+ Days", minDays: 16, maxDays: Infinity },
] as const;

export type TrekLength = (typeof TREK_LENGTHS)[number]["value"];

export const TREK_SEASONS = [
  { value: "spring", label: "Spring (March - May)" },
  { value: "autumn", label: "Autumn (September - November)" },
  { value: "winter", label: "Winter (December - February)" },
  { value: "monsoon", label: "Monsoon (June - August)" },
] as const;

/** The Treks page results (with the filters), for links that jump to them. */
export const TREK_RESULTS_ID = "trek-results";

/** Quick shortcuts above the results; one at a time. */
export const TREK_SHORTCUTS = [
  { value: "popular", label: "Most popular", icon: "star" },
  { value: "short", label: "Under 10 days", icon: "timer" },
  { value: "easy", label: "Easy treks", icon: "health_and_safety" },
  { value: "quiet", label: "Quiet trails", icon: "landscape" },
  { value: "high", label: "Above 5,000 m", icon: "altitude" },
] as const;

export type TrekShortcut = (typeof TREK_SHORTCUTS)[number]["value"];

export const TREK_SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "popular", label: "Most popular" },
  { value: "price", label: "Price: low to high" },
  { value: "duration", label: "Duration: short to long" },
  { value: "altitude", label: "Highest altitude" },
] as const;

export type TrekSort = (typeof TREK_SORTS)[number]["value"];

/** /treks with the given filters, e.g. { length: "6-9" } → "/treks?length=6-9". */
export const treksFilterPath = (filters: Partial<Record<TrekFilterParam, string>>) =>
  `${ROUTES.treks}?${new URLSearchParams(filters).toString()}`;
