/** Today in Nepal, as a date field's value ("2026-11-06"). */
export const todayInNepal = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(now);
