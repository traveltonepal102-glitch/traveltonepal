import { describe, expect, it } from "vitest";

import { formatAltitude, formatAltitudeWithFeet, formatDistance, formatTripDate, formatUsd } from "./format";

describe("trek formatting", () => {
  it("formats altitude in meters, with feet when asked", () => {
    expect(formatAltitude(4773)).toBe("4,773 m");
    expect(formatAltitudeWithFeet(4773)).toBe("4,773 m / 15,659 ft");
    expect(formatAltitudeWithFeet(3870)).toBe("3,870 m / 12,697 ft");
  });

  it("formats an approximate distance in km and miles", () => {
    expect(formatDistance(75)).toBe("~75 km / 47 miles");
  });

  it("formats prices in US dollars", () => {
    expect(formatUsd(1110)).toBe("$1,110");
  });

  it("formats a trek date as the same calendar day everywhere", () => {
    expect(formatTripDate("2026-11-02")).toBe("Nov 02, 2026");
    expect(formatTripDate("2027-01-01")).toBe("Jan 01, 2027");
  });
});
