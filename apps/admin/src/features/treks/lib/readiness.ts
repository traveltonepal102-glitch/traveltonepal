import type { SectionReadiness } from "@/components/editor/types";
import { isRichTextEmpty, richTextToPlainText } from "@/lib/richText/richText";

import { RECOMMENDED_FAQS, RECOMMENDED_HIGHLIGHTS, SHARED_SECTIONS, TREK_LIMITS } from "../constants";
import type { TrekPhotos, TrekSectionKey, TrekValues } from "../types";
import { getSeoChecks } from "./seoChecks";

/** Every section has something to fill in or check. */
export type ReadyTrekSectionKey = TrekSectionKey;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** The boxes of the trip overview the admin types (the others come from the days, difficulty and season). */
const TRIP_FACTS = ["startFinish", "dailyWalking", "guideRatio", "seasonLabel", "accommodation", "transport", "activity", "distanceKm"] as const;

const isFilled = (value: string | number | null) => (typeof value === "string" ? value.trim() !== "" : value !== null);

/** Needs the big heading and the summary; the season, the trek style tag and the high point are reminders. */
const top = (trek: TrekValues): SectionReadiness => {
  if (!trek.headline.trim()) return { status: "todo", note: "Add the big heading" };
  if (!trek.summary.trim()) return { status: "todo", note: "Add the short summary" };
  const missing = [!trek.currentSeason.trim() && "season", !trek.category.trim() && "trek style", !trek.highPoint.trim() && "high point"].filter(Boolean);
  if (missing.length) return { status: "warn", note: `Add the ${missing.join(", ")}` };
  return { status: "done", note: "Heading, lines, tags" };
};

const intro = (trek: TrekValues): SectionReadiness => {
  if (isRichTextEmpty(trek.introduction)) return { status: "todo", note: "Add the introduction" };
  return { status: "done", note: `${richTextToPlainText(trek.introduction).split(/\s+/).length} words` };
};

const facts = (trek: TrekValues): SectionReadiness => {
  const missing = TRIP_FACTS.filter((fact) => !isFilled(trek[fact])).length;
  if (missing) return { status: "todo", note: `Add ${plural(missing, "trip fact")}` };
  return { status: "done", note: "12 facts" };
};

const photos = ({ cover, gallery }: TrekPhotos): SectionReadiness => {
  if (!cover) return { status: "todo", note: "Add a cover photo" };
  return { status: "done", note: `Cover + ${plural(gallery.length, "photo")}` };
};

/** Needs highlights; fewer than the 4–6 the design asks for is a reminder. */
const highlights = (trek: TrekValues): SectionReadiness => {
  if (!trek.highlights.length) return { status: "todo", note: "Add the highlights" };
  if (trek.highlights.length < RECOMMENDED_HIGHLIGHTS) return { status: "warn", note: `Only ${plural(trek.highlights.length, "highlight")}` };
  return { status: "done", note: plural(trek.highlights.length, "highlight") };
};

const fit = (trek: TrekValues): SectionReadiness => {
  if (!trek.suitabilityPoints.length) return { status: "todo", note: "Add the checklist" };
  return { status: "done", note: plural(trek.suitabilityPoints.length, "topic") };
};

/** Needs days; a highlight day and a description for every day are reminders. */
const itinerary = (trek: TrekValues): SectionReadiness => {
  const days = trek.itinerary;
  if (!days.length) return { status: "todo", note: "Add the days" };
  const undescribed = days.filter((day) => isRichTextEmpty(day.description)).length;
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

/** Needs group prices (trekkers pick their own start date, so there are no dates to add). */
const prices = (trek: TrekValues): SectionReadiness => {
  if (!trek.groupPrices.length) return { status: "todo", note: "Add the group prices" };
  return { status: "done", note: `${plural(trek.groupPrices.length, "group price")} · any start date` };
};

/** Needs something for the map to show; the printable PDF map is a reminder (its button stays hidden without one). */
const route = (trek: TrekValues): SectionReadiness => {
  if (!trek.mapPlace.trim() && !trek.myMapsId) return { status: "todo", note: "Add the map" };
  if (!trek.pdfMapPath) return { status: "warn", note: "No printable map yet" };
  return { status: "done", note: `${trek.myMapsId ? "GPS trail map" : "Map"} · PDF map` };
};

const packing = (trek: TrekValues): SectionReadiness => {
  if (!trek.packingGroups.length) return { status: "todo", note: "Add the packing list" };
  return { status: "done", note: plural(trek.packingGroups.length, "group") };
};

/** Needs topics; a heading longer than Google shows is a reminder. */
const know = (trek: TrekValues): SectionReadiness => {
  if (!trek.knowTopics.length) return { status: "todo", note: "Add the topics" };
  if (trek.knowHeading.length > TREK_LIMITS.headingRecommended) return { status: "warn", note: "Heading is a bit long" };
  return { status: "done", note: plural(trek.knowTopics.length, "topic") };
};

/** Optional: without picks the website chooses. */
const similar = (trek: TrekValues): SectionReadiness => ({
  status: "done",
  note: trek.similarTrekIds.length ? plural(trek.similarTrekIds.length, "trek") : "Chosen by the website",
});

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
  return { status: "done", note: "Title and description" };
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

/** How complete each section is, from the saved values (the editor's checklist). */
export const getTrekReadiness = (trek: TrekValues, trekPhotos: TrekPhotos): Record<ReadyTrekSectionKey, SectionReadiness> => ({
  top: top(trek),
  photos: photos(trekPhotos),
  intro: intro(trek),
  facts: facts(trek),
  highlights: highlights(trek),
  fit: fit(trek),
  itinerary: itinerary(trek),
  inclusions: included(trek),
  guides: guides(trek),
  route: route(trek),
  pricing: prices(trek),
  packing: packing(trek),
  know: know(trek),
  faq: faq(trek),
  similar: similar(trek),
  seo: seo(trek),
  shared: shared(trek),
});
