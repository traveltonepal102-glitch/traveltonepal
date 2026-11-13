import { describe, expect, it } from "vitest";

import { todayInNepal } from "./startDate";

describe("today in Nepal", () => {
  it("is the day in Nepal, not the visitor's or the server's", () => {
    // 20:00 in London is already tomorrow in Kathmandu (UTC+5:45).
    expect(todayInNepal(new Date("2026-11-06T20:00:00Z"))).toBe("2026-11-07");
    expect(todayInNepal(new Date("2026-11-06T17:00:00Z"))).toBe("2026-11-06");
  });
});
