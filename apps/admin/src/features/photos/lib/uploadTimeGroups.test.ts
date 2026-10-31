import { describe, expect, it } from "vitest";

import type { LibraryPhoto } from "../types";
import { daysAgo, groupByUploadTime, isRecent } from "./uploadTimeGroups";

const photo = (id: string, createdAt: string): LibraryPhoto => ({
  id,
  width: 1600,
  height: 1200,
  baseUrl: "",
  variantWidths: [400],
  fileName: null,
  placeholder: "",
  place: "",
  originalName: "",
  byteSize: 1,
  createdAt,
});

// 29 Oct 2026, 15:45 in Nepal (UTC+5:45).
const NOW = new Date("2026-10-29T10:00:00Z");

describe("daysAgo", () => {
  it("counts Nepal dates, not hours", () => {
    expect(daysAgo("2026-10-28T18:15:00Z", NOW)).toBe(0); // 29 Oct, 00:00 in Nepal
    expect(daysAgo("2026-10-28T18:14:00Z", NOW)).toBe(1); // 28 Oct, 23:59 in Nepal
    expect(daysAgo("2026-10-22T10:00:00Z", NOW)).toBe(7);
  });

  it("calls the last 30 days recent", () => {
    expect(isRecent(photo("a", "2026-09-30T10:00:00Z"), NOW)).toBe(true); // 29 days ago
    expect(isRecent(photo("b", "2026-09-29T10:00:00Z"), NOW)).toBe(false); // 30 days ago
  });
});

describe("groupByUploadTime", () => {
  it("groups newest first: today, yesterday, the last 7 and 30 days, then each month", () => {
    const photos = [
      photo("august", "2026-08-15T05:00:00Z"),
      photo("today", "2026-10-29T03:00:00Z"),
      photo("week", "2026-10-25T03:00:00Z"),
      photo("yesterday", "2026-10-28T03:00:00Z"),
      photo("month", "2026-10-10T03:00:00Z"),
      photo("september", "2026-09-02T03:00:00Z"),
      photo("today-later", "2026-10-29T08:00:00Z"),
    ];
    expect(groupByUploadTime(photos, NOW).map((group) => [group.label, group.photos.map((entry) => entry.id)])).toEqual([
      ["Today", ["today-later", "today"]],
      ["Yesterday", ["yesterday"]],
      ["Last 7 days", ["week"]],
      ["Last 30 days", ["month"]],
      ["September 2026", ["september"]],
      ["August 2026", ["august"]],
    ]);
  });

  it("names a month by its Nepal date", () => {
    // 31 Aug 2026, 20:00 UTC is already 1 September in Nepal.
    expect(groupByUploadTime([photo("a", "2026-08-31T20:00:00Z")], NOW)[0].label).toBe("September 2026");
  });
});
