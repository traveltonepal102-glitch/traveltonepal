import { describe, expect, it } from "vitest";

import { topPlaceOf } from "./topPlace";

describe("topPlaceOf", () => {
  it("names where the day sleeps when it sleeps at its highest point", () => {
    expect(topPlaceOf({ title: "Samagaun to Samdo", place: "Samdo", highPlace: "", sleepAltitudeM: null })).toBe("Samdo");
  });

  it("names the pass when the day sleeps lower", () => {
    expect(topPlaceOf({ title: "Cross the pass", place: "Bimthang", highPlace: "Larkya La", sleepAltitudeM: 3720 })).toBe("Larkya La");
  });

  it("falls back to the title when the name is blank", () => {
    expect(topPlaceOf({ title: "Cross the pass", place: "Bimthang", highPlace: " ", sleepAltitudeM: 3720 })).toBe("Cross the pass");
    expect(topPlaceOf({ title: "Arrive", place: "" })).toBe("Arrive");
  });
});
