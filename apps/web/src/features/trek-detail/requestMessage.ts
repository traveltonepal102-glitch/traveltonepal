import { z } from "zod";

/** Seasons offered instead of the chosen start day (no years: they never go stale). */
export const SEASON_OPTIONS = [
  "Spring (March – May)",
  "Autumn (October – November)",
  "Winter (December – February)",
  "My own dates",
  "Not sure yet",
] as const;

/** The longest special-requests text we pass on (WhatsApp and mail links get unwieldy beyond this). */
export const MAX_REQUESTS_LENGTH = 1000;

/** What the visitor types into a booking request form (group size and timing come from the page's selection). */
export const trekRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  country: z.string().trim().max(60, "Please keep the country under 60 characters."),
  requests: z.string().trim().max(MAX_REQUESTS_LENGTH, `Please keep your requests under ${MAX_REQUESTS_LENGTH} characters.`),
});

export type TrekRequestFields = z.infer<typeof trekRequestSchema>;

export type TrekRequest = TrekRequestFields & {
  trekName: string;
  days: number;
  /** e.g. "3–5 people ($890 per person)". */
  groupSize: string;
  /** e.g. "Start Nov 02, 2026" or "Spring (March – May)". */
  timing: string;
};

/** "Check this date on WhatsApp": the trek, the chosen start day and group size, before any form is filled in. */
export const buildDateCheckMessage = ({ trekName, days, groupSize, startDate }: Pick<TrekRequest, "trekName" | "days" | "groupSize"> & { startDate: string }) =>
  [`Hello! Can I start the ${trekName} (${days} days) on ${startDate}?`, "", `Group size: ${groupSize}`].join("\n");

/** The booking request as the message the visitor sends us on WhatsApp or by email. */
export const buildTrekRequestMessage = ({ trekName, days, name, country, groupSize, timing, requests }: TrekRequest): string => {
  const extra = requests.trim().slice(0, MAX_REQUESTS_LENGTH);
  return [
    `Hello! I would like to book the ${trekName} (${days} days).`,
    "",
    `Name: ${name.trim()}`,
    ...(country.trim() ? [`Country: ${country.trim()}`] : []),
    `Group size: ${groupSize}`,
    `Preferred time: ${timing}`,
    ...(extra ? [`Special requests: ${extra}`] : []),
  ].join("\n");
};
