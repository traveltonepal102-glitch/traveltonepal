/**
 * Office contact details: the ONE place to change them for every site
 * (TRD: constants in code, not admin settings). Header, footer, buttons and links all read from here.
 */
const PHONE_COUNTRY_CODE = "977"; // Nepal
const PHONE_LOCAL_NUMBER = "9843197197";

type ClockTime = { hour: number; minute: number };

/**
 * When the office is open, in Nepal time (UTC+5:45, no daylight saving). Days: 0 = Sunday … 6 = Saturday.
 * TEMPORARY: from the website design until the owner confirms.
 */
export const OFFICE_SCHEDULE = {
  openDays: [0, 1, 2, 3, 4, 5],
  daysLabel: "Sunday to Friday",
  opens: { hour: 9, minute: 0 },
  closes: { hour: 18, minute: 0 },
} as const satisfies { openDays: readonly number[]; daysLabel: string; opens: ClockTime; closes: ClockTime };

const clock = ({ hour, minute }: ClockTime) => `${hour}:${String(minute).padStart(2, "0")}`;

export const CONTACT = {
  email: "traveltonepal102@gmail.com",
  /** Shown to visitors, e.g. "+977 9843197197". */
  phoneDisplay: `+${PHONE_COUNTRY_CODE} ${PHONE_LOCAL_NUMBER}`,
  /** Digits only with country code, as wa.me and tel: links need it. */
  phoneDigits: `${PHONE_COUNTRY_CODE}${PHONE_LOCAL_NUMBER}`,
  /** Nepal government trekking agency registration number. TEMPORARY: replace with the real one. */
  registrationNumber: "123456",
  /** Trekking Agencies' Association of Nepal membership number. TEMPORARY: replace with the real one. */
  taanMemberNumber: "2345",
  /** TEMPORARY: city only until the street address is confirmed. */
  officeAddress: "Kathmandu, Nepal",
  /** Office opening hours as visitors read them, e.g. "Sunday to Friday, 9:00–18:00 (Nepal time)". */
  officeHours: `${OFFICE_SCHEDULE.daysLabel}, ${clock(OFFICE_SCHEDULE.opens)}–${clock(OFFICE_SCHEDULE.closes)} (Nepal time)`,
} as const;

/** wa.me link that opens a WhatsApp chat with the office, with an optional first message. */
export const getWhatsAppUrl = (message?: string): string => {
  const base = `https://wa.me/${CONTACT.phoneDigits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/** mailto: link to the office, optionally with a subject and body already written. */
export const getEmailUrl = (draft?: { subject?: string; body?: string }): string => {
  // encodeURIComponent, not URLSearchParams: mail apps show URLSearchParams' "+" literally instead of spaces.
  const query = Object.entries(draft ?? {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return query ? `mailto:${CONTACT.email}?${query}` : `mailto:${CONTACT.email}`;
};
