import { describe, expect, it } from "vitest";

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

describe("getTrekReadiness", () => {
  it("lists what a new trek still needs", () => {
    const readiness = getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY);
    expect(readiness.basics).toEqual({ status: "todo", note: "Add the summary and 7 trip facts" });
    expect(readiness.photos).toEqual({ status: "todo", note: "Add a cover photo" });
    expect(readiness.overview).toEqual({ status: "todo", note: "Add the introduction" });
  });

  it("asks for 4–6 highlights and a suitability checklist in the overview", () => {
    const introduction = { type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text: "Intro." }] }] };
    const point = { title: "Title", text: "Text." };
    const withIntro = { ...EMPTY_TREK_VALUES, introduction };
    expect(getTrekReadiness(withIntro, NO_TREK_PHOTOS, TODAY).overview).toEqual({ status: "todo", note: "Add the highlights" });
    expect(getTrekReadiness({ ...withIntro, highlights: [point, point] }, NO_TREK_PHOTOS, TODAY).overview).toEqual({ status: "warn", note: "Only 2 highlights" });
    const fourHighlights = { ...withIntro, highlights: [point, point, point, point] };
    expect(getTrekReadiness(fourHighlights, NO_TREK_PHOTOS, TODAY).overview.note).toBe("Add “Is this trek for you?”");
    expect(getTrekReadiness({ ...fourHighlights, suitabilityPoints: [point] }, NO_TREK_PHOTOS, TODAY).overview).toEqual({ status: "done", note: "Intro, 4 highlights" });
  });

  it("asks for days, a description for each day and a highlight day", () => {
    const planDay = { id: "d1", place: "", title: "Day", subtitle: "", duration: "", altitudeM: 2000, sleepAltitudeM: null, isHighPoint: false, description: "", photo: null };
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).itinerary).toEqual({ status: "todo", note: "Add the days" });
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, itinerary: [planDay, planDay] }, NO_TREK_PHOTOS, TODAY).itinerary.note).toBe("2 days without a description");
    const described = { ...planDay, description: "Walk." };
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, itinerary: [described] }, NO_TREK_PHOTOS, TODAY).itinerary.note).toBe("Mark the highlight day");
    const plan = [described, { ...described, isHighPoint: true }];
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, itinerary: plan }, NO_TREK_PHOTOS, TODAY).itinerary).toEqual({ status: "done", note: "2 days" });
  });

  it("asks for what's covered, then what's not and the food budget", () => {
    const point = { title: "Permits", text: "TIMS card." };
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).included).toEqual({ status: "todo", note: "Add what the price includes" });
    const covered = { ...EMPTY_TREK_VALUES, included: [point, point] };
    expect(getTrekReadiness(covered, NO_TREK_PHOTOS, TODAY).included.note).toBe("Add what is not included");
    expect(getTrekReadiness({ ...covered, excluded: [point] }, NO_TREK_PHOTOS, TODAY).included.note).toBe("Add the daily food budget");
    const full = { ...covered, excluded: [point], mealBudgetMinUsd: 20, mealBudgetMaxUsd: 30 };
    expect(getTrekReadiness(full, NO_TREK_PHOTOS, TODAY).included).toEqual({ status: "done", note: "2 included · 1 not" });
  });

  it("asks for group prices, and for upcoming dates on a fixed-date trek", () => {
    const price = { id: "p1", label: "2 people", shortLabel: "2 Pax", priceUsd: 965, team: "", isDefault: true };
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).prices).toEqual({ status: "todo", note: "Add the group prices" });
    const priced = { ...EMPTY_TREK_VALUES, groupPrices: [price] };
    expect(getTrekReadiness(priced, NO_TREK_PHOTOS, TODAY).prices).toEqual({ status: "done", note: "1 group price · your dates" });
    const past = { id: "d1", startDate: "2026-01-10", status: "open" as const, note: "" };
    const fixed = { ...priced, hasFixedDates: true, departures: [past] };
    expect(getTrekReadiness(fixed, NO_TREK_PHOTOS, TODAY).prices).toEqual({ status: "warn", note: "No upcoming dates" });
    const upcoming = { ...past, id: "d2", startDate: TODAY };
    expect(getTrekReadiness({ ...fixed, departures: [past, upcoming] }, NO_TREK_PHOTOS, TODAY).prices.note).toBe("1 group price · 1 date");
  });

  it("is done when the summary and all trip facts are filled in", () => {
    const trek: TrekValues = {
      ...EMPTY_TREK_VALUES,
      summary: "Glaciers and yak pastures.",
      startFinish: "Kathmandu / Syabrubesi",
      dailyWalking: "5 to 7 hours a day",
      guideRatio: "1 : 4 + porters",
      seasonLabel: "Mar–May, Oct–Nov",
      accommodation: "Teahouse and hotel",
      transport: "Jeep to Syabrubesi",
      distanceKm: 75,
    };
    expect(getTrekReadiness(trek, NO_TREK_PHOTOS, TODAY).basics.status).toBe("done");
    expect(getTrekReadiness({ ...trek, transport: " " }, NO_TREK_PHOTOS, TODAY).basics.note).toBe("Add 1 trip fact");
  });

  it("asks for the map place and a packing list", () => {
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).practical).toEqual({ status: "todo", note: "Add the place for the map" });
    const mapped = { ...EMPTY_TREK_VALUES, mapPlace: "Kyanjin Gompa, Langtang, Nepal" };
    expect(getTrekReadiness(mapped, NO_TREK_PHOTOS, TODAY).practical).toEqual({ status: "todo", note: "Add the packing list" });
    const packed = { ...mapped, packingGroups: [{ title: "Clothing", icon: "apparel" as const, items: [{ title: "Hat", text: "warm." }] }] };
    expect(getTrekReadiness(packed, NO_TREK_PHOTOS, TODAY).practical).toEqual({ status: "done", note: "Map · 1 packing card" });
    expect(getTrekReadiness({ ...packed, myMapsId: "1AbCdEfGhIjK" }, NO_TREK_PHOTOS, TODAY).practical.note).toBe("GPS trail map · 1 packing card");
  });

  it("asks for questions, and for at least 6 of them", () => {
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).faq).toEqual({ status: "todo", note: "Add the questions" });
    const item = { question: "Why?", answer: "Because." };
    const topic = { title: "General", icon: "info" as const, items: [item, item, item] };
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, faqs: [topic] }, NO_TREK_PHOTOS, TODAY).faq).toEqual({ status: "warn", note: "Only 3 questions" });
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, faqs: [topic, topic] }, NO_TREK_PHOTOS, TODAY).faq).toEqual({ status: "done", note: "6 questions · 2 topics" });
  });

  it("asks for the Google title and description, then for the Google checks", () => {
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).seo).toEqual({ status: "todo", note: "Add the Google title and description" });
    const written = { ...EMPTY_TREK_VALUES, seoTitle: "Langtang Valley Trek", seoDescription: "Short." };
    expect(getTrekReadiness(written, NO_TREK_PHOTOS, TODAY).seo).toEqual({ status: "warn", note: "1 of 7 Google checks" });
  });

  it("counts the shared sections that show", () => {
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).shared).toEqual({ status: "done", note: "9 of 9 shown" });
    expect(getTrekReadiness({ ...EMPTY_TREK_VALUES, hiddenSharedSections: ["newsletter"] }, NO_TREK_PHOTOS, TODAY).shared.note).toBe("8 of 9 shown");
  });

  it("asks for guides, then for the line about them", () => {
    expect(getTrekReadiness(EMPTY_TREK_VALUES, NO_TREK_PHOTOS, TODAY).guides).toEqual({ status: "todo", note: "Pick the guides" });
    const picked = { ...EMPTY_TREK_VALUES, guideIds: ["g1", "g2"] };
    expect(getTrekReadiness(picked, NO_TREK_PHOTOS, TODAY).guides).toEqual({ status: "warn", note: "Add the line about the guides" });
    expect(getTrekReadiness({ ...picked, guidesIntro: "Local guides." }, NO_TREK_PHOTOS, TODAY).guides).toEqual({ status: "done", note: "2 guides" });
  });
});
