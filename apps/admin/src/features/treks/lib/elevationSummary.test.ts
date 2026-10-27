import { describe, expect, it } from "vitest";

import type { DayAltitude } from "./elevationSummary";
import { elevationSummary } from "./elevationSummary";

const day = (place: string, altitudeM: number | null, sleepAltitudeM: number | null = null, duration = "5 hrs"): DayAltitude => ({
  place,
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
      day("Mardi Base Camp", 4500, 3580),
      day("Pokhara", 822),
    ]);

    expect(boxes).toEqual([
      { label: "Trek start", dayIndex: 1, place: "Pokhara", altitudeM: 822 },
      { label: "Highest night", dayIndex: 2, place: "High Camp", altitudeM: 3580 },
      { label: "High point", dayIndex: 3, place: "Mardi Base Camp", altitudeM: 4500 },
    ]);
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
