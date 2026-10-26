import { describe, expect, it } from "vitest";

import { routeStops, stopDays } from "./routeStops";
import { PHOTOS_BASE, langtangSource } from "./trekPage.testData";
import { toTrekDetail } from "./trekPageRows";
import type { ItineraryDay } from "./types";

const day = (place: string, altitudeM: number, isHighPoint = false): ItineraryDay => ({
  place,
  altitudeM,
  isHighPoint,
  title: place,
  subtitle: "",
  text: "",
});

describe("routeStops", () => {
  it("lists the Langtang stops in walking order, the last two Kathmandu days as one stop", () => {
    const stops = routeStops(toTrekDetail(langtangSource(), PHOTOS_BASE).itinerary.days);
    expect(stops.map((stop) => `${stop.place} ${stopDays(stop)}`)).toEqual([
      "Kathmandu Day 1",
      "Syabrubesi Day 2",
      "Lama Hotel Day 3",
      "Langtang Day 4",
      "Kyanjin Gompa Day 5",
      "Kyanjin Ri Day 6",
      "Lama Hotel Day 7",
      "Syabrubesi Day 8",
      "Kathmandu Days 9–10",
    ]);
    expect(stops.map((stop) => stop.kind)).toEqual(["start", "stop", "stop", "stop", "stop", "summit", "stop", "stop", "stop"]);
  });

  it("keeps the highest altitude and the high point of a stop that lasts several days", () => {
    const stops = routeStops([day("Base", 3000), day("base ", 3600, true), day("Camp", 3200)]);
    expect(stops[0]).toEqual({ place: "Base", altitudeM: 3600, firstDay: 1, lastDay: 2, kind: "summit" });
    expect(stops[1]).toMatchObject({ place: "Camp", firstDay: 3, kind: "stop" });
  });

  it("leaves out days without a place, still counting them", () => {
    expect(routeStops([day("", 1400), day("Syabrubesi", 1503)])).toEqual([
      { place: "Syabrubesi", altitudeM: 1503, firstDay: 2, lastDay: 2, kind: "start" },
    ]);
    expect(routeStops([])).toEqual([]);
  });
});
