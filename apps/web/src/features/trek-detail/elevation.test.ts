import { describe, expect, it } from "vitest";

import { buildElevationProfile } from "./elevation";
import { getTrekDetail } from "./trekDetails";
import type { ItineraryDay } from "./types";

const day = (place: string, altitudeM: number, sleepAltitudeM?: number): ItineraryDay => ({
  place,
  altitudeM,
  sleepAltitudeM,
  title: place,
  subtitle: "",
  text: "",
});

describe("buildElevationProfile", () => {
  const langtang = buildElevationProfile(getTrekDetail("langtang-valley")?.itinerary.days ?? []);

  it("places the Langtang days where the design draws them", () => {
    expect(langtang?.points[0]).toMatchObject({ x: 60, y: 194, role: "start" });
    expect(langtang?.points[5]).toMatchObject({ day: 6, x: 593.3, y: 59.1, role: "summit" });
    expect(langtang?.points[4]).toMatchObject({ y: 95.2, role: "highestNight" });
    expect(langtang?.gridLines.map((line) => line.altitudeM)).toEqual([1000, 2500, 4000, 5500]);
  });

  it("finds the peak and the highest night, which can differ on a day hike", () => {
    expect(langtang?.peak).toMatchObject({ place: "Kyanjin Ri", altitudeM: 4773 });
    expect(langtang?.highestNight).toEqual({ place: "Kyanjin Gompa", altitudeM: 3870 });
  });

  it("labels only the way up, above points near the floor and below the others", () => {
    const labels = langtang?.points.map((point) => point.label?.text);
    expect(labels?.slice(0, 6)).toEqual(["Kathmandu", "Syabrubesi", "Lama Hotel", "Langtang", "Kyanjin Gompa 3,870 m", "Kyanjin Ri 4,773 m"]);
    expect(labels?.slice(6).every((label) => label === undefined)).toBe(true);
    expect(langtang?.points[0].label?.y).toBeLessThan(langtang?.points[0].y ?? 0);
    expect(langtang?.points[2].label?.y).toBeGreaterThan(langtang?.points[2].y ?? 0);
  });

  it("describes the curve for screen readers", () => {
    expect(langtang?.description).toBe(
      "Altitude profile: from 1,400 m in Kathmandu up to 4,773 m on Kyanjin Ri on day 6, then back down.",
    );
  });

  it("raises the axis for higher treks and returns null without enough days", () => {
    const high = buildElevationProfile([day("Lukla", 2860), day("Kala Patthar", 5545)]);
    expect(high?.gridLines.at(-1)?.altitudeM).toBe(7000);
    expect(buildElevationProfile([day("Kathmandu", 1400)])).toBeNull();
  });
});
