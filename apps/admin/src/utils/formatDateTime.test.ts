import { describe, expect, it } from "vitest";

import { todayInNepal } from "./formatDateTime";

describe("todayInNepal", () => {
  it("is the date in Nepal (UTC+5:45), not the server's", () => {
    // 20:00 UTC on 23 Oct is already 01:45 on 24 Oct in Kathmandu.
    expect(todayInNepal(new Date("2026-10-23T20:00:00Z"))).toBe("2026-10-24");
    expect(todayInNepal(new Date("2026-10-23T06:00:00Z"))).toBe("2026-10-23");
  });
});
