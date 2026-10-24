/**
 * Calendar days as "YYYY-MM-DD", worked out in UTC so no time zone can move a date by a day. A departure is
 * a day in Nepal, not a moment in time.
 */

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const toTime = (isoDate: string) => Date.parse(`${isoDate}T00:00:00Z`);
const toIso = (time: number) => new Date(time).toISOString().slice(0, 10);

export const addDays = (isoDate: string, days: number) => toIso(toTime(isoDate) + days * DAY_MS);

/** The last day of a trek that starts on `startDate` and lasts `days` days. */
export const endDate = (startDate: string, days: number) => addDays(startDate, Math.max(days, 1) - 1);

/** 0 = Sunday … 6 = Saturday. */
export const weekdayOf = (isoDate: string) => new Date(toTime(isoDate)).getUTCDay();

export const WEEKDAY_LABELS = WEEKDAYS;

/** { weekday: "Sat", day: "28", month: "Nov", year: "2026" } for the date block on each row. */
export const dayParts = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return { weekday: WEEKDAYS[weekdayOf(isoDate)], day: String(Number(day)), month: MONTHS[Number(month) - 1], year };
};

/** "Nov 28" */
export const formatShort = (isoDate: string) => {
  const { day, month } = dayParts(isoDate);
  return `${month} ${day}`;
};

/** "Sat, Nov 28, 2026" */
export const formatLong = (isoDate: string) => {
  const { weekday, year } = dayParts(isoDate);
  return `${weekday}, ${formatShort(isoDate)}, ${year}`;
};

/** "2026-11" → "November 2026" */
export const monthTitle = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

/** One year later on the same weekday (52 weeks), so a Saturday start stays a Saturday. */
export const nextYearSameWeekday = (isoDate: string) => addDays(isoDate, 364);

export const MAX_REPEATED_DATES = 60;

export type RepeatPattern = { from: string; until: string; weekday: number; everyDays: 7 | 14 | 28 };

/** Every `everyDays` days on `weekday`, from the first such day on or after `from`, up to `until` (at most 60). */
export const repeatDates = ({ from, until, weekday, everyDays }: RepeatPattern): string[] => {
  if (!from || !until || from > until) return [];
  const first = addDays(from, (weekday - weekdayOf(from) + 7) % 7);
  const dates: string[] = [];
  for (let date = first; date <= until && dates.length < MAX_REPEATED_DATES; date = addDays(date, everyDays)) dates.push(date);
  return dates;
};

export type Season = "spring" | "monsoon" | "autumn" | "winter";

const SEASON_LABELS: Record<Season, string> = { spring: "Spring (Mar–May)", monsoon: "Monsoon (Jun–Aug)", autumn: "Autumn (Sep–Nov)", winter: "Winter (Dec–Feb)" };

/** "2026-12-05" → winter 2026 (December starts the winter of its year, January and February belong to it). */
export const seasonOf = (isoDate: string): { key: string; label: string } => {
  const [yearText, monthText] = isoDate.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (month >= 3 && month <= 5) return { key: `${year}-spring`, label: `${SEASON_LABELS.spring} ${year}` };
  if (month >= 6 && month <= 8) return { key: `${year}-monsoon`, label: `${SEASON_LABELS.monsoon} ${year}` };
  if (month >= 9 && month <= 11) return { key: `${year}-autumn`, label: `${SEASON_LABELS.autumn} ${year}` };
  const winterYear = month === 12 ? year : year - 1;
  return { key: `${winterYear}-winter`, label: `${SEASON_LABELS.winter} ${winterYear}/${String(winterYear + 1).slice(2)}` };
};

/** How a new date sits next to the trek's existing ones: on the same day (it would be skipped), the same week, or free. */
export const clashWith = (isoDate: string, existing: string[]): "same_day" | "same_week" | null => {
  if (existing.includes(isoDate)) return "same_day";
  const time = toTime(isoDate);
  return existing.some((other) => Math.abs(toTime(other) - time) < 7 * DAY_MS) ? "same_week" : null;
};
