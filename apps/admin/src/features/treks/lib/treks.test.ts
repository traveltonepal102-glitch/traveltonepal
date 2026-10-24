import { describe, expect, it } from "vitest";

import { EMPTY_RICH_TEXT, type RichTextDoc } from "@/lib/richText/richText";

import { EMPTY_TREK_VALUES, NO_TREK_PHOTOS } from "../constants";
import type { TrekValues } from "../types";
import { getTrekReadiness } from "./readiness";
import type { TrekListItem } from "./trekListItem";
import { filterTreks } from "./trekListItem";

const TODAY = "2026-10-23";

const item = (name: string, overrides: Partial<TrekListItem> = {}): TrekListItem => ({
  id: name,
  name,
  regionId: "langtang",
  regionName: "Langtang",
  days: 10,
  difficulty: "moderate",
  priceFromUsd: null,
  status: "draft",
  cover: null,
  updatedAt: "2026-10-01T00:00:00Z",
  editedLabel: "1 Oct",
  ...overrides,
});

const TREKS = [
  item("Langtang Valley Trek", { priceFromUsd: 890, status: "published", updatedAt: "2026-10-20T00:00:00Z" }),
  item("Everest Base Camp Trek", { regionId: "everest", regionName: "Everest", priceFromUsd: 1000, status: "published" }),
  item("Gokyo Lakes Trek", { regionId: "everest", regionName: "Everest", status: "hidden", updatedAt: "2026-10-22T00:00:00Z" }),
];

const names = (treks: TrekListItem[]) => treks.map((trek) => trek.name);
const all = { search: "", regionId: "", status: "all" as const, sort: "edited" as const };

describe("filterTreks", () => {
  it("lists the most recently edited first", () => {
    expect(names(filterTreks(TREKS, all))).toEqual(["Gokyo Lakes Trek", "Langtang Valley Trek", "Everest Base Camp Trek"]);
  });

  it("searches names and regions, and filters by region", () => {
    expect(names(filterTreks(TREKS, { ...all, search: "  everest " }))).toEqual(["Gokyo Lakes Trek", "Everest Base Camp Trek"]);
    expect(names(filterTreks(TREKS, { ...all, regionId: "langtang" }))).toEqual(["Langtang Valley Trek"]);
  });

  it("splits published from drafts and hidden treks", () => {
    expect(names(filterTreks(TREKS, { ...all, status: "published" }))).toEqual(["Langtang Valley Trek", "Everest Base Camp Trek"]);
    expect(names(filterTreks(TREKS, { ...all, status: "unpublished" }))).toEqual(["Gokyo Lakes Trek"]);
  });

  it("sorts by name, or by price with unpriced treks last", () => {
    expect(names(filterTreks(TREKS, { ...all, sort: "name" }))).toEqual(["Everest Base Camp Trek", "Gokyo Lakes Trek", "Langtang Valley Trek"]);
    expect(names(filterTreks(TREKS, { ...all, sort: "price" }))).toEqual(["Langtang Valley Trek", "Everest Base Camp Trek", "Gokyo Lakes Trek"]);
  });
});

const doc = (text: string): RichTextDoc => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
const readiness = (values: Partial<TrekValues> = {}) => getTrekReadiness({ ...EMPTY_TREK_VALUES, ...values }, NO_TREK_PHOTOS, TODAY);

