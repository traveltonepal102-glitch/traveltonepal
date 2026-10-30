import { describe, expect, it } from "vitest";

import type { DayAltitude } from "./elevationSummary";
import { elevationSummary } from "./elevationSummary";

const day = (place: string, altitudeM: number | null, sleepAltitudeM: number | null = null, duration = "5 hrs", highPlace = ""): DayAltitude => ({
  place,
  highPlace,
  duration,
  altitudeM,
  sleepAltitudeM,
});

describe("elevationSummary", () => {
  it("finds the trek start, the highest night and the high point, with their day", () => {
    const boxes = elevationSummary([
      day("Kathmandu", 1400, null, ""),
      day("Pokhara", 822),
      day("High Camp", 3580),
      day("High Camp", 4500, 3580, "8 hrs", "Mardi Base Camp"),
      day("Pokhara", 822),
    ]);

    expect(boxes).toEqual([
      { label: "Trek start", dayIndex: 1, place: "Pokhara", altitudeM: 822 },
      { label: "Highest night", dayIndex: 2, place: "High Camp", altitudeM: 3580 },
      { label: "High point", dayIndex: 3, place: "Mardi Base Camp", altitudeM: 4500 },
    ]);
  });

  it("names the high point after the day's highest point, not where you sleep that night", () => {
    const boxes = elevationSummary([day("Dharmasala", 4460), day("Bhimthang", 5106, 3720, "8–10 hrs", "Larkya La")]);
    expect(boxes[2]).toMatchObject({ dayIndex: 1, place: "Larkya La", altitudeM: 5106 });
    expect(boxes[1]).toMatchObject({ dayIndex: 0, place: "Dharmasala", altitudeM: 4460 });
  });

  it("keeps the first day on a tie and skips days without an altitude", () => {
    const boxes = elevationSummary([day("A", null), day("B", 3000), day("C", 3000)]);
    expect(boxes[2]).toMatchObject({ dayIndex: 1, place: "B" });
  });

  it("leaves a box empty while no day qualifies", () => {
    expect(elevationSummary([])).toEqual([
      { label: "Trek start", dayIndex: null, place: "", altitudeM: null },
      { label: "Highest night", dayIndex: null, place: "", altitudeM: null },
      { label: "High point", dayIndex: null, place: "", altitudeM: null },
    ]);
  });
});
