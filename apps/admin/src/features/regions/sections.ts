import type { IconName } from "@ttn/ui/icon";

import type { RegionSectionKey } from "./types";

export type RegionSection = {
  key: RegionSectionKey;
  label: string;
  icon: IconName;
  description: string;
  /** Sections that wait on another feature (photo uploads, treks, guides, travel guides). */
  waitsFor?: string;
};

/** The editor's sections, in the design's order (Admin-region-editor.dc.html). */
export const REGION_SECTIONS: RegionSection[] = [
  {
    key: "basics",
    label: "Basics",
    icon: "description",
    description: "Region name, web address, map location, tagline and introduction.",
  },
  {
    key: "photos",
    label: "Photos",
    icon: "photo_library",
    description: "The cover photo for the region card and page header, and the gallery.",
  },
  {
    key: "facts",
    label: "Region facts",
    icon: "view_agenda",
    description: "Highest point, length, difficulty, how to get there and permits.",
  },
  { key: "months", label: "Best months", icon: "calendar_month", description: "Which months are best for trekking in this region." },
  {
    key: "treks",
    label: "Treks",
    icon: "landscape",
    description: "The treks in this region and nearby treks to suggest.",
    waitsFor: "treks",
  },
  {
    key: "guides",
    label: "Guides",
    icon: "hiking",
    description: "The guides who lead treks here, shown on the region page.",
    waitsFor: "trekking guides",
  },
  {
    key: "articles",
    label: "Travel guides",
    icon: "article",
    description: "Travel guides about this region. Pin the best ones.",
    waitsFor: "travel guides",
  },
  {
    key: "faq",
    label: "Questions and answers",
    icon: "quiz",
    description: "Questions about the region, shown near the bottom of the region page.",
  },
  { key: "seo", label: "Google", icon: "travel_explore", description: "How the region page appears in Google." },
];

/** Which section each saved field is on, to open the right one when a field has an error. */
const FIELD_SECTIONS: Record<string, RegionSectionKey> = {
  name: "basics",
  district: "basics",
  slug: "basics",
  latitude: "basics",
  longitude: "basics",
  pinLabel: "basics",
  tagline: "basics",
  introduction: "basics",
  bestFor: "basics",
  highestPoint: "facts",
  trekLength: "facts",
  difficulty: "facts",
  gettingThere: "facts",
  gettingThereDetails: "facts",
  permits: "facts",
  monthRatings: "months",
  seasons: "months",
  faqs: "faq",
  seoKeyword: "seo",
  seoTitle: "seo",
  seoDescription: "seo",
  photos: "photos",
};

/** The sections that have a field with an error. */
export const sectionsWithErrors = (fields: string[]): Set<RegionSectionKey> =>
  new Set(fields.map((field) => FIELD_SECTIONS[field.split(".")[0]]).filter(Boolean));

/** The first section (in display order) that has a field with an error. */
export const firstSectionWithError = (fields: string[]): RegionSectionKey | undefined => {
  const sections = sectionsWithErrors(fields);
  return REGION_SECTIONS.find((section) => sections.has(section.key))?.key;
};
