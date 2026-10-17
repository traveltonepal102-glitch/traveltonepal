import { ROUTES } from "@/lib/routes";

/**
 * Trek filters, shared by the home trek finder, the header Treks menu and (later) the Treks
 * listing page, so a link like /treks?length=short means the same thing everywhere.
 */
export type TrekFilterParam = "region" | "length" | "season" | "style";

export const TREK_LENGTHS = [
  { value: "short", label: "Up to 9 days" },
  { value: "classic", label: "10–15 days" },
  { value: "long", label: "16+ days" },
] as const;

export type TrekLength = (typeof TREK_LENGTHS)[number]["value"];

export const TREK_SEASONS = [
  { value: "spring", label: "Spring · Mar–May" },
  { value: "autumn", label: "Autumn · Sep–Nov" },
  { value: "winter", label: "Winter · Dec–Feb" },
] as const;

/** /treks with the given filters, e.g. { length: "short" } → "/treks?length=short". */
export const treksFilterPath = (filters: Partial<Record<TrekFilterParam, string>>) =>
  `${ROUTES.treks}?${new URLSearchParams(filters).toString()}`;
