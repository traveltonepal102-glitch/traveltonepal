import { EMPTY_RICH_TEXT } from "@ttn/ui/lib/richText";
import { describe, expect, it } from "vitest";

import { buildElevationProfile } from "./elevation";
import { PHOTOS_BASE, TREK_FILES_BASE, langtangSource } from "./trekPage.testData";
import { toTrekDetail } from "./trekPageRows";
import type { ItineraryDay } from "./types";

const day = (place: string, altitudeM: number, sleepAltitudeM?: number, highPlace?: string): ItineraryDay => ({
  place,
  highPlace,
  altitudeM,
  sleepAltitudeM,
  title: place,
  subtitle: "",
  body: EMPTY_RICH_TEXT,
});

describe("buildElevationProfile", () => {
  const langtang = buildElevationProfile(toTrekDetail(langtangSource(), PHOTOS_BASE, TREK_FILES_BASE).itinerary.days);

  it("places the Langtang days on the admin chart's points and axis, scaled to the design's box", () => {
    expect(langtang?.points[0]).toMatchObject({ x: 60, y: 195.6, role: "start" });
    // Day 6 hikes up Kyanjin Ri and back: its top halfway into the day, its night on day 6 itself.
    expect(langtang?.points[5]).toMatchObject({ day: 6, kind: "high", x: 540, y: 74.1, role: "summit" });
    expect(langtang?.points[6]).toMatchObject({ day: 6, kind: "night", place: "Kyanjin Gompa", x: 593.8, y: 106.7, role: "descent" });
    expect(langtang?.points[4]).toMatchObject({ y: 106.7, role: "highestNight" });
    expect(langtang?.gridLines.map((line) => line.altitudeM)).toEqual([1500, 3000, 4500, 6000]);
    expect(langtang?.gridLines.at(-1)?.y).toBe(30);
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

  it("draws a pass day as its high point, then the night lower down", () => {
    const profile = buildElevationProfile([day("Dharmasala", 4460), day("Bhimthang", 5106, 3720, "Larkya La"), day("Tilije", 2300)]);
    expect(profile?.points.map(({ kind, place, altitudeM, x }) => ({ kind, place, altitudeM, x }))).toEqual([
      { kind: "night", place: "Dharmasala", altitudeM: 4460, x: 60 },
      { kind: "high", place: "Larkya La", altitudeM: 5106, x: 300 },
      { kind: "night", place: "Bhimthang", altitudeM: 3720, x: 540 },
      { kind: "night", place: "Tilije", altitudeM: 2300, x: 1020 },
    ]);
    expect(profile?.peak).toMatchObject({ day: 2, place: "Larkya La", label: { text: "Larkya La 5,106 m" } });
    expect(profile?.highestNight).toEqual({ place: "Dharmasala", altitudeM: 4460 });
  });

  it("labels a high point saved without its name by its altitude only", () => {
    const profile = buildElevationProfile([day("Dharmasala", 4460), day("Bhimthang", 5106, 3720)]);
    expect(profile?.peak.label?.text).toBe("5,106 m");
    expect(profile?.description).toBe("Altitude profile: from 4,460 m in Dharmasala up to 5,106 m on day 2, then back down.");
  });

  it("describes the curve for screen readers", () => {
    expect(langtang?.description).toBe(
      "Altitude profile: from 1,400 m in Kathmandu up to 4,773 m on Kyanjin Ri on day 6, then back down.",
    );
  });

  it("raises the axis for higher treks and returns null without enough days", () => {
    const high = buildElevationProfile([day("Lukla", 2860), day("Kala Patthar", 5545)]);
    expect(high?.gridLines.at(-1)?.altitudeM).toBe(6000);
    expect(buildElevationProfile([day("Kathmandu", 1400)])).toBeNull();
  });
});
