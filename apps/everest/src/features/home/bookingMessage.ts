import { formatDays } from "@/lib/format";

/** "2026-10-05" → "5. Okt. 2026" (a calendar day: the same for every visitor). */
export const formatStartDate = (date: string) => {
  const day = new Date(`${date}T00:00:00Z`);
  // A date field lets someone type a five-digit year, which isn't a date here: show what they typed.
  if (Number.isNaN(day.getTime())) return date;
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(day);
};

type BookingMessage = { trekName: string; days: number; groupSize: string; startDate: string; name?: string; country?: string; requests?: string };

/** The longest special-requests text we pass on (WhatsApp and mail links get unwieldy beyond this). */
export const MAX_REQUESTS_LENGTH = 1000;

/** The first message on WhatsApp or by email: the trek, the group, the day chosen on the page and what the form adds (no price: it stays on the page). */
export const buildBookingMessage = ({ trekName, days, groupSize, startDate, name, country, requests }: BookingMessage) =>
  [
    `Hallo! Ich möchte den ${trekName} buchen (${formatDays(days)}).`,
    "",
    ...(name?.trim() ? [`Name: ${name.trim()}`] : []),
    ...(country?.trim() ? [`Land: ${country.trim()}`] : []),
    `Gruppengröße: ${groupSize}`,
    ...(startDate ? [`Startdatum: ${formatStartDate(startDate)}`] : []),
    ...(requests?.trim() ? [`Besondere Wünsche: ${requests.trim().slice(0, MAX_REQUESTS_LENGTH)}`] : []),
  ].join("\n");
