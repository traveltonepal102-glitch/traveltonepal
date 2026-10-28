import { describe, expect, it } from "vitest";

import { reviewAge } from "./reviewAge";

const NOW = new Date("2026-10-28T09:00:00Z");

describe("reviewAge", () => {
  it("says it the way Google does", () => {
    expect(reviewAge("2026-10-28", NOW)).toBe("today");
    expect(reviewAge("2026-10-27", NOW)).toBe("a day ago");
    expect(reviewAge("2026-10-24", NOW)).toBe("4 days ago");
    expect(reviewAge("2026-10-20", NOW)).toBe("a week ago");
    expect(reviewAge("2026-10-07", NOW)).toBe("3 weeks ago");
    expect(reviewAge("2026-09-20", NOW)).toBe("a month ago");
    expect(reviewAge("2026-05-28", NOW)).toBe("5 months ago");
    expect(reviewAge("2025-10-01", NOW)).toBe("a year ago");
    expect(reviewAge("2023-06-01", NOW)).toBe("3 years ago");
  });

  it("reads a future or broken date as today", () => {
    expect(reviewAge("2026-12-01", NOW)).toBe("today");
    expect(reviewAge("not a date", NOW)).toBe("today");
  });
});
