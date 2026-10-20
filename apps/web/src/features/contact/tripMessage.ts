import { SITE_NAME } from "@/lib/site";

export const NOT_SURE_TREK = "Not sure yet, please suggest";
export const CUSTOM_TREK = "Other / custom trek";

export const WHEN_OPTIONS = [
  "Not sure yet",
  "March – May (spring)",
  "June – September (monsoon)",
  "October – November (autumn)",
  "December – February (winter)",
  "I have exact dates",
] as const;

export const GROUP_OPTIONS = ["Just me", "2 people", "3–5 people", "6–10 people", "11+ people"] as const;

/** Longest text we pass on (WhatsApp and mail links get unwieldy beyond these). */
export const MAX_LENGTHS = { name: 80, country: 60, note: 1000 } as const;

export type TripDetails = {
  name: string;
  country: string;
  trek: string;
  when: string;
  group: string;
  note: string;
};

export const EMPTY_TRIP: TripDetails = { name: "", country: "", trek: NOT_SURE_TREK, when: WHEN_OPTIONS[0], group: "2 people", note: "" };

const clean = (text: string, max: number) => text.trim().slice(0, max);

/** The visitor's trip as the message they send us on WhatsApp or by email. */
export const buildTripMessage = (trip: TripDetails): string => {
  const name = clean(trip.name, MAX_LENGTHS.name);
  const country = clean(trip.country, MAX_LENGTHS.country);
  const note = clean(trip.note, MAX_LENGTHS.note);
  const intro = name ? `I am ${name}${country ? ` from ${country}` : ""}.` : "I would like to plan a trek.";

  return [`Hi ${SITE_NAME}! ${intro}`, `Trek: ${trip.trek}`, `When: ${trip.when}`, `Group: ${trip.group}`, ...(note ? ["", note] : [])].join(
    "\n",
  );
};

/** Email subject naming the trek when one is chosen. */
export const tripEmailSubject = (trip: Pick<TripDetails, "trek">) =>
  trip.trek === NOT_SURE_TREK || trip.trek === CUSTOM_TREK ? "Trek enquiry" : `Trek enquiry: ${trip.trek}`;
