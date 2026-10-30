/**
 * Office contact links and the shape of the contact details. The details themselves (number, email, address, hours)
 * are typed once in the admin's Site settings (decided 2026-10-26, replacing the TRD's "constants in code").
 *
 * Links go through the website's own /whatsapp and /email addresses, which look up today's number and email in Site
 * settings and send the visitor on. So a link built anywhere, in any component, never holds an old number.
 */

export type ClockTime = { hour: number; minute: number };

/** When the office is open, in Nepal time (UTC+5:45, no daylight saving). Days: 0 = Sunday … 6 = Saturday. */
export type OfficeSchedule = {
  openDays: readonly number[];
  /** e.g. "Sunday to Friday". */
  daysLabel: string;
  opens: ClockTime;
  closes: ClockTime;
};

/** The contact details every page shows (from Site settings). */
export type ContactDetails = {
  email: string;
  /** Shown to visitors, e.g. "+977 9843197197". */
  phoneDisplay: string;
  /** Digits only with country code, as wa.me and tel: links need it. */
  phoneDigits: string;
  officeAddress: string;
  /** e.g. "Sunday to Friday, 9:00–18:00 (Nepal time)". */
  officeHours: string;
  /** Department of Tourism registration; empty until it is typed in Site settings. */
  registrationNumber: string;
  /** TAAN membership; empty until it is typed in Site settings. */
  taanMemberNumber: string;
};

/** The website's addresses that redirect to WhatsApp and email (app/whatsapp, app/email). */
export const WHATSAPP_PATH = "/whatsapp";
export const EMAIL_PATH = "/email";

/**
 * True for a /whatsapp or /email link. They redirect to wa.me and mailto:, so they must be plain <a> links: Next's
 * <Link> prefetches the redirect (a console error, and Lighthouse's "Does not use HTTPS" for the mailto:).
 */
export const isContactRedirect = (href: string): boolean => [EMAIL_PATH, WHATSAPP_PATH].some((path) => href === path || href.startsWith(`${path}?`));

/** Link that opens a WhatsApp chat with the office, with an optional first message. */
export const getWhatsAppUrl = (message?: string): string => (message ? `${WHATSAPP_PATH}?${new URLSearchParams({ text: message })}` : WHATSAPP_PATH);

/** Link that opens an email to the office, optionally with a subject and body already written. */
export const getEmailUrl = (draft?: { subject?: string; body?: string }): string => {
  const query = new URLSearchParams(Object.entries(draft ?? {}).filter((entry): entry is [string, string] => Boolean(entry[1])));
  return query.size ? `${EMAIL_PATH}?${query}` : EMAIL_PATH;
};

/** The real WhatsApp chat link for a number (what /whatsapp redirects to). */
export const whatsAppChatUrl = (phoneDigits: string, message?: string): string => {
  const base = `https://wa.me/${phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** The real mailto: link for an address (what /email redirects to). */
export const mailtoUrl = (email: string, draft?: { subject?: string; body?: string }): string => {
  // encodeURIComponent, not URLSearchParams: mail apps show URLSearchParams' "+" literally instead of spaces.
  const query = Object.entries(draft ?? {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value ?? "")}`)
    .join("&");
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Sunday to Friday" for days in a row (Nepal's week starts on Sunday), else "Sunday, Tuesday and Friday". */
export const officeDaysLabel = (days: readonly number[]): string => {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  if (sorted.length === 7) return "Every day";
  const isRun = sorted.every((day, index) => index === 0 || day === (sorted[index - 1] ?? 0) + 1);
  const names = sorted.map((day) => DAY_NAMES[day] ?? "");
  if (isRun && names.length > 2) return `${names[0]} to ${names[names.length - 1]}`;
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : (names[0] ?? "");
};

const clock = ({ hour, minute }: ClockTime) => `${hour}:${String(minute).padStart(2, "0")}`;

/** "Sunday to Friday, 9:00–18:00 (Nepal time)". */
export const officeHoursLabel = (schedule: OfficeSchedule): string => `${schedule.daysLabel}, ${clock(schedule.opens)}–${clock(schedule.closes)} (Nepal time)`;
