import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { RegionDifficulty, RegionPhotos, RegionValues, SeasonKey, WhyPointIcon } from "./types";

export const REGIONS_PATH = "/regions";
export const NEW_REGION_PATH = "/regions/new";
export const regionPath = (regionId: string) => `${REGIONS_PATH}/${regionId}`;

/** The admin edits English for now; the German version comes later (region_translations.locale). */
export const REGION_LOCALE = "en";

/** Where a region page lives on the main site (design: "Page on the main site"). */
export const MAIN_SITE_REGIONS_PREFIX = "traveltonepal.com/regions/";

/** Hard limits, the same as the database checks (supabase/migrations/20261023120000_regions.sql). */
export const REGION_LIMITS = {
  name: 80,
  district: 80,
  slug: 80,
  pinLabel: 40,
  tagline: 140,
  introduction: 4000,
  bestForItem: 40,
  fact: 80,
  factDetails: 200,
  shortName: 40,
  summary: 200,
  heroHighlight: 40,
  overviewHeading: 120,
  whyTitle: 60,
  whyText: 160,
  fromKathmandu: 120,
  nearestAirport: 80,
  permitsDetails: 120,
  whereYouSleep: 80,
  seasonNote: 400,
  faqQuestion: 200,
  faqAnswer: 1500,
  seoKeyword: 80,
  seoTitle: 70,
  seoDescription: 200,
  featuredTrekLabel: 60,
  featuredTrekPitch: 300,
  customRoutePitch: 300,
  nearbyLabel: 40,
  nearbyNote: 160,
} as const;

export const MAX_NEARBY_TREKS = 6;
export const MAX_WHY_POINTS = 4;
export const MAX_COMPARE_REGIONS = 4;

/** "Before you go": travel guides a region can pin to show first (save_region checks it too). */
export const MAX_PINNED_ARTICLES = 3;

/** The website's difficulty levels, easiest first (the database checks the same values). */
export const REGION_DIFFICULTIES: { value: RegionDifficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "easy_moderate", label: "Easy–moderate" },
  { value: "moderate", label: "Moderate" },
  { value: "easy_challenging", label: "Easy–challenging" },
  { value: "challenging", label: "Challenging" },
  { value: "strenuous", label: "Strenuous" },
];

export const REGION_DIFFICULTY_VALUES = ["easy", "easy_moderate", "moderate", "easy_challenging", "challenging", "strenuous"] as const satisfies readonly RegionDifficulty[];

/** Icons a "why trek here" card can use. */
export const WHY_POINT_ICONS: { value: WhyPointIcon; label: string }[] = [
  { value: "landscape", label: "Mountains" },
  { value: "mountain_flag", label: "Summit" },
  { value: "temple_buddhist", label: "Culture" },
  { value: "directions_walk", label: "Walking" },
  { value: "hiking", label: "Hiker" },
  { value: "route", label: "Route" },
  { value: "cottage", label: "Teahouse" },
  { value: "groups", label: "People" },
  { value: "wb_sunny", label: "Weather" },
  { value: "volunteer_activism", label: "Local support" },
];

export const WHY_POINT_ICON_VALUES = [
  "landscape",
  "mountain_flag",
  "temple_buddhist",
  "directions_walk",
  "hiking",
  "route",
  "cottage",
  "groups",
  "wb_sunny",
  "volunteer_activism",
] as const satisfies readonly WhyPointIcon[];

/** Google shows about this much; longer still saves, the counter turns amber. */
export const SEO_TITLE_RECOMMENDED = 60;
export const SEO_DESCRIPTION_RECOMMENDED = 160;

export const MAX_BEST_FOR = 3;
export const MAX_FAQS = 20;
/** Fewer than this and the section shows a warning (design: "6–8 questions give Google more to show"). */
export const RECOMMENDED_FAQS = 6;

/** Quick picks for "Best for" (design); any other short text works too. */
export const BEST_FOR_SUGGESTIONS = [
  "Close to Kathmandu",
  "No flights",
  "Culture",
  "First Himalayan trek",
  "Quiet trails",
  "Short on time",
];

export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const MONTH_RATING_LABELS: Record<MonthRating, string> = { best: "Best", possible: "Possible", avoid: "Not ideal" };

/** A click moves a month to the next rating (design: Best → Possible → Not ideal). */
export const NEXT_MONTH_RATING: Record<MonthRating, MonthRating> = { best: "possible", possible: "avoid", avoid: "best" };

/** A new region before anything is typed (months start as "Not ideal", like the database default). */
export const EMPTY_REGION_VALUES: RegionValues = {
  name: "",
  district: "",
  slug: "",
  latitude: null,
  longitude: null,
  pinLabel: "",
  tagline: "",
  introduction: EMPTY_RICH_TEXT,
  bestFor: [],
  shortName: "",
  summary: "",
  heroHighlight: "",
  overviewHeading: "",
  whyPoints: [],
  maxAltitudeM: null,
  trekLength: "",
  difficulty: null,
  gettingThere: "",
  isFlight: false,
  gettingThereDetails: "",
  permits: "",
  fromKathmandu: "",
  nearestAirport: "",
  permitsDetails: "",
  whereYouSleep: "",
  monthRatings: Array.from({ length: 12 }, () => "avoid"),
  seasons: { spring: "", monsoon: "", autumn: "", winter: "" },
  faqs: [],
  seoKeyword: "",
  seoTitle: "",
  seoDescription: "",
  sharePhoto: null,
  canonicalPath: "",
  featuredTrekId: null,
  featuredTrekLabel: "",
  featuredTrekPitch: "",
  nearbyTreks: [],
  customRoutePitch: "",
  hiddenGuideIds: [],
  compareRegionIds: [],
  pinnedArticleIds: [],
};

export const NO_REGION_PHOTOS: RegionPhotos = { cover: null, gallery: [] };

export const SEASONS: { key: SeasonKey; label: string }[] = [
  { key: "spring", label: "Spring · Mar–May" },
  { key: "monsoon", label: "Monsoon · Jun–Aug" },
  { key: "autumn", label: "Autumn · Sep–Nov" },
  { key: "winter", label: "Winter · Dec–Feb" },
];
