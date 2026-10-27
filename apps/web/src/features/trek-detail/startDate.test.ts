import { describe, expect, it } from "vitest";

import type { MonthRating } from "@/features/regions/overviews";

import { dateInMonth, defaultStartDate, endDate, isCalendarDate, lastDayOf, monthIndexOf, nepalToday, startMonths } from "./startDate";

// Langtang, Jan–Dec.
const RATINGS: MonthRating[] = ["possible", "possible", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"];

describe("start date", () => {
  it("knows today in Nepal, which can already be tomorrow elsewhere", () => {
    expect(nepalToday(new Date("2026-10-27T20:00:00Z"))).toBe("2026-10-28");
    expect(nepalToday(new Date("2026-10-27T10:00:00Z"))).toBe("2026-10-27");
  });

  it("offers this month and the next 11, across the new year, with the region's ratings", () => {
    const months = startMonths("2026-10-27", RATINGS);
    expect(months).toHaveLength(12);
    expect(months[0]).toEqual({ year: 2026, month: 9, rating: "best" });
    expect(months[3]).toEqual({ year: 2027, month: 0, rating: "possible" });
    expect(months[11]).toEqual({ year: 2027, month: 8, rating: "possible" });
    expect(startMonths("2026-10-27", null)[0].rating).toBeNull();
  });

  it("opens on the 1st of the first best month after this one", () => {
    expect(defaultStartDate(startMonths("2026-10-27", RATINGS), "2026-10-27")).toBe("2026-11-01");
    expect(defaultStartDate(startMonths("2026-06-10", RATINGS), "2026-06-10")).toBe("2026-10-01");
    expect(defaultStartDate(startMonths("2026-06-10", null), "2026-06-10")).toBe("2026-07-01");
  });

  it("keeps the day when another month is picked, never before today", () => {
    const months = startMonths("2026-10-27", RATINGS);
    expect(dateInMonth("2026-11-30", months[4], "2026-10-27")).toBe("2027-02-28");
    expect(dateInMonth("2026-11-05", months[0], "2026-10-27")).toBe("2026-10-27");
    expect(monthIndexOf(months, "2027-02-28")).toBe(4);
    expect(monthIndexOf(months, "2028-01-01")).toBe(-1);
    expect(lastDayOf(months[11])).toBe("2027-09-30");
  });

  it("ends the trek after its number of days", () => {
    expect(endDate("2026-11-02", 10)).toBe("2026-11-11");
    expect(endDate("2026-12-28", 11)).toBe("2027-01-07");
  });

  it("only takes real calendar days", () => {
    expect(isCalendarDate("2027-02-28")).toBe(true);
    for (const value of ["", "2027-02-30", "2027-13-01", "28/02/2027"]) expect(isCalendarDate(value)).toBe(false);
  });
});
