import { describe, expect, it } from "vitest";

import { ALTITUDE_CHART, buildAltitudeProfile, parseAltitude } from "./altitudeProfile";

const LANGTANG = [1400, 1503, 2470, 3430, 3870, 4773, 2470, 1503, 1400, 1400];

describe("parseAltitude", () => {
  it("reads numbers the way people type them, and nothing else", () => {
    expect(parseAltitude("4,773")).toBe(4773);
    expect(parseAltitude(" 4 773 ")).toBe(4773);
    for (const value of ["", "4.7k", "high", "-20"]) expect(parseAltitude(value)).toBeNull();
  });
});

describe("buildAltitudeProfile", () => {
  it("finds the highest day and spans the plot from the first day to the last", () => {
    const profile = buildAltitudeProfile(LANGTANG);
    expect(profile?.peak).toMatchObject({ day: 6, altitudeM: 4773 });
    expect(profile?.points[0].x).toBe(ALTITUDE_CHART.left);
    expect(profile?.points.at(-1)?.x).toBe(ALTITUDE_CHART.right);
  });

  it("starts the axis at 1,000 m with grid lines every 1,500 m", () => {
    const profile = buildAltitudeProfile(LANGTANG);
    expect(profile?.gridLines.map((line) => line.altitudeM)).toEqual([1500, 3000, 4500, 6000]);
    expect(profile?.points[0].y).toBeLessThan(ALTITUDE_CHART.bottom);
  });

  it("skips days without an altitude yet but keeps every day's place on the axis", () => {
    const profile = buildAltitudeProfile([1400, null, 3000]);
    expect(profile?.points.map((point) => point.day)).toEqual([1, 3]);
    expect(profile?.points[1].x).toBe(ALTITUDE_CHART.right);
  });

  it("draws nothing with fewer than two altitudes", () => {
    expect(buildAltitudeProfile([])).toBeNull();
    expect(buildAltitudeProfile([3000, null])).toBeNull();
  });
});
