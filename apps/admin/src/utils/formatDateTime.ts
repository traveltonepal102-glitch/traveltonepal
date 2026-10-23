/** The team works in Nepal, so admin times are Nepal time whatever the server's time zone. */
const ADMIN_TIME_ZONE = "Asia/Kathmandu";

const DATE_TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: ADMIN_TIME_ZONE,
});

/** "2026-10-23T05:47:00Z" → "23 Oct, 11:32" (Nepal time). */
export const formatDateTime = (isoDate: string) => DATE_TIME.format(new Date(isoDate));
