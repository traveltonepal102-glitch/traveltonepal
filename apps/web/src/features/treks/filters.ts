import { ROUTES } from "@/lib/routes";

/**
 * Trek filters, shared by the home trek finder, the header Treks menu and the Treks page, so a
 * link like /treks?length=9 means the same thing everywhere. Values are the URL values.
 */
export type TrekFilterParam = "q" | "region" | "length" | "difficulty" | "season" | "show" | "sort";

/**
 * "How long": the longest trek to show, so "Up to 5 days" shows 1–5 days (one choice at a time), or the long ones.
 * The URL value is the number of days, e.g. /treks?length=5.
 */
export const TREK_LENGTHS = [
  { value: "1", label: "Up to 1 day", minDays: 1, maxDays: 1 },
  { value: "3", label: "Up to 3 days", minDays: 1, maxDays: 3 },
  { value: "5", label: "Up to 5 days", minDays: 1, maxDays: 5 },
  { value: "7", label: "Up to 7 days", minDays: 1, maxDays: 7 },
  { value: "9", label: "Up to 9 days", minDays: 1, maxDays: 9 },
  { value: "11", label: "Up to 11 days", minDays: 1, maxDays: 11 },
  { value: "13", label: "Up to 13 days", minDays: 1, maxDays: 13 },
  { value: "15", label: "Up to 15 days", minDays: 1, maxDays: 15 },
  { value: "16plus", label: "16+ days", minDays: 16, maxDays: Infinity },
] as const;

export type TrekLength = (typeof TREK_LENGTHS)[number]["value"];

export const TREK_SEASONS = [
  { value: "spring", label: "Spring · Mar–May" },
  { value: "autumn", label: "Autumn · Sep–Nov" },
  { value: "winter", label: "Winter · Dec–Feb" },
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

/** /treks with the given filters, e.g. { length: "9" } → "/treks?length=9". */
export const treksFilterPath = (filters: Partial<Record<TrekFilterParam, string>>) =>
  `${ROUTES.treks}?${new URLSearchParams(filters).toString()}`;
