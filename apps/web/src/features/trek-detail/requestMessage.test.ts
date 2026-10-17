import { getEmailUrl } from "@ttn/config/contact";
import { describe, expect, it } from "vitest";

import { MAX_REQUESTS_LENGTH, buildTrekRequestMessage, trekRequestSchema } from "./requestMessage";
import { trekPageReviews } from "./reviews";

const request = {
  trekName: "Langtang Valley Trek",
  days: 10,
  name: "  Anna Weber ",
  country: "",
  groupSize: "3–5 people ($890 per person)",
  timing: "Departure Nov 02, 2026",
  requests: "",
};

describe("trekRequestSchema", () => {
  it("accepts a name with optional country and requests, trimmed", () => {
    expect(trekRequestSchema.parse({ name: " Anna ", country: " Germany ", requests: "" })).toEqual({
      name: "Anna",
      country: "Germany",
      requests: "",
    });
  });

  it("rejects a missing name and over-long requests with readable messages", () => {
    const result = trekRequestSchema.safeParse({ name: " ", country: "", requests: "x".repeat(MAX_REQUESTS_LENGTH + 1) });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "Please enter your name.",
      `Please keep your requests under ${MAX_REQUESTS_LENGTH} characters.`,
    ]);
  });
});

describe("buildTrekRequestMessage", () => {
  it("writes every field on its own line and trims the name", () => {
    expect(buildTrekRequestMessage(request)).toBe(
      [
        "Hello! I would like to book the Langtang Valley Trek (10 days).",
        "",
        "Name: Anna Weber",
        "Group size: 3–5 people ($890 per person)",
        "Preferred time: Departure Nov 02, 2026",
      ].join("\n"),
    );
  });

  it("adds the country only when given", () => {
    expect(buildTrekRequestMessage(request)).not.toContain("Country:");
    expect(buildTrekRequestMessage({ ...request, country: " Germany " })).toContain("Name: Anna Weber\nCountry: Germany\n");
  });

  it("adds special requests only when given, and caps their length", () => {
    expect(buildTrekRequestMessage({ ...request, requests: " Add Tserko Ri " })).toContain("Special requests: Add Tserko Ri");
    const long = buildTrekRequestMessage({ ...request, requests: "x".repeat(MAX_REQUESTS_LENGTH + 50) });
    expect(long.split("Special requests: ")[1]).toHaveLength(MAX_REQUESTS_LENGTH);
  });
});

describe("getEmailUrl", () => {
  it("encodes a subject and body with %20 spaces and line breaks", () => {
    const url = getEmailUrl({ subject: "Booking request", body: "Line 1\nLine 2 & more" });
    expect(url).toMatch(/^mailto:[^?]+\?subject=Booking%20request&body=Line%201%0ALine%202%20%26%20more$/);
  });

  it("is a plain mailto link without a draft", () => {
    expect(getEmailUrl()).toMatch(/^mailto:[^?]+$/);
  });
});

describe("trekPageReviews", () => {
  it("shows placeholders only in development while there are no published reviews", () => {
    expect(trekPageReviews("langtang-valley", true).length).toBeGreaterThan(0);
    expect(trekPageReviews("langtang-valley", false)).toEqual([]);
  });
});
