import type { TrekPageSection } from "@ttn/config/trekPageSections";

import { createSectionErrorLookup } from "@/components/editor/sectionErrors";
import type { EditorSection } from "@/components/editor/types";

import { TREK_PAGE_SECTION_INFO } from "./pageSections";
import type { TrekSectionKey } from "./types";

/**
 * The editor's sections in the order of the trek page, with the page's own titles (design: Admin-trek-editor),
 * so each part of the editor matches what it fills on the page.
 */
export const TREK_SECTIONS: EditorSection<TrekSectionKey>[] = [
  {
    key: "top",
    label: "Top of the page",
    icon: "web",
    description: "The trek name, the big heading, the web address, and the lines, tags and badges around them.",
  },
  {
    key: "photos",
    label: "Photo gallery and videos",
    icon: "photo_library",
    description: "The photos at the top of the page and in the photo viewer, plus the YouTube videos.",
  },
  {
    key: "intro",
    label: "Introduction",
    icon: "notes",
    description: "The opening text under the photos. Visitors see the first lines and click “Read more” for the rest.",
  },
  {
    key: "facts",
    label: "Trip overview and key specifications",
    icon: "table",
    description: "The 12 boxes with the key facts of the trek.",
  },
  { key: "highlights", label: "Highlights", icon: "star", description: "Why people love this trek: a short title and one sentence each." },
  {
    key: "fit",
    label: "Is this trek for you?",
    icon: "checklist",
    description: "An honest checklist so people can decide if the trek suits them.",
  },
  {
    key: "itinerary",
    label: "Day-by-day itinerary",
    icon: "route",
    description: "The text above the days and every day of the trek. The altitude chart is made from it.",
  },
  {
    key: "inclusions",
    label: "What’s covered · What’s not included",
    icon: "task_alt",
    description: "What the price includes and what it doesn’t, the food budget, pro tips and teahouse notes.",
  },
  { key: "guides", label: "Meet your trek guide", icon: "hiking", description: "Pick the guides who lead this trek, from your Trekking guides." },
  {
    key: "route",
    label: "Route and elevation profile",
    icon: "map",
    description: "The altitude chart, the route map and the printable PDF map.",
  },
  {
    key: "pricing",
    label: "Group rates by team size",
    icon: "payments",
    description: "Price per person by group size. Trekkers pick their own start date.",
  },
  { key: "packing", label: "Packing list", icon: "backpack", description: "The packing list cards for this trek." },
  {
    key: "know",
    label: "Trek guide: season, facilities and safety",
    icon: "auto_stories",
    description: "Practical knowledge: best season, teahouses, food and water, and emergencies.",
  },
  { key: "faq", label: "Frequently asked questions", icon: "quiz", description: "Questions grouped by topic, near the bottom of the trek page." },
  { key: "similar", label: "Similar trekking options in Nepal", icon: "travel_explore", description: "The treks suggested at the end of the page." },
  { key: "seo", label: "Google search result", icon: "query_stats", description: "How the trek looks in Google. Not shown on the page itself." },
  {
    key: "shared",
    label: "Sections shared by every trek",
    icon: "view_agenda",
    description: "Sections written once for every trek. Choose which ones show on this trek.",
  },
  {
    key: "order",
    label: "Order of the page sections",
    icon: "format_list_numbered",
    description: "Put every section of the trek page in the order you want, the shared ones too. Drag a row or use its arrows.",
  },
];

/** Which section each saved field is on, to open the right one when a field has an error. */
const FIELD_SECTIONS: Record<string, TrekSectionKey> = {
  name: "top",
  headline: "top",
  shortName: "top",
  slug: "top",
  regionId: "top",
  routeRegionIds: "top",
  regionsHeading: "top",
  status: "top",
  summary: "top",
  currentSeason: "top",
  category: "top",
  protectedArea: "top",
  daysNote: "top",
  highPoint: "top",
  optionalHighPoint: "top",
  optionalHighPointM: "top",
  difficulty: "top",
  grade: "top",
  photoBadges: "top",
  seasons: "top",
  tags: "top",
  isPopular: "top",
  cardBadge: "top",
  photos: "photos",
  videos: "photos",
  introduction: "intro",
  introHeading: "intro",
  overviewHeading: "facts",
  days: "facts",
  maxAltitudeM: "facts",
  distanceKm: "facts",
  startFinish: "facts",
  dailyWalking: "facts",
  guideRatio: "facts",
  seasonLabel: "facts",
  accommodation: "facts",
  transport: "facts",
  activity: "facts",
  highlightsHeading: "highlights",
  highlights: "highlights",
  suitabilityHeading: "fit",
  suitabilityIntro: "fit",
  suitabilityPoints: "fit",
  itineraryHeading: "itinerary",
  itineraryIntro: "itinerary",
  routeLine: "itinerary",
  itinerary: "itinerary",
  inclusionsHeading: "inclusions",
  included: "inclusions",
  excluded: "inclusions",
  mealBudgetMinUsd: "inclusions",
  mealBudgetMaxUsd: "inclusions",
  mealTrailTips: "inclusions",
  mealTeahouseNotes: "inclusions",
  guidesHeading: "guides",
  guidesIntro: "guides",
  guideIds: "guides",
  elevationHeading: "route",
  elevationNote: "route",
  routeMapHeading: "route",
  trekStart: "route",
  trekEnd: "route",
  mapPlace: "route",
  myMapsId: "route",
  pdfMapPath: "route",
  pricingHeading: "pricing",
  pricingIntro: "pricing",
  groupPrices: "pricing",
  packingHeading: "packing",
  packingIntro: "packing",
  packingGroups: "packing",
  knowHeading: "know",
  knowIntro: "know",
  knowTopics: "know",
  faqHeading: "faq",
  faqs: "faq",
  similarHeading: "similar",
  similarIntro: "similar",
  similarTrekIds: "similar",
  seoKeyword: "seo",
  seoTitle: "seo",
  seoDescription: "seo",
  sharePhotoId: "seo",
  canonicalPath: "seo",
  hiddenSharedSections: "shared",
  sharedSectionsShown: "shared",
  sectionOrder: "order",
};

/**
 * The editor's sections in this trek's page order: the top and the photos first, then each one where its first
 * heading comes on the page, then the ones the page doesn't show in one place (Google, shared sections, order).
 */
export const trekSectionsInPageOrder = (order: readonly TrekPageSection[]) => {
  const onPage = order.flatMap((section) => {
    const info = TREK_PAGE_SECTION_INFO[section];
    return "editorKey" in info ? [info.editorKey] : [];
  });
  const keys = [...new Set<TrekSectionKey>(["top", "photos", ...onPage])];
  const rank = (key: TrekSectionKey) => (keys.includes(key) ? keys.indexOf(key) : keys.length);
  return TREK_SECTIONS.toSorted((a, b) => rank(a.key) - rank(b.key));
};

export const { sectionsWithErrors, firstSectionWithError } = createSectionErrorLookup(TREK_SECTIONS, FIELD_SECTIONS);
