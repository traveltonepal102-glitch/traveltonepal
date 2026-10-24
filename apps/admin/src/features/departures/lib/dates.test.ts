import { describe, expect, it } from "vitest";

import { addDays, clashWith, dayParts, endDate, formatLong, monthTitle, nextYearSameWeekday, repeatDates, seasonOf, weekdayOf } from "./dates";

describe("dates", () => {
  it("adds days across months and years, and finds the end of a trek", () => {
    expect(addDays("2026-11-28", 9)).toBe("2026-12-07");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(endDate("2026-11-28", 10)).toBe("2026-12-07");
    expect(endDate("2026-11-28", 1)).toBe("2026-11-28");
  });

  it("writes dates as the screen shows them", () => {
    expect(dayParts("2026-11-28")).toEqual({ weekday: "Sat", day: "28", month: "Nov", year: "2026" });
    expect(formatLong("2026-11-02")).toBe("Mon, Nov 2, 2026");
    expect(monthTitle("2027-03")).toBe("March 2027");
  });

  it("moves a date one year on, on the same weekday", () => {
    expect(nextYearSameWeekday("2026-11-28")).toBe("2027-11-27");
    expect(weekdayOf(nextYearSameWeekday("2026-11-28"))).toBe(weekdayOf("2026-11-28"));
  });

  it("repeats a weekday every one, two or four weeks between two days", () => {
    expect(repeatDates({ from: "2027-10-01", until: "2027-11-30", weekday: 6, everyDays: 14 })).toEqual(["2027-10-02", "2027-10-16", "2027-10-30", "2027-11-13", "2027-11-27"]);
    expect(repeatDates({ from: "2027-10-02", until: "2027-10-02", weekday: 6, everyDays: 7 })).toEqual(["2027-10-02"]);
    expect(repeatDates({ from: "2027-11-30", until: "2027-10-01", weekday: 6, everyDays: 7 })).toEqual([]);
    expect(repeatDates({ from: "2027-01-01", until: "2029-12-31", weekday: 1, everyDays: 7 })).toHaveLength(60);
  });

  it("names the season, with January and February in the winter that started in December", () => {
    expect(seasonOf("2026-10-12").label).toBe("Autumn (Sep–Nov) 2026");
    expect(seasonOf("2026-12-05").key).toBe(seasonOf("2027-02-10").key);
    expect(seasonOf("2027-02-10").label).toBe("Winter (Dec–Feb) 2026/27");
  });

  it("spots a date on the same day or in the same week as an existing one", () => {
    expect(clashWith("2026-11-02", ["2026-11-02"])).toBe("same_day");
    expect(clashWith("2026-11-07", ["2026-11-02"])).toBe("same_week");
    expect(clashWith("2026-11-09", ["2026-11-02"])).toBeNull();
  });
});
