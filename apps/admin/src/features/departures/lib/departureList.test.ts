import { describe, expect, it } from "vitest";

import type { DepartureItem } from "../types";
import { NO_DEPARTURE_FILTERS, countByStatus, groupDepartures, isMainSeason, treksWithUpcomingDates } from "./departureList";

const TODAY = "2026-10-24";
const item = (id: string, trekId: string, startDate: string, status: DepartureItem["status"] = "open"): DepartureItem => ({
  id,
  trekId,
  startDate,
  status,
  note: "",
  specialPriceUsd: null,
  teamNote: "",
});

const DATES = [
  item("past", "langtang", "2026-09-26", "full"),
  item("today", "langtang", TODAY, "guaranteed"),
  item("nov", "everest", "2026-11-16", "almost_full"),
  item("nov-early", "langtang", "2026-11-02", "guaranteed"),
  item("mar", "langtang", "2027-03-18"),
];

const ids = (groups: ReturnType<typeof groupDepartures>) => groups.map((group) => `${group.title}: ${group.departures.map((d) => d.id).join(",")}`);

describe("departure list", () => {
  it("groups upcoming dates by month in date order; a date starting today is still upcoming", () => {
    expect(ids(groupDepartures(DATES, NO_DEPARTURE_FILTERS, TODAY))).toEqual(["October 2026: today", "November 2026: nov-early,nov", "March 2027: mar"]);
  });

  it("filters by trek and status, and shows past dates first when asked", () => {
    expect(ids(groupDepartures(DATES, { trekId: "everest", status: "all", showPast: false }, TODAY))).toEqual(["November 2026: nov"]);
    expect(ids(groupDepartures(DATES, { trekId: "", status: "guaranteed", showPast: false }, TODAY))).toEqual(["October 2026: today", "November 2026: nov-early"]);
    expect(ids(groupDepartures(DATES, { trekId: "langtang", status: "all", showPast: true }, TODAY))[0]).toBe("Past dates: past");
  });

  it("counts upcoming dates by status and the treks that have them", () => {
    expect(countByStatus(DATES, TODAY)).toEqual({ all: 4, guaranteed: 2, open: 1, almost_full: 1, full: 0 });
    expect(treksWithUpcomingDates(DATES, TODAY)).toBe(2);
    expect(isMainSeason("2026-10")).toBe(true);
    expect(isMainSeason("2026-07")).toBe(false);
  });
});
