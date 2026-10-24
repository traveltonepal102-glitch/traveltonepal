import { describe, expect, it } from "vitest";

import type { DepartureItem } from "../types";
import { planDates, seasonsWithDates } from "./repeatPlan";

const date = (startDate: string, note = ""): DepartureItem => ({ id: startDate, trekId: "t", startDate, status: "open", note, specialPriceUsd: null, teamNote: "" });
const TREK_DATES = [date("2026-11-02", "4 places left"), date("2026-11-16"), date("2027-03-18", "Spring bloom")];
const PATTERN = { from: "2026-10-30", until: "2026-11-20", weekday: 1, everyDays: 7 } as const;

describe("repeat plan", () => {
  it("lists the trek's seasons with dates, newest first", () => {
    expect(seasonsWithDates(TREK_DATES).map((season) => `${season.label} (${season.count})`)).toEqual(["Spring (Mar–May) 2027 (1)", "Autumn (Sep–Nov) 2026 (2)"]);
  });

  it("marks pattern dates the trek already has, and ones in the same week", () => {
    expect(planDates("pattern", PATTERN, "", TREK_DATES)).toEqual([
      { startDate: "2026-11-02", note: "", clash: "same_day" },
      { startDate: "2026-11-09", note: "", clash: null },
      { startDate: "2026-11-16", note: "", clash: "same_day" },
    ]);
    expect(planDates("pattern", { ...PATTERN, weekday: 3 }, "", TREK_DATES)[0]).toEqual({ startDate: "2026-11-04", note: "", clash: "same_week" });
  });

  it("copies a season one year on, on the same weekday, with its notes", () => {
    expect(planDates("copy", PATTERN, "2026-autumn", TREK_DATES)).toEqual([
      { startDate: "2027-11-01", note: "4 places left", clash: null },
      { startDate: "2027-11-15", note: "", clash: null },
    ]);
  });
});
