import { describe, expect, it } from "vitest";

import { buildAltitudeProfile, parseAltitude } from "./altitudeProfile";

/** Days that sleep where they top out, at these altitudes (null: not typed yet). */
const nights = (...altitudes: (number | null)[]) => altitudes.map((altitudeM) => ({ altitudeM, sleepAltitudeM: altitudeM }));

const LANGTANG = nights(1400, 1503, 2470, 3430, 3870, 4773, 2470, 1503, 1400, 1400);

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
    expect(profile?.points[0].x).toBe(0);
    expect(profile?.points.at(-1)?.x).toBe(100);
  });

  it("starts the axis at 1,000 m with grid lines every 1,500 m", () => {
    const profile = buildAltitudeProfile(LANGTANG);
    expect(profile?.gridLines.map((line) => line.altitudeM)).toEqual([1500, 3000, 4500, 6000]);
    expect(profile?.gridLines.at(-1)?.y).toBe(0);
    expect(profile?.points[0].y).toBeGreaterThan(0);
    expect(profile?.points[0].y).toBeLessThan(100);
  });

  it("skips days without an altitude yet but keeps every day's place on the axis", () => {
    const profile = buildAltitudeProfile(nights(1400, null, 3000));
    expect(profile?.points.map((point) => point.day)).toEqual([1, 3]);
    expect(profile?.points[1].x).toBe(100);
    expect(profile?.dayXs).toEqual([0, 50, 100]);
  });

  it("puts a peak on the top grid line at the very top of the plot (the page keeps room for its label)", () => {
    const profile = buildAltitudeProfile(nights(822, 1900, 4500, 822));
    expect(profile?.peak).toMatchObject({ altitudeM: 4500, y: 0 });
    expect(profile?.areaPath.endsWith("L100 100 L0 100 Z")).toBe(true);
  });

  it("draws nothing with fewer than two altitudes", () => {
    expect(buildAltitudeProfile([])).toBeNull();
    expect(buildAltitudeProfile(nights(3000, null))).toBeNull();
  });

  it("draws a day that goes higher as two points: its high point halfway into the day, then the night", () => {
    const profile = buildAltitudeProfile([...nights(4460), { altitudeM: 5106, sleepAltitudeM: 3720 }, ...nights(2600)]);
    expect(profile?.points.map(({ day, kind, altitudeM, x }) => ({ day, kind, altitudeM, x }))).toEqual([
      { day: 1, kind: "night", altitudeM: 4460, x: 0 },
      { day: 2, kind: "high", altitudeM: 5106, x: 25 },
      { day: 2, kind: "night", altitudeM: 3720, x: 50 },
      { day: 3, kind: "night", altitudeM: 2600, x: 100 },
    ]);
    expect(profile?.peak).toMatchObject({ day: 2, kind: "high", altitudeM: 5106 });
  });

  it("starts the plot half a day early when the first day goes higher", () => {
    const profile = buildAltitudeProfile([{ altitudeM: 2000, sleepAltitudeM: 1400 }, ...nights(1500)]);
    expect(profile?.points.map((point) => point.x)).toEqual([0, 33.3, 100]);
    expect(profile?.dayXs).toEqual([33.3, 100]);
  });
});
