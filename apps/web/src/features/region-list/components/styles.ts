import type { RegionDifficulty } from "@/features/regions/overviews";

export const WRAP = "mx-auto w-full max-w-content px-4 md:px-6";

export const CARD = "rounded-lg border border-line bg-surface shadow-card";

/** Difficulty chip colors, from the design system (easy green → strenuous red). */
export const DIFFICULTY_CHIPS: Record<RegionDifficulty, string> = {
  Easy: "bg-green-tint text-whatsapp",
  "Easy–moderate": "bg-green-tint text-whatsapp",
  Moderate: "bg-brand-tint text-navy",
  "Easy–challenging": "bg-brand-tint text-navy",
  Challenging: "bg-saffron-tint text-saffron-ink",
  Strenuous: "bg-danger-tint text-danger",
};

export const DIFFICULTY_CHIP = "inline-flex rounded-full px-2.5 py-0.75 text-xs font-bold whitespace-nowrap";

/** Primary and secondary actions on region cards. */
export const PRIMARY_ACTION =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand px-3 font-bold text-on-brand hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
export const SECONDARY_ACTION =
  "inline-flex min-h-11 flex-none items-center justify-center gap-1.5 rounded-md px-3.5 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
