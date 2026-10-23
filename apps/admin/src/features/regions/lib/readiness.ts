import type { SectionReadiness } from "@/components/editor/types";
import { isRichTextEmpty } from "@/lib/richText/richText";

import { RECOMMENDED_FAQS } from "../constants";
import type { RegionPhotos, RegionSectionKey, RegionValues } from "../types";
import { formatBestMonths } from "./bestMonths";

/** The sections an admin can fill in now (the others wait on treks, guides and travel guides). */
export type ReadySectionKey = Extract<RegionSectionKey, "basics" | "photos" | "facts" | "months" | "faq" | "seo">;

const countFilled = (values: string[]) => values.filter((value) => value.trim()).length;

const basics = (region: RegionValues): SectionReadiness => {
  const missing = [
    !region.tagline && "tagline",
    isRichTextEmpty(region.introduction) && "introduction",
    region.latitude === null && "map pin",
  ].filter(Boolean);
  if (!missing.length) return { status: "done", note: "Name, location, intro" };
  return { status: "todo", note: `Add the ${missing.join(", ")}` };
};

const facts = (region: RegionValues): SectionReadiness => {
  const all = [
    region.highestPoint,
    region.trekLength,
    region.difficulty,
    region.gettingThere,
    region.gettingThereDetails,
    region.permits,
  ];
  const filled = countFilled(all);
  if (filled === all.length) return { status: "done", note: "Altitude, length, permits" };
  return { status: "todo", note: `${filled} of ${all.length} filled in` };
};

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

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** Only the cover is needed; "taken at" is optional and never asked for. */
const photos = ({ cover, gallery }: RegionPhotos): SectionReadiness => {
  if (!cover) return { status: "todo", note: "Add a cover photo" };
  return { status: "done", note: `Cover + ${plural(gallery.length, "photo")}` };
};

/** How complete each section is, from the saved values (the editor's checklist and the region cards). */
export const getRegionReadiness = (region: RegionValues, regionPhotos: RegionPhotos): Record<ReadySectionKey, SectionReadiness> => ({
  basics: basics(region),
  photos: photos(regionPhotos),
  facts: facts(region),
  months: months(region),
  faq: faq(region),
  seo: seo(region),
});

export const countDoneSections = (readiness: Record<ReadySectionKey, SectionReadiness>) =>
  Object.values(readiness).filter((section) => section.status === "done").length;
