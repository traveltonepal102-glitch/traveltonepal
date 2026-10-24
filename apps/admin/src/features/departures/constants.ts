import { ADMIN_SECTIONS } from "@/features/shell/navigation";

export const DEPARTURES_PATH = ADMIN_SECTIONS.departures.href;
/** Opens the screen with "Add date" open (the top bar's New menu). */
export const NEW_DEPARTURE_PATH = `${DEPARTURES_PATH}?add=1`;

/** The admin edits English notes for now; German comes later (trek_departure_translations.locale). */
export const DEPARTURE_LOCALE = "en";

/** Hard limits, the same as the database checks (the note's limit is the trek editor's, PRICE_LIMITS.note). */
export const DEPARTURE_LIMITS = { teamNote: 200 } as const;

/** "How often" when repeating dates (design: Repeat dates). */
export const REPEAT_FREQUENCIES = [
  { value: 7, label: "Every week" },
  { value: 14, label: "Every 2 weeks" },
  { value: 28, label: "Every 4 weeks" },
] as const;