describe("getTrekReadiness", () => {
  it("lists what a new trek still needs", () => {
    const empty = readiness();
    expect(empty.top).toEqual({ status: "todo", note: "Add the big heading" });
    expect(empty.photos).toEqual({ status: "todo", note: "Add a cover photo" });
    expect(empty.intro).toEqual({ status: "todo", note: "Add the introduction" });
    expect(empty.know).toEqual({ status: "todo", note: "Add the topics" });
    expect(empty.similar).toEqual({ status: "done", note: "Chosen by the website" });
  });

  it("needs the heading and summary at the top, then reminds about the lines around them", () => {
    expect(readiness({ headline: "Langtang Valley Trek" }).top.note).toBe("Add the short summary");
    const written = { headline: "Langtang Valley Trek", summary: "Glaciers and yak pastures." };
    expect(readiness(written).top).toEqual({ status: "warn", note: "Add the season, trek style, high point" });
    expect(readiness({ ...written, currentSeason: "2026/2027", category: "Teahouse trek", highPoint: "Kyanjin Ri" }).top.status).toBe("done");
  });

  it("counts the introduction's words", () => {
    expect(readiness({ introduction: doc("A quiet valley north of Kathmandu.") }).intro).toEqual({ status: "done", note: "6 words" });
  });

  it("is done when every typed trip fact is filled in", () => {
    const trek = {
      startFinish: "Kathmandu / Syabrubesi",
      dailyWalking: "5 to 7 hours a day",
      guideRatio: "1 : 4 + porters",
      seasonLabel: "Mar–May, Oct–Nov",
      accommodation: "Teahouse and hotel",
      transport: "Jeep to Syabrubesi",
      distanceKm: 75,
    };
    expect(readiness(trek).facts.status).toBe("done");
    expect(readiness({ ...trek, transport: " " }).facts.note).toBe("Add 1 trip fact");
    expect(readiness({ ...trek, activity: "" }).facts.note).toBe("Add 1 trip fact");
  });

  it("asks for 4–6 highlights and a suitability checklist", () => {
    const point = { title: "Title", text: "Text." };
    expect(readiness().highlights).toEqual({ status: "todo", note: "Add the highlights" });
    expect(readiness({ highlights: [point, point] }).highlights).toEqual({ status: "warn", note: "Only 2 highlights" });
    expect(readiness({ highlights: [point, point, point, point] }).highlights).toEqual({ status: "done", note: "4 highlights" });
    expect(readiness().fit).toEqual({ status: "todo", note: "Add the checklist" });
    expect(readiness({ suitabilityPoints: [point] }).fit).toEqual({ status: "done", note: "1 topic" });
  });

  it("asks for days, a description for each day and a highlight day", () => {
    const planDay = { id: "d1", place: "", title: "Day", subtitle: "", duration: "", altitudeM: 2000, sleepAltitudeM: null, isHighPoint: false, description: EMPTY_RICH_TEXT, photo: null };
    expect(readiness().itinerary).toEqual({ status: "todo", note: "Add the days" });
    expect(readiness({ itinerary: [planDay, planDay] }).itinerary.note).toBe("2 days without a description");
    const described = { ...planDay, description: doc("Walk.") };
    expect(readiness({ itinerary: [described] }).itinerary.note).toBe("Mark the highlight day");
    expect(readiness({ itinerary: [described, { ...described, isHighPoint: true }] }).itinerary).toEqual({ status: "done", note: "2 days" });
  });

  it("asks for what's covered, then what's not and the food budget", () => {
    const point = { title: "Permits", text: "TIMS card." };
    expect(readiness().inclusions).toEqual({ status: "todo", note: "Add what the price includes" });
    const covered = { included: [point, point] };
    expect(readiness(covered).inclusions.note).toBe("Add what is not included");
    expect(readiness({ ...covered, excluded: [point] }).inclusions.note).toBe("Add the daily food budget");
    expect(readiness({ ...covered, excluded: [point], mealBudgetMinUsd: 20, mealBudgetMaxUsd: 30 }).inclusions).toEqual({ status: "done", note: "2 included · 1 not" });
  });

  it("asks for guides, then for the line about them", () => {
    expect(readiness().guides).toEqual({ status: "todo", note: "Pick the guides" });
    expect(readiness({ guideIds: ["g1", "g2"] }).guides).toEqual({ status: "warn", note: "Add the line about the guides" });
    expect(readiness({ guideIds: ["g1", "g2"], guidesIntro: "Local guides." }).guides).toEqual({ status: "done", note: "2 guides" });
  });

  it("asks for the map, then reminds about the printable PDF map", () => {
    expect(readiness().route).toEqual({ status: "todo", note: "Add the map" });
    const mapped = { mapPlace: "Kyanjin Gompa, Langtang, Nepal" };
    expect(readiness(mapped).route).toEqual({ status: "warn", note: "No printable map yet" });
    const pdfMapPath = "pdf-maps/0b8f9a52-6f43-4d2a-9d9e-3c1f2b7a8e10.pdf";
    expect(readiness({ ...mapped, pdfMapPath }).route.note).toBe("Map · PDF map");
    expect(readiness({ ...mapped, pdfMapPath, myMapsId: "1AbCdEfGhIjK" }).route.note).toBe("GPS trail map · PDF map");
  });

  it("asks for group prices, and for upcoming dates on a fixed-date trek", () => {
    const price = { id: "p1", label: "2 people", shortLabel: "2 Pax", priceUsd: 965, team: "", isDefault: true };
    expect(readiness().pricing).toEqual({ status: "todo", note: "Add the group prices" });
    expect(readiness({ groupPrices: [price] }).pricing).toEqual({ status: "done", note: "1 group price · your dates" });
    const past = { id: "d1", startDate: "2026-01-10", status: "open" as const, note: "" };
    const fixed = { groupPrices: [price], hasFixedDates: true, departures: [past] };
    expect(readiness(fixed).pricing).toEqual({ status: "warn", note: "No upcoming dates" });
    expect(readiness({ ...fixed, departures: [past, { ...past, id: "d2", startDate: TODAY }] }).pricing.note).toBe("1 group price · 1 date");
  });

  it("asks for a packing list", () => {
    expect(readiness().packing).toEqual({ status: "todo", note: "Add the packing list" });
    const packingGroups = [{ title: "Clothing", icon: "apparel" as const, items: [{ title: "Hat", text: "warm." }] }];
    expect(readiness({ packingGroups }).packing).toEqual({ status: "done", note: "1 group" });
  });

  it("asks for know-before-you-go topics, and flags a long heading", () => {
    const topic = { icon: "cottage" as const, title: "Teahouses", points: [], note: "", photoId: null, videoId: null };
    expect(readiness({ knowTopics: [topic] }).know).toEqual({ status: "done", note: "1 topic" });
    expect(readiness({ knowTopics: [topic], knowHeading: "x".repeat(71) }).know).toEqual({ status: "warn", note: "Heading is a bit long" });
  });

  it("asks for questions, and for at least 6 of them", () => {
    expect(readiness().faq).toEqual({ status: "todo", note: "Add the questions" });
    const item = { question: "Why?", answer: doc("Because.") };
    const topic = { title: "General", icon: "info" as const, items: [item, item, item] };
    expect(readiness({ faqs: [topic] }).faq).toEqual({ status: "warn", note: "Only 3 questions" });
    expect(readiness({ faqs: [topic, topic] }).faq).toEqual({ status: "done", note: "6 questions · 2 topics" });
  });

  it("counts the similar treks picked", () => {
    expect(readiness({ similarTrekIds: ["a", "b"] }).similar).toEqual({ status: "done", note: "2 treks" });
  });

  it("asks for the Google title and description, then for the Google checks", () => {
    expect(readiness().seo).toEqual({ status: "todo", note: "Add the Google title and description" });
    expect(readiness({ seoTitle: "Langtang Valley Trek", seoDescription: "Short." }).seo).toEqual({ status: "warn", note: "1 of 7 Google checks" });
  });

  it("counts the shared sections that show", () => {
    expect(readiness().shared).toEqual({ status: "done", note: "11 of 11 shown" });
    expect(readiness({ hiddenSharedSections: ["newsletter", "meals"] }).shared.note).toBe("9 of 11 shown");
  });
});
