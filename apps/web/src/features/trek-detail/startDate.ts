import type { MonthRating } from "@/features/regions/overviews";

/**
 * Choosing a start date (design: Trek, "Choose your own start date"). There are no fixed departures: a trek starts on
 * any day from today on, in Nepal time. Dates are "YYYY-MM-DD" calendar days.
 */

/** One of the next 12 months, from this month on; `rating`: the region's verdict, null when it has none. */
export type StartMonth = { year: number; month: number; rating: MonthRating | null };

const MONTHS_SHOWN = 12;

const pad = (value: number) => String(value).padStart(2, "0");

/** year, month 0–11, day → "2026-11-02" */
export const isoDate = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

const partsOf = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month: month - 1, day };
};

const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

/** Today in Nepal, where every trek starts. */
export const nepalToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Kathmandu" }).format(now);

/** A real calendar day, "YYYY-MM-DD" (what a date field gives, or empty while it is cleared). */
export const isCalendarDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const { year, month, day } = partsOf(value);
  return month >= 0 && month < 12 && day >= 1 && day <= daysInMonth(year, month);
};

/** This month and the 11 after it, each with the region's rating (Jan–Dec ratings; none without 12). */
export const startMonths = (today: string, ratings: readonly MonthRating[] | null): StartMonth[] => {
  const { year, month } = partsOf(today);
  return Array.from({ length: MONTHS_SHOWN }, (_, index) => {
    const at = month + index;
    const monthOfYear = at % 12;
    return { year: year + Math.floor(at / 12), month: monthOfYear, rating: ratings?.length === 12 ? ratings[monthOfYear] : null };
  });
};

/** The month's last day, e.g. the latest start the picker offers. */
export const lastDayOf = (month: StartMonth) => isoDate(month.year, month.month, daysInMonth(month.year, month.month));

/** The position of the month a date falls in, or -1 past the months shown. */
export const monthIndexOf = (months: readonly StartMonth[], date: string) => {
  const { year, month } = partsOf(date);
  return months.findIndex((item) => item.year === year && item.month === month);
};

const notBefore = (date: string, today: string) => (date < today ? today : date);

/** The date the picker opens on: the 1st of the first best month from next month on (else next month). */
export const defaultStartDate = (months: readonly StartMonth[], today: string) => {
  const later = months.slice(1);
  const month = later.find((item) => item.rating === "best") ?? later[0] ?? months[0];
  return month ? notBefore(isoDate(month.year, month.month, 1), today) : today;
};

/** Picking a month keeps the chosen day (the month's last day when it is shorter), never before today. */
export const dateInMonth = (current: string, month: StartMonth, today: string) => {
  const day = Math.min(partsOf(current).day, daysInMonth(month.year, month.month));
  return notBefore(isoDate(month.year, month.month, day), today);
};

/** The last day of the trek: the start plus the trek's days, less one. */
export const endDate = (start: string, days: number) => {
  const { year, month, day } = partsOf(start);
  return new Date(Date.UTC(year, month, day + Math.max(days, 1) - 1)).toISOString().slice(0, 10);
};
