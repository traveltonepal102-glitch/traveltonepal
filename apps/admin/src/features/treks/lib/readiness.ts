import type { SectionReadiness } from "@/components/editor/types";
import { isRichTextEmpty } from "@/lib/richText/richText";

import { RECOMMENDED_FAQS, RECOMMENDED_HIGHLIGHTS, SHARED_SECTIONS } from "../constants";
import type { TrekPhotos, TrekSectionKey, TrekValues } from "../types";
import { getSeoChecks } from "./seoChecks";

/** The sections an admin can fill in now (the others come in later steps). */
export type ReadyTrekSectionKey = Extract<TrekSectionKey, "basics" | "photos" | "overview" | "itinerary" | "included" | "prices" | "practical" | "faq" | "seo" | "shared" | "guides">;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const TRIP_FACTS: (keyof TrekValues)[] = ["startFinish", "dailyWalking", "guideRatio", "seasonLabel", "accommodation", "transport", "distanceKm"];

const isFilled = (value: TrekValues[keyof TrekValues]) => (typeof value === "string" ? value.trim() !== "" : value !== null);

const basics = (trek: TrekValues): SectionReadiness => {
  const missingFacts = TRIP_FACTS.filter((fact) => !isFilled(trek[fact])).length;
  const missing = [!trek.summary.trim() && "the summary", missingFacts && plural(missingFacts, "trip fact")].filter(Boolean);
  if (!missing.length) return { status: "done", note: "Name, difficulty, trip facts" };
  return { status: "todo", note: `Add ${missing.join(" and ")}` };
};

const photos = ({ cover, gallery }: TrekPhotos): SectionReadiness => {
  if (!cover) return { status: "todo", note: "Add a cover photo" };
  return { status: "done", note: `Cover + ${plural(gallery.length, "photo")}` };
};

/** Needs the introduction and some highlights; "Is this trek for you?" and the 4–6 highlights are reminders. */
const overview = (trek: TrekValues): SectionReadiness => {
  if (isRichTextEmpty(trek.introduction)) return { status: "todo", note: "Add the introduction" };
  if (!trek.highlights.length) return { status: "todo", note: "Add the highlights" };
  if (trek.highlights.length < RECOMMENDED_HIGHLIGHTS) return { status: "warn", note: `Only ${plural(trek.highlights.length, "highlight")}` };
  if (!trek.suitabilityPoints.length) return { status: "warn", note: "Add “Is this trek for you?”" };
  return { status: "done", note: `Intro, ${plural(trek.highlights.length, "highlight")}` };
};

/** Needs days; a highlight day and a description for every day are reminders. */
const itinerary = (trek: TrekValues): SectionReadiness => {
  const days = trek.itinerary;
  if (!days.length) return { status: "todo", note: "Add the days" };
  const undescribed = days.filter((day) => !day.description.trim()).length;
  if (undescribed) return { status: "warn", note: `${plural(undescribed, "day")} without a description` };
  if (!days.some((day) => day.isHighPoint)) return { status: "warn", note: "Mark the highlight day" };
  return { status: "done", note: plural(days.length, "day") };
};

/** Needs what's covered; what's not covered and the food budget are reminders (visitors ask about both). */
const included = (trek: TrekValues): SectionReadiness => {
  if (!trek.included.length) return { status: "todo", note: "Add what the price includes" };
  if (!trek.excluded.length) return { status: "warn", note: "Add what is not included" };
  if (trek.mealBudgetMinUsd === null) return { status: "warn", note: "Add the daily food budget" };
  return { status: "done", note: `${trek.included.length} included · ${trek.excluded.length} not` };
};

/** Needs group prices; a trek on fixed dates with none still to come gets a reminder. */
const prices = (trek: TrekValues, today: string): SectionReadiness => {
  if (!trek.groupPrices.length) return { status: "todo", note: "Add the group prices" };
  const groups = plural(trek.groupPrices.length, "group price");
  if (!trek.hasFixedDates) return { status: "done", note: `${groups} · your dates` };
  const upcoming = trek.departures.filter((departure) => departure.startDate >= today).length;
  if (!upcoming) return { status: "warn", note: "No upcoming dates" };
  return { status: "done", note: `${groups} · ${plural(upcoming, "date")}` };
};

/** Needs the map's place and a packing list (the trek page shows both sections). */
const practical = (trek: TrekValues): SectionReadiness => {
  if (!trek.mapPlace.trim()) return { status: "todo", note: "Add the place for the map" };
  if (!trek.packingGroups.length) return { status: "todo", note: "Add the packing list" };
  return { status: "done", note: `${trek.myMapsId ? "GPS trail map" : "Map"} · ${plural(trek.packingGroups.length, "packing card")}` };
};

/** Needs questions; fewer than recommended is a reminder (Google gets every question on the trek). */
const faq = (trek: TrekValues): SectionReadiness => {
  const questions = trek.faqs.reduce((count, topic) => count + topic.items.length, 0);
  if (!questions) return { status: "todo", note: "Add the questions" };
  if (questions < RECOMMENDED_FAQS) return { status: "warn", note: `Only ${plural(questions, "question")}` };
  return { status: "done", note: `${plural(questions, "question")} · ${plural(trek.faqs.length, "topic")}` };
};

/** Needs the Google title and description; the Google checklist not all ticked is a reminder. */
const seo = (trek: TrekValues): SectionReadiness => {
  if (!trek.seoTitle.trim() || !trek.seoDescription.trim()) return { status: "todo", note: "Add the Google title and description" };
  const checks = getSeoChecks(trek);
  const done = checks.filter((check) => check.isDone).length;
  if (done < checks.length) return { status: "warn", note: `${done} of ${checks.length} Google checks` };
  const similar = trek.similarTrekIds.length ? plural(trek.similarTrekIds.length, "similar trek") : "similar treks automatic";
  return { status: "done", note: `Title, description · ${similar}` };
};

/** Needs at least one guide (the trek page leaves "Meet your trek guide" out without one). */
const guides = (trek: TrekValues): SectionReadiness => {
  if (!trek.guideIds.length) return { status: "todo", note: "Pick the guides" };
  if (!trek.guidesIntro.trim()) return { status: "warn", note: "Add the line about the guides" };
  return { status: "done", note: plural(trek.guideIds.length, "guide") };
};

/** Nothing to fill in: it says how many of the shared sections show. */
const shared = (trek: TrekValues): SectionReadiness => ({
  status: "done",
  note: `${SHARED_SECTIONS.length - trek.hiddenSharedSections.length} of ${SHARED_SECTIONS.length} shown`,
});

/** How complete each section is, from the saved values (the editor's checklist). `today`: "YYYY-MM-DD" in Nepal. */
export const getTrekReadiness = (trek: TrekValues, trekPhotos: TrekPhotos, today: string): Record<ReadyTrekSectionKey, SectionReadiness> => ({
  basics: basics(trek),
  photos: photos(trekPhotos),
  overview: overview(trek),
  itinerary: itinerary(trek),
  included: included(trek),
  prices: prices(trek, today),
  practical: practical(trek),
  faq: faq(trek),
  seo: seo(trek),
  shared: shared(trek),
  guides: guides(trek),
});
