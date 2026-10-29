import { describe, expect, it } from "vitest";

import type { WebSitePageRow } from "@/lib/supabase/database.types";

import { toContactPage } from "./contactPageRows";

const ROW: WebSitePageRow = {
  slug: "contact",
  eyebrow: "",
  heading: "Talk to a local trekking expert",
  intro: "Ask anything.",
  seo_title: "",
  seo_description: "",
  seo_keyword: "",
  share_id: null,
  share_variant_widths: null,
  share_place: null,
  content: {
    replyTimes: { whatsApp: " Within a few hours ", email: "Within 24 hours" },
    officeDirections: "Near the Garden of Dreams",
    nextSteps: [
      { when: "Today", title: "You write", text: "Tell us your dates." },
      { when: "", title: "", text: "No title: left out." },
      { when: "Later", title: "We plan", text: "" },
      { when: "Then", title: "You confirm", text: "" },
      { when: "Too many", title: "Fourth step", text: "" },
    ],
    faqs: [
      { question: "Is it free?", answer: "Yes." },
      { question: "Rich?", answer: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Rich answer." }] }] } },
      { question: "No answer", answer: " " },
    ],
    timeNote: "We reply in the morning.",
    faqHeading: "Before you write",
    timeZones: ["Europe/London", "Mars/Olympus", "Europe/London", "Europe/Berlin"],
  },
  updated_at: "2026-10-26T08:00:00Z",
  cover_id: null,
  cover_width: null,
  cover_height: null,
  cover_variant_widths: null,
  cover_placeholder: null,
  cover_place: null,
  founder_name: null,
  founder_role: null,
  founder_photo_id: null,
  founder_photo_variant_widths: null,
  founder_photo_placeholder: null,
  story_photos: [],
};

describe("toContactPage", () => {
  const page = toContactPage(ROW, "https://photos.example/photos");

  it("reads the reply times and directions, trimmed", () => {
    expect(page.replyTimes).toEqual({ whatsApp: "Within a few hours", email: "Within 24 hours" });
    expect(page.officeDirections).toBe("Near the Garden of Dreams");
  });

  it("keeps up to three steps with a title, and questions with an answer", () => {
    expect(page.nextSteps.map((step) => step.title)).toEqual(["You write", "We plan", "You confirm"]);
    expect(page.faqs.map((faq) => faq.question)).toEqual(["Is it free?", "Rich?"]);
    expect(page.faqs[0]?.answer).toEqual({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Yes." }] }] });
    expect(page).toMatchObject({ timeNote: "We reply in the morning.", faqHeading: "Before you write" });
  });

  it("shows only known time zones, once each, in the order picked", () => {
    expect(page.timeZones).toEqual([
      { place: "United Kingdom (London)", timeZone: "Europe/London" },
      { place: "Germany (Berlin)", timeZone: "Europe/Berlin" },
    ]);
  });

  it("survives content that is not what it should be", () => {
    expect(toContactPage({ ...ROW, content: null }, "")).toMatchObject({ replyTimes: { whatsApp: "", email: "" }, nextSteps: [], faqs: [], timeZones: [] });
  });
});
