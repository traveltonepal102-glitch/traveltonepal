import { getEmailUrl, getWhatsAppUrl, mailtoUrl, whatsAppChatUrl } from "@ttn/config/contact";
import { describe, expect, it } from "vitest";

import { MAX_REQUESTS_LENGTH, buildDateCheckMessage, buildTrekRequestMessage, trekRequestSchema } from "./requestMessage";
import { trekPageReviews } from "./reviews";

const request = {
  trekName: "Langtang Valley Trek",
  days: 10,
  name: "  Anna Weber ",
  country: "",
  groupSize: "3–5 people ($890 per person)",
  timing: "Start Nov 02, 2026",
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

describe("buildDateCheckMessage", () => {
  it("asks about the chosen start day for the chosen group", () => {
    expect(buildDateCheckMessage({ trekName: "Langtang Valley Trek", days: 10, groupSize: "2 people ($965 per person)", startDate: "Nov 02, 2026" })).toBe(
      ["Hello! Can I start the Langtang Valley Trek (10 days) on Nov 02, 2026?", "", "Group size: 2 people ($965 per person)"].join("\n"),
    );
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
        "Preferred time: Start Nov 02, 2026",
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

describe("contact links", () => {
  it("send email and WhatsApp through the site's own addresses, which read the saved contact details", () => {
    expect(getEmailUrl()).toBe("/email");
    expect(getWhatsAppUrl()).toBe("/whatsapp");
    expect(new URL(getEmailUrl({ subject: "Booking request", body: "Line 1\nLine 2 & more" }), "https://x.test").searchParams.get("body")).toBe("Line 1\nLine 2 & more");
    expect(new URL(getWhatsAppUrl("Hi & hello"), "https://x.test").searchParams.get("text")).toBe("Hi & hello");
  });

  it("encode a mail draft with %20 spaces and line breaks (mail apps do not read + as a space)", () => {
    expect(mailtoUrl("hello@example.com", { subject: "Booking request", body: "Line 1\nLine 2 & more" })).toBe(
      "mailto:hello@example.com?subject=Booking%20request&body=Line%201%0ALine%202%20%26%20more",
    );
    expect(mailtoUrl("hello@example.com")).toBe("mailto:hello@example.com");
  });

  it("open a WhatsApp chat with the saved number", () => {
    expect(whatsAppChatUrl("9779843197197")).toBe("https://wa.me/9779843197197");
    expect(whatsAppChatUrl("9779843197197", "Hi there")).toBe("https://wa.me/9779843197197?text=Hi%20there");
  });
});

describe("trekPageReviews", () => {
  const NONE = { reviews: [], rating: null };
  const review = (id: string, trekSlug?: string) => ({ id, trekSlug, quote: "Great.", name: "Anna", country: "", source: "Google" as const, url: `https://maps.app.goo.gl/${id}` });

  it("shows placeholders only in development while there are no chosen reviews", () => {
    expect(trekPageReviews(NONE, "langtang-valley", true).length).toBeGreaterThan(0);
    expect(trekPageReviews(NONE, "langtang-valley", false)).toEqual([]);
  });

  it("shows only this trek's reviews", () => {
    const published = { reviews: [review("a", "langtang-valley"), review("b", "everest-base-camp"), review("c")], rating: null };
    expect(trekPageReviews(published, "langtang-valley", false).map((item) => item.id)).toEqual(["a"]);
  });
});
