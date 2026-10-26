import type { OfficeSchedule } from "@ttn/config/contact";

import type { VisitorZone } from "./types";

/** Nepal is UTC+5:45 all year (no daylight saving). */
const NEPAL_UTC_OFFSET_MINUTES = 5 * 60 + 45;
const MINUTES_PER_DAY = 24 * 60;

const minutesOf = ({ hour, minute }: { hour: number; minute: number }) => hour * 60 + minute;

/** True while the Kathmandu office is open (by Nepal time, whatever the visitor's time zone). */
export const isOfficeOpen = (schedule: OfficeSchedule, now: Date): boolean => {
  const nepalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes() + NEPAL_UTC_OFFSET_MINUTES;
  const weekday = (now.getUTCDay() + Math.floor(nepalMinutes / MINUTES_PER_DAY)) % 7;
  const minuteOfDay = nepalMinutes % MINUTES_PER_DAY;
  return (
    schedule.openDays.some((day) => day === weekday) &&
    minuteOfDay >= minutesOf(schedule.opens) &&
    minuteOfDay < minutesOf(schedule.closes)
  );
};

/** A Nepal clock time on a given day, as the UTC instant it is. */
const nepalTimeOn = (day: Date, time: { hour: number; minute: number }) =>
  new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, minutesOf(time) - NEPAL_UTC_OFFSET_MINUTES));

/** The office hours in another time zone on a given day, e.g. "05:15 – 14:15" in Berlin in summer. */
export const officeHoursIn = (schedule: OfficeSchedule, timeZone: string, day: Date): string => {
  const format = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${format.format(nepalTimeOn(day, schedule.opens))} – ${format.format(nepalTimeOn(day, schedule.closes))}`;
};

export type TimeZoneRow = { place: string; summer: string; winter: string };

// Any year works: these days only pick summer or winter time, whose offsets are the same every year.
// (Fixed, not today's date, so the page can be prerendered.)
const SUMMER_DAY = new Date(Date.UTC(2026, 6, 15));
const WINTER_DAY = new Date(Date.UTC(2026, 0, 15));

/** Office hours in each place, in its summer time and winter time. */
export const officeHoursAbroad = (schedule: OfficeSchedule, zones: readonly VisitorZone[]): TimeZoneRow[] =>
  zones.map(({ place, timeZone }) => ({
    place,
    summer: officeHoursIn(schedule, timeZone, SUMMER_DAY),
    winter: officeHoursIn(schedule, timeZone, WINTER_DAY),
  }));
