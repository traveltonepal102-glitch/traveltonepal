import type { OfficeSchedule } from "@ttn/config/contact";
import { officeHoursLabel } from "@ttn/config/contact";
import { describe, expect, it } from "vitest";

import { isOfficeOpen, officeHoursAbroad, officeHoursIn } from "./officeHours";

/** Sunday to Friday, 9:00–18:00 Nepal time (the office's hours in Site settings). */
const SCHEDULE: OfficeSchedule = {
  openDays: [0, 1, 2, 3, 4, 5],
  daysLabel: "Sunday to Friday",
  opens: { hour: 9, minute: 0 },
  closes: { hour: 18, minute: 0 },
};

/** A Nepal local time as a Date (Nepal is UTC+5:45). */
const nepal = (iso: string) => new Date(`${iso}+05:45`);

describe("isOfficeOpen", () => {
  it("is open on a Sunday morning and a Friday afternoon in Nepal", () => {
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-18T09:00"))).toBe(true); // Sunday
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-23T17:59"))).toBe(true); // Friday
  });

  it("is closed before 9:00, from 18:00 and all Saturday", () => {
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-19T08:59"))).toBe(false);
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-19T18:00"))).toBe(false);
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-24T12:00"))).toBe(false); // Saturday
  });

  it("uses Nepal's day even when it is still the day before in UTC", () => {
    // 05:00 Monday in Nepal is 23:15 Sunday UTC: closed (too early), and not mistaken for Sunday 23:15.
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-19T05:00"))).toBe(false);
    // 10:00 Sunday in Nepal is 04:15 Sunday UTC.
    expect(isOfficeOpen(SCHEDULE, nepal("2026-10-18T10:00"))).toBe(true);
  });

  it("follows the open days and hours saved in Settings", () => {
    const saturdayOnly = { ...SCHEDULE, openDays: [6], opens: { hour: 10, minute: 30 } };
    expect(isOfficeOpen(saturdayOnly, nepal("2026-10-24T10:30"))).toBe(true);
    expect(isOfficeOpen(saturdayOnly, nepal("2026-10-24T10:29"))).toBe(false);
    expect(isOfficeOpen(saturdayOnly, nepal("2026-10-18T12:00"))).toBe(false);
  });
});

describe("office hours abroad", () => {
  it("shows the hours in the visitor's summer and winter time", () => {
    expect(
      officeHoursAbroad(SCHEDULE, [
        { place: "Germany (Berlin)", timeZone: "Europe/Berlin" },
        { place: "United Kingdom (London)", timeZone: "Europe/London" },
        { place: "USA (New York)", timeZone: "America/New_York" },
      ]),
    ).toEqual([
      { place: "Germany (Berlin)", summer: "05:15 – 14:15", winter: "04:15 – 13:15" },
      { place: "United Kingdom (London)", summer: "04:15 – 13:15", winter: "03:15 – 12:15" },
      { place: "USA (New York)", summer: "23:15 – 08:15", winter: "22:15 – 07:15" },
    ]);
  });

  it("is the same clock time in Kathmandu", () => {
    expect(officeHoursIn(SCHEDULE, "Asia/Kathmandu", new Date(Date.UTC(2026, 6, 15)))).toBe("09:00 – 18:00");
  });

  it("matches the hours text visitors read", () => {
    expect(officeHoursLabel(SCHEDULE)).toBe("Sunday to Friday, 9:00–18:00 (Nepal time)");
  });
});
