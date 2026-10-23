import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { Photo } from "@/features/photos/types";

import { EMPTY_REGION_VALUES, NO_REGION_PHOTOS } from "../constants";
import { firstSectionWithError } from "../sections";
import type { RegionValues } from "../types";
import { formatBestMonths } from "./bestMonths";
import { countDoneSections, getRegionReadiness } from "./readiness";

const months = (code: string): MonthRating[] =>
  [...code].map((letter) => (letter === "g" ? "best" : letter === "o" ? "possible" : "avoid"));

const richText = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

const photo = (id: string, place = ""): Photo => ({
  id,
  width: 1600,
  height: 1200,
  baseUrl: `https://images.example.com/${id}`,
  variantWidths: [400, 800, 1200, 1600],
  placeholder: "",
  place,
});

const EMPTY: RegionValues = { ...EMPTY_REGION_VALUES, name: "Langtang", slug: "langtang" };

describe("formatBestMonths", () => {
  it("joins best months into ranges", () => {
    expect(formatBestMonths(months("ooggg xxxoggo".replace(" ", "")))).toBe("Mar–May, Oct–Nov");
    expect(formatBestMonths(months("xxxxxxxxxgxx"))).toBe("Oct");
  });

  it("joins a run over the new year", () => {
    expect(formatBestMonths(months("ggxxxxxxxxgg"))).toBe("Nov–Feb");
  });

  it("is empty without best months, and covers a full year", () => {
    expect(formatBestMonths(months("ooxxxxxxxxoo"))).toBe("");
    expect(formatBestMonths(months("gggggggggggg"))).toBe("Jan–Dec");
  });
});

describe("getRegionReadiness", () => {
  it("lists what a new region still needs", () => {
    const readiness = getRegionReadiness(EMPTY, NO_REGION_PHOTOS);
    expect(readiness.basics).toEqual({ status: "todo", note: "Add the tagline, introduction, map pin" });
    expect(readiness.facts).toEqual({ status: "todo", note: "0 of 6 filled in" });
    expect(readiness.months.status).toBe("todo");
    expect(readiness.faq).toEqual({ status: "todo", note: "No questions yet" });
    expect(countDoneSections(readiness)).toBe(0);
    expect(readiness.photos.status).toBe("todo");
  });

  it("warns about too few questions and missing season notes", () => {
    const faq = { question: "Q?", answer: richText("A.") };
    const readiness = getRegionReadiness({ ...EMPTY, faqs: [faq, faq], monthRatings: months("xxgggxxxxggx") }, NO_REGION_PHOTOS);
    expect(readiness.faq).toEqual({ status: "warn", note: "Only 2 questions" });
    expect(readiness.months).toEqual({ status: "warn", note: "Best: Mar–May, Oct–Nov · 0 of 4 season notes" });
  });

  it("marks a filled-in region as done", () => {
    const faq = { question: "Q?", answer: richText("A.") };
    const full: RegionValues = {
      ...EMPTY,
      latitude: 28.21,
      longitude: 85.56,
      tagline: "Glaciers and yak pastures.",
      introduction: richText("The valley next door to Kathmandu."),
      highestPoint: "4,984 m",
      trekLength: "7–12 days",
      difficulty: "Moderate",
      gettingThere: "Drive",
      gettingThereDetails: "Drive to Syabrubesi",
      permits: "Langtang NP + TIMS",
      monthRatings: months("xxgggxxxxggx"),
      seasons: { spring: "Warm.", monsoon: "Rain.", autumn: "Clear.", winter: "Cold." },
      faqs: Array.from({ length: 6 }, () => faq),
      seoTitle: "Langtang trekking",
      seoDescription: "Trek Langtang.",
    };
    expect(countDoneSections(getRegionReadiness(full, { cover: photo("a"), gallery: [photo("b")] }))).toBe(6);
  });
});

describe("photos readiness", () => {
  it("needs only a cover; an empty \"taken at\" is never a warning", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS).photos).toEqual({ status: "todo", note: "Add a cover photo" });
    const readiness = getRegionReadiness(EMPTY, { cover: photo("a"), gallery: [photo("b"), photo("c", "Kyanjin Gompa")] });
    expect(readiness.photos).toEqual({ status: "done", note: "Cover + 2 photos" });
    expect(getRegionReadiness(EMPTY, { cover: photo("a"), gallery: [photo("b")] }).photos.note).toBe("Cover + 1 photo");
  });
});

describe("firstSectionWithError", () => {
  it("opens the first section, in display order, that has an error", () => {
    expect(firstSectionWithError(["seoTitle", "faqs.2.answer", "permits"])).toBe("facts");
    expect(firstSectionWithError(["seasons.spring"])).toBe("months");
    expect(firstSectionWithError([])).toBeUndefined();
  });
});
