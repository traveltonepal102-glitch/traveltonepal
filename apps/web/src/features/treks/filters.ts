import { ROUTES } from "@/lib/routes";

/**
 * Trek filters, shared by the home trek finder, the header Treks menu and the Treks page, so a
 * link like /treks?length=short means the same thing everywhere. Values are the URL values.
 */
export type TrekFilterParam = "q" | "region" | "length" | "difficulty" | "season" | "fixed" | "show" | "sort";

export const TREK_LENGTHS = [
  { value: "short", label: "Up to 9 days", maxDays: 9 },
  { value: "classic", label: "10–15 days", maxDays: 15 },
  { value: "long", label: "16+ days", maxDays: Infinity },
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

/** /treks with the given filters, e.g. { length: "short" } → "/treks?length=short". */
export const treksFilterPath = (filters: Partial<Record<TrekFilterParam, string>>) =>
  `${ROUTES.treks}?${new URLSearchParams(filters).toString()}`;
