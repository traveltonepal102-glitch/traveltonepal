import { describe, expect, it } from "vitest";

import type { MonthRating } from "@/lib/supabase/database.types";

import { routeMonthRatings } from "./routeMonths";

const region = (id: string, monthRatings: MonthRating[]) => ({ id, name: id, monthRatings });
const months = (first: MonthRating[], rest: MonthRating) => [...first, ...Array<MonthRating>(12 - first.length).fill(rest)];

describe("routeMonthRatings", () => {
  it("rates each month as the worst region on the route", () => {
    const langtang = region("langtang", months(["best", "best", "possible"], "best"));
    const manaslu = region("manaslu", months(["possible", "avoid", "best"], "best"));
    expect(routeMonthRatings([langtang, manaslu])?.slice(0, 4)).toEqual(["possible", "avoid", "possible", "best"]);
  });

  it("keeps one region's months, and has none without a region", () => {
    const only = region("langtang", months(["avoid"], "best"));
    expect(routeMonthRatings([only])).toEqual(only.monthRatings);
    expect(routeMonthRatings([])).toBeNull();
  });
});
