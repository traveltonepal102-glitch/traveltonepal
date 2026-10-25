import { formatBestMonths } from "@ttn/ui/lib/bestMonths";

import type { SectionReadiness } from "@/components/editor/types";
import { isRichTextEmpty } from "@/lib/richText/richText";

import { RECOMMENDED_FAQS } from "../constants";
import type { RegionPhotos, RegionSectionKey, RegionValues } from "../types";

/** Every section has its readiness now. */
export type ReadySectionKey = RegionSectionKey;

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const countFilled = (values: string[]) => values.filter((value) => value.trim()).length;

/** Needs the tagline; the photo highlight and the Regions-page card text are reminders. */
const basics = (region: RegionValues): SectionReadiness => {
  if (!region.tagline.trim()) return { status: "todo", note: "Add the tagline" };
  const missing = [!region.heroHighlight.trim() && "the photo highlight", !region.summary.trim() && "the card summary"].filter(Boolean);
  if (missing.length) return { status: "warn", note: `Add ${missing.join(" and ")}` };
  return { status: "done", note: "Tagline, highlight, card" };
};

const facts = (region: RegionValues): SectionReadiness => {
  const all = [region.maxAltitudeM !== null, Boolean(region.trekLength.trim()), region.difficulty !== null, Boolean(region.gettingThere.trim()), Boolean(region.permits.trim())];
  const filled = all.filter(Boolean).length;
  if (filled === all.length) return { status: "done", note: "Altitude, length, difficulty, access" };
  return { status: "todo", note: `${filled} of ${all.length} filled in` };
};

/** Needs the introduction; the heading and the "why trek here" cards are reminders. */
const about = (region: RegionValues): SectionReadiness => {
  if (isRichTextEmpty(region.introduction)) return { status: "todo", note: "Add the introduction" };
  if (!region.overviewHeading.trim()) return { status: "warn", note: "Add the heading" };
  if (!region.whyPoints.length) return { status: "warn", note: "Add the “why trek here” cards" };
  return { status: "done", note: `Intro, ${plural(region.whyPoints.length, "card")}` };
};

/** Needs the map pin; the four "how to get there" lines are a reminder. */
const where = (region: RegionValues): SectionReadiness => {
  if (region.latitude === null) return { status: "todo", note: "Add the map pin" };
  const lines = countFilled([region.fromKathmandu, region.nearestAirport, region.permitsDetails, region.whereYouSleep]);
  if (lines < 4) return { status: "warn", note: `${lines} of 4 lines filled in` };
  return { status: "done", note: "Map pin, 4 lines" };
};

/** Optional: without picks the website chooses. */
const compare = (region: RegionValues): SectionReadiness => ({
  status: "done",
  note: region.compareRegionIds.length ? plural(region.compareRegionIds.length, "region") : "Chosen by the website",
});

const months = (region: RegionValues): SectionReadiness => {
  const best = formatBestMonths(region.monthRatings);
  if (!best) return { status: "todo", note: "No best months yet" };
  const notes = countFilled(Object.values(region.seasons));
  if (notes < 4) return { status: "warn", note: `Best: ${best} · ${notes} of 4 season notes` };
  return { status: "done", note: `Best: ${best}` };
};

const faq = (region: RegionValues): SectionReadiness => {
  const count = region.faqs.length;
  if (!count) return { status: "todo", note: "No questions yet" };
  if (count < RECOMMENDED_FAQS) return { status: "warn", note: `Only ${count} question${count === 1 ? "" : "s"}` };
  return { status: "done", note: `${count} questions` };
};

const seo = (region: RegionValues): SectionReadiness => {
  if (region.seoTitle && region.seoDescription) return { status: "done", note: "Title and description" };
  return { status: "todo", note: "Add the Google title and description" };
};

/** Only the cover is needed; "taken at" is optional and never asked for. */
const photos = ({ cover, gallery }: RegionPhotos): SectionReadiness => {
  if (!cover) return { status: "todo", note: "Add a cover photo" };
  return { status: "done", note: `Cover + ${plural(gallery.length, "photo")}` };
};

/** Needs a featured trek (one of the region's own); nearby treks are optional. */
const treks = (region: RegionValues): SectionReadiness => {
  if (!region.featuredTrekId) return { status: "todo", note: "Pick the featured trek" };
  const nearby = region.nearbyTreks.length;
  return { status: "done", note: nearby ? `Featured trek · ${nearby} nearby` : "Featured trek" };
};

/** Guides show by themselves (anyone with this region in Trekking guides); none showing is a to-do. */
const guides = (region: RegionValues, leadingGuideIds: string[]): SectionReadiness => {
  const shown = leadingGuideIds.filter((id) => !region.hiddenGuideIds.includes(id)).length;
  if (!leadingGuideIds.length) return { status: "todo", note: "No guides lead here yet" };
  if (!shown) return { status: "todo", note: "All guides switched off" };
  return { status: "done", note: plural(shown, "guide") };
};

/** Travel guides show by themselves (any guide with this region ticked); none yet is a reminder, pins are optional. */
const articles = (region: RegionValues, articleIds: string[]): SectionReadiness => {
  if (!articleIds.length) return { status: "warn", note: "No travel guides yet" };
  const pinned = region.pinnedArticleIds.length;
  return { status: "done", note: pinned ? `${plural(articleIds.length, "guide")} · ${pinned} pinned` : plural(articleIds.length, "guide") };
};

/**
 * How complete each section is, from the saved values (the editor's checklist and the region cards).
 * `leadingGuideIds`: every guide with this region in Trekking guides; `articleIds`: every travel guide about it.
 */
export const getRegionReadiness = (
  region: RegionValues,
  regionPhotos: RegionPhotos,
  leadingGuideIds: string[],
  articleIds: string[],
): Record<ReadySectionKey, SectionReadiness> => ({
  basics: basics(region),
  facts: facts(region),
  about: about(region),
  where: where(region),
  treks: treks(region),
  months: months(region),
  guides: guides(region, leadingGuideIds),
  photos: photos(regionPhotos),
  articles: articles(region, articleIds),
  faq: faq(region),
  compare: compare(region),
  seo: seo(region),
});

export const countDoneSections = (readiness: Record<ReadySectionKey, SectionReadiness>) =>
  Object.values(readiness).filter((section) => section.status === "done").length;
