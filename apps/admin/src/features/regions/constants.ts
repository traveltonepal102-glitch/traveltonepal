import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

import type { RegionPhotos, RegionValues, SeasonKey } from "./types";

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
  seasonNote: 400,
  faqQuestion: 200,
  faqAnswer: 1500,
  seoKeyword: 80,
  seoTitle: 70,
  seoDescription: 200,
} as const;

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
  highestPoint: "",
  trekLength: "",
  difficulty: "",
  gettingThere: "",
  gettingThereDetails: "",
  permits: "",
  monthRatings: Array.from({ length: 12 }, () => "avoid"),
  seasons: { spring: "", monsoon: "", autumn: "", winter: "" },
  faqs: [],
  seoKeyword: "",
  seoTitle: "",
  seoDescription: "",
};

export const NO_REGION_PHOTOS: RegionPhotos = { cover: null, gallery: [] };

export const SEASONS: { key: SeasonKey; label: string }[] = [
  { key: "spring", label: "Spring · Mar–May" },
  { key: "monsoon", label: "Monsoon · Jun–Aug" },
  { key: "autumn", label: "Autumn · Sep–Nov" },
  { key: "winter", label: "Winter · Dec–Feb" },
];
