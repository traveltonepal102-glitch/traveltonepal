import { createSectionErrorLookup } from "@/components/editor/sectionErrors";
import type { EditorSection } from "@/components/editor/types";

import type { RegionSectionKey } from "./types";

export type RegionSection = EditorSection<RegionSectionKey>;

/**
 * The editor's sections in the order of the region page on the website, with its small labels ("Treks") and
 * headings ("Trek in {name}"), so each part of the editor matches what it fills on the page.
 */
export const REGION_SECTIONS: RegionSection[] = [
  {
    key: "basics",
    label: "Top of the page",
    icon: "description",
    description: "The name and web address, the lines over the big photo, and the region's card on the Regions page.",
  },
  { key: "facts", label: "Key facts", icon: "view_agenda", description: "The six facts on the card under the big photo." },
  {
    key: "about",
    label: "About the region",
    icon: "notes",
    description: "The heading, the introduction, “Best for” and the cards on why to trek here.",
  },
  { key: "where", label: "Where it is", icon: "map", description: "The pin on the map of Nepal and how to get there." },
  {
    key: "treks",
    label: "Treks",
    pageTitle: "Trek in {name}",
    icon: "landscape",
    description: "The region's treks with the featured one, nearby treks to suggest, and “Want your own route?”.",
  },
  {
    key: "months",
    label: "Best time to go",
    pageTitle: "When to trek {name}",
    icon: "calendar_month",
    description: "Each month rated, and a note for each season.",
  },
  {
    key: "guides",
    label: "Your guides",
    pageTitle: "Guides who grew up in {name}",
    icon: "hiking",
    description: "The guides who lead treks here, from Trekking guides.",
  },
  {
    key: "photos",
    label: "Photos",
    pageTitle: "See the valley",
    icon: "photo_library",
    description: "The cover is the big photo at the top of the page; the gallery shows here.",
  },
  {
    key: "articles",
    label: "Travel guides",
    pageTitle: "Before you go to {name}",
    icon: "article",
    description: "Travel guides about this region. Pin the best ones.",
  },
  {
    key: "faq",
    label: "Questions",
    pageTitle: "{name} questions, answered",
    icon: "quiz",
    description: "Questions about the region, near the bottom of the page and in Google.",
  },
  {
    key: "compare",
    label: "Other regions",
    pageTitle: "Compare with other regions",
    icon: "compare_arrows",
    description: "Up to 4 regions to compare with, at the bottom of the page.",
  },
  { key: "seo", label: "Google", icon: "travel_explore", description: "How the region page appears in Google." },
];

/** Which section each saved field is on, to open the right one when a field has an error. */
const FIELD_SECTIONS: Record<string, RegionSectionKey> = {
  name: "basics",
  district: "basics",
  slug: "basics",
  latitude: "where",
  longitude: "where",
  pinLabel: "where",
  tagline: "basics",
  heroHighlight: "basics",
  shortName: "basics",
  summary: "basics",
  gettingThereDetails: "basics",
  overviewHeading: "about",
  introduction: "about",
  bestFor: "about",
  whyPoints: "about",
  maxAltitudeM: "facts",
  trekLength: "facts",
  difficulty: "facts",
  gettingThere: "facts",
  isFlight: "facts",
  permits: "facts",
  fromKathmandu: "where",
  nearestAirport: "where",
  permitsDetails: "where",
  whereYouSleep: "where",
  compareRegionIds: "compare",
  pinnedArticleIds: "articles",
  monthRatings: "months",
  seasons: "months",
  faqs: "faq",
  featuredTrekId: "treks",
  featuredTrekLabel: "treks",
  featuredTrekPitch: "treks",
  nearbyTreks: "treks",
  customRoutePitch: "treks",
  hiddenGuideIds: "guides",
  guidesListed: "guides",
  guidesShown: "guides",
  seoKeyword: "seo",
  seoTitle: "seo",
  seoDescription: "seo",
  photos: "photos",
};

export const { sectionsWithErrors, firstSectionWithError } = createSectionErrorLookup(REGION_SECTIONS, FIELD_SECTIONS);
