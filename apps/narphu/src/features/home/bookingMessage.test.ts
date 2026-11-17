import { describe, expect, it } from "vitest";

import { buildBookingMessage } from "./bookingMessage";

describe("the booking message", () => {
  it("names the trek, the group and the day", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "3–5 people", startDate: "2026-10-05" })).toBe(
      "Hello! I would like to book the Manaslu Circuit Trek (13 days).\n\nGroup size: 3–5 people\nStart date: 5 Oct 2026",
    );
  });

  it("adds what the request form asks, leaving out what is blank", () => {
    const message = buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "2 travellers", startDate: "", name: " Anna ", country: "", requests: "An extra rest day" });
    expect(message).toBe("Hello! I would like to book the Manaslu Circuit Trek (13 days).\n\nName: Anna\nGroup size: 2 travellers\nSpecial requests: An extra rest day");
  });

  it("doesn't fail on a five-digit year", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 1, groupSize: "2 travellers", startDate: "12027-04-12" })).toBe("Hello! I would like to book the Manaslu Circuit Trek (1 day).\n\nGroup size: 2 travellers\nStart date: 12027-04-12");
  });

  it("leaves the day out until one is chosen", () => {
    expect(buildBookingMessage({ trekName: "Manaslu Circuit Trek", days: 13, groupSize: "2 people", startDate: "" })).not.toContain("Start date");
  });
});
