import { describe, expect, it } from "vitest";

import { buildBookingMessage } from "./bookingMessage";

describe("the booking message", () => {
  it("names the trek, the group and the day", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "3–5 Personen", startDate: "2026-10-05" })).toBe(
      "Hallo! Ich möchte den Manaslu Circuit Trek buchen (13 Tage).\n\nGruppengröße: 3–5 Personen\nStartdatum: 5. Okt. 2026",
    );
  });

  it("adds what the request form asks, leaving out what is blank", () => {
    const message = buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "2 Personen", startDate: "", name: " Anna ", country: "", requests: "Ein zusätzlicher Ruhetag" });
    expect(message).toBe("Hallo! Ich möchte den Manaslu Circuit Trek buchen (13 Tage).\n\nName: Anna\nGruppengröße: 2 Personen\nBesondere Wünsche: Ein zusätzlicher Ruhetag");
  });

  it("doesn't fail on a five-digit year", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 1, groupSize: "2 Personen", startDate: "12027-04-12" })).toBe("Hallo! Ich möchte den Manaslu Circuit Trek buchen (1 Tag).\n\nGruppengröße: 2 Personen\nStartdatum: 12027-04-12");
  });

  it("leaves the day out until one is chosen", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "2 Personen", startDate: "" })).not.toContain("Startdatum");
  });
});
