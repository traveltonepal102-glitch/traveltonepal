import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";

import { EMPTY_TREK_VALUES } from "../constants";
import { getSeoChecks } from "./seoChecks";

const doc = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

const LANGTANG = {
  ...EMPTY_TREK_VALUES,
  slug: "langtang-valley",
  seoKeyword: "Langtang Valley Trek",
  seoTitle: "Langtang Valley Trek: 10 Days from $890",
  seoDescription: "x".repeat(150),
  groupPrices: [{ id: "p1", label: "2 people", shortLabel: "2 Pax", priceUsd: 965, team: "", isDefault: true }],
  faqs: [{ title: "General", icon: "info" as const, items: [{ question: "Why?", answer: doc("Because.") }] }],
};

const failing = (values: typeof LANGTANG) => getSeoChecks(values).filter((check) => !check.isDone).map((check) => check.label);

describe("getSeoChecks", () => {
  it("ticks everything for a well-written trek", () => {
    expect(failing(LANGTANG)).toEqual([]);
  });

  it("matches the keyword to the address without the words every trek shares", () => {
    expect(failing({ ...LANGTANG, slug: "langtang" })).toEqual(["Main keyword in the web address"]);
    expect(failing({ ...LANGTANG, seoKeyword: "" })).toEqual(["Main keyword in the Google title", "Main keyword in the web address"]);
    expect(failing({ ...LANGTANG, seoKeyword: "trek nepal" })).toContain("Main keyword in the web address");
  });

  it("flags a long title, a short or long description and a title without a price", () => {
    expect(failing({ ...LANGTANG, seoTitle: `Langtang Valley Trek ${"y".repeat(50)}` })).toEqual([
      "Google title up to 60 characters",
      "Price in the title (gets more clicks)",
    ]);
    expect(failing({ ...LANGTANG, seoDescription: "Too short." })).toEqual(["Description 120–160 characters"]);
    expect(failing({ ...LANGTANG, seoDescription: "x".repeat(161) })).toEqual(["Description 120–160 characters"]);
  });

  it("needs prices and questions for Google's trip and FAQ data", () => {
    expect(failing({ ...LANGTANG, groupPrices: [], faqs: [] })).toEqual(["Prices added as trip data for Google", "Questions added as FAQ data"]);
  });
});
