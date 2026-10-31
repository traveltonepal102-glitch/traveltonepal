import { formatBestMonths } from "@ttn/ui/lib/bestMonths";
import { describe, expect, it } from "vitest";

import type { RichTextDoc } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { Photo } from "@/features/photos/types";

import { EMPTY_REGION_VALUES, NO_REGION_PHOTOS } from "../constants";
import { firstSectionWithError } from "../sections";
import type { RegionValues } from "../types";
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
  fileName: null,
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
    const readiness = getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], []);
    expect(readiness.basics).toEqual({ status: "todo", note: "Add the tagline" });
    expect(readiness.facts).toEqual({ status: "todo", note: "0 of 5 filled in" });
    expect(readiness.about).toEqual({ status: "todo", note: "Add the introduction" });
    expect(readiness.where).toEqual({ status: "todo", note: "Add the map pin" });
    expect(readiness.months.status).toBe("todo");
    expect(readiness.faq).toEqual({ status: "todo", note: "No questions yet" });
    expect(readiness.compare).toEqual({ status: "done", note: "Chosen by the website" });
    expect(countDoneSections(readiness)).toBe(1);
    expect(readiness.photos.status).toBe("todo");
  });

  it("warns about too few questions and missing season notes", () => {
    const faq = { question: "Q?", answer: richText("A.") };
    const readiness = getRegionReadiness({ ...EMPTY, faqs: [faq, faq], monthRatings: months("xxgggxxxxggx") }, NO_REGION_PHOTOS, [], []);
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
      heroHighlight: "No flights needed",
      summary: "The closest big-mountain valley to Kathmandu.",
      overviewHeading: "The valley next door to Kathmandu",
      introduction: richText("The valley next door to Kathmandu."),
      whyPoints: [{ icon: "landscape", title: "Big mountains, fast", text: "Langtang Lirung after 4 days." }],
      maxAltitudeM: 4984,
      trekLength: "7–12 days",
      difficulty: "moderate",
      gettingThere: "Drive",
      gettingThereDetails: "Drive to Syabrubesi",
      permits: "Langtang NP + TIMS",
      fromKathmandu: "120 km",
      nearestAirport: "Kathmandu (KTM)",
      permitsDetails: "Langtang National Park",
      whereYouSleep: "Teahouses",
      monthRatings: months("xxgggxxxxggx"),
      seasons: { spring: "Warm.", monsoon: "Rain.", autumn: "Clear.", winter: "Cold." },
      faqs: Array.from({ length: 6 }, () => faq),
      seoTitle: "Langtang trekking",
      seoDescription: "Trek Langtang.",
      featuredTrekId: "trek-1",
    };
    expect(countDoneSections(getRegionReadiness(full, { cover: photo("a"), gallery: [photo("b")] }, ["guide-1"], ["article-1"]))).toBe(12);
  });

  it("reminds about the photo chip, the card summary, the heading, the cards and the four lines", () => {
    const started = { ...EMPTY, tagline: "Glaciers.", introduction: richText("Intro."), latitude: 28.21, longitude: 85.56, fromKathmandu: "120 km" };
    const readiness = getRegionReadiness(started, NO_REGION_PHOTOS, [], []);
    expect(readiness.basics).toEqual({ status: "warn", note: "Add the photo highlight and the card summary" });
    expect(readiness.about).toEqual({ status: "warn", note: "Add the heading" });
    expect(getRegionReadiness({ ...started, overviewHeading: "Next door" }, NO_REGION_PHOTOS, [], []).about.note).toBe("Add the “why trek here” cards");
    expect(readiness.where).toEqual({ status: "warn", note: "1 of 4 lines filled in" });
  });
});

describe("photos readiness", () => {
  it("needs only a cover; an empty \"taken at\" is never a warning", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], []).photos).toEqual({ status: "todo", note: "Add a cover photo" });
    const readiness = getRegionReadiness(EMPTY, { cover: photo("a"), gallery: [photo("b"), photo("c", "Kyanjin Gompa")] }, [], []);
    expect(readiness.photos).toEqual({ status: "done", note: "Cover + 2 photos" });
    expect(getRegionReadiness(EMPTY, { cover: photo("a"), gallery: [photo("b")] }, [], []).photos.note).toBe("Cover + 1 photo");
  });
});

describe("firstSectionWithError", () => {
  it("opens the first section, in display order, that has an error", () => {
    expect(firstSectionWithError(["seoTitle", "faqs.2.answer", "permits"])).toBe("facts");
    expect(firstSectionWithError(["whereYouSleep", "whyPoints.1.text"])).toBe("about");
    expect(firstSectionWithError(["compareRegionIds"])).toBe("compare");
    expect(firstSectionWithError(["seasons.spring"])).toBe("months");
    expect(firstSectionWithError([])).toBeUndefined();
  });
});

describe("treks and guides readiness", () => {
  it("needs a featured trek; nearby treks are counted", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], []).treks).toEqual({ status: "todo", note: "Pick the featured trek" });
    const featured = { ...EMPTY, featuredTrekId: "t1", nearbyTreks: [{ trekId: "t2", label: "", note: "" }] };
    expect(getRegionReadiness(featured, NO_REGION_PHOTOS, [], []).treks).toEqual({ status: "done", note: "Featured trek · 1 nearby" });
  });

  it("counts the guides who lead here and aren't switched off", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], []).guides).toEqual({ status: "todo", note: "No guides lead here yet" });
    expect(getRegionReadiness({ ...EMPTY, hiddenGuideIds: ["g1"] }, NO_REGION_PHOTOS, ["g1"], []).guides.note).toBe("All guides switched off");
    expect(getRegionReadiness({ ...EMPTY, hiddenGuideIds: ["g1"] }, NO_REGION_PHOTOS, ["g1", "g2", "g3"], []).guides).toEqual({ status: "done", note: "2 guides" });
  });
});

describe("travel guides readiness", () => {
  it("reminds when no travel guide is about the region yet", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], []).articles).toEqual({ status: "warn", note: "No travel guides yet" });
  });

  it("counts the travel guides about the region and the pinned ones", () => {
    expect(getRegionReadiness(EMPTY, NO_REGION_PHOTOS, [], ["a1"]).articles).toEqual({ status: "done", note: "1 guide" });
    expect(getRegionReadiness({ ...EMPTY, pinnedArticleIds: ["a1", "a2"] }, NO_REGION_PHOTOS, [], ["a1", "a2", "a3"]).articles).toEqual({ status: "done", note: "3 guides · 2 pinned" });
  });

  it("opens the travel guides section for a pin error", () => {
    expect(firstSectionWithError(["pinnedArticleIds"])).toBe("articles");
  });
});
