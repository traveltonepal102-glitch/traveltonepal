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

  it("takes the name before the first height in the title when the name is blank", () => {
    expect(topPlaceOf({ title: "Sonnenaufgang auf dem Kala Patthar (5.545 m), Abstieg nach Pheriche (4.371 m)", place: "Pheriche", highPlace: "", sleepAltitudeM: 4371 })).toBe("Kala Patthar");
    expect(topPlaceOf({ title: "Ankunft in Kathmandu (1.400 m)", place: "" })).toBe("Kathmandu");
  });

  it("takes the name written at the day's own height, also an approximate one", () => {
    const title = "Von Lobuche nach Gorak Shep (5.164 m) und zum Everest Base Camp (5.364 m)";
    expect(topPlaceOf({ title, place: "Gorak Shep", highPlace: "", sleepAltitudeM: 5164, altitudeM: 5364 })).toBe("Everest Base Camp");
    expect(topPlaceOf({ title: "Akklimatisierungstag in Dingboche, Aufstieg auf den Nangkartshang (etwa 5.080 m)", place: "Dingboche", highPlace: "", sleepAltitudeM: 4410, altitudeM: 5080 })).toBe("Nangkartshang");
  });
});
