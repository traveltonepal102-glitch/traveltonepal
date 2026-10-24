/** The team works in Nepal, so admin times are Nepal time whatever the server's time zone. */
const ADMIN_TIME_ZONE = "Asia/Kathmandu";

const DATE_TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: ADMIN_TIME_ZONE,
});

/** "2026-10-23T05:47:00Z" → "23 Oct, 11:32" (Nepal time: say so where it is shown, e.g. "… Nepal time"). */
export const formatDateTime = (isoDate: string) => DATE_TIME.format(new Date(isoDate));

/**
 * Today in Nepal as "YYYY-MM-DD" (en-CA writes dates that way), e.g. to tell past departure dates.
 * Departure dates are Nepal dates (the day the trek starts in Kathmandu), shown the same to everyone and never
 * converted to the viewer's time zone, like a flight's date at its departure airport.
 */
export const todayInNepal = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: ADMIN_TIME_ZONE }).format(now);

const CALENDAR_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** A Nepal calendar date "2026-10-12" → "12 Oct 2026", as it is (dates are never converted to a time zone). */
export const formatCalendarDate = (date: string) => CALENDAR_DATE.format(new Date(`${date}T00:00:00Z`));
