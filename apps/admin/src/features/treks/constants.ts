import type { IconName } from "@ttn/ui/icon";

import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import type { DepartureStatus, FaqIcon, PackingGroup, PackingIcon, SharedSectionKey, TrekDifficulty, TrekPhotos, TrekSeason, TrekStatus, TrekTag, TrekValues } from "./types";

export const TREKS_PATH = "/treks";
export const NEW_TREK_PATH = "/treks/new";
export const trekPath = (trekId: string) => `${TREKS_PATH}/${trekId}`;

/** The admin edits English for now; the German version comes later (trek_translations.locale). */
export const TREK_LOCALE = "en";

/** Where a trek page lives on the main site. */
export const MAIN_SITE_TREKS_PREFIX = "traveltonepal.com/treks/";

/** Hard limits, the same as the database checks (supabase/migrations/20261023200000_treks.sql). */
export const TREK_LIMITS = {
  name: 120,
  summary: 200,
  summaryRecommended: 160,
  cardBadge: 30,
  fact: 80,
  badgeLabel: 30,
  introduction: 4000,
  highlightsHeading: 160,
  suitabilityIntro: 300,
  pointTitle: 80,
  pointText: 300,
  itineraryIntro: 1500,
  dayPlace: 40,
  dayTitle: 160,
  daySubtitle: 160,
  dayDuration: 40,
  dayDescription: 1500,
  mapPlace: 120,
  packingIntro: 200,
  packingGroupTitle: 60,
  faqTopicTitle: 60,
  faqQuestion: 200,
  faqAnswer: 1500,
  headline: 120,
  shortName: 40,
  seoKeyword: 60,
  /** Google shows about 60 characters of a title and 160 of a description; a little more is allowed. */
  seoTitle: 70,
  seoTitleRecommended: 60,
  seoDescription: 200,
  seoDescriptionRecommended: 160,
  seoDescriptionMin: 120,
  guidesIntro: 300,
} as const;

export const MAX_DAYS = 60;
export const MAX_INCLUDED_ITEMS = 20;
export const MAX_MEAL_TIPS = 10;
export const MAX_GROUP_PRICES = 10;
export const MAX_DEPARTURES = 100;
export const PRICE_LIMITS = { label: 40, shortLabel: 12, team: 80, note: 60 } as const;

/** A date's status, in the order the design shows them, with its colors (the status buttons). */
export const DEPARTURE_STATUSES: { value: DepartureStatus; label: string; on: string }[] = [
  { value: "guaranteed", label: "Guaranteed", on: "bg-whatsapp text-white" },
  { value: "open", label: "Open", on: "bg-brand text-on-brand" },
  { value: "almost_full", label: "Almost full", on: "bg-saffron text-ink" },
  { value: "full", label: "Full", on: "bg-text text-white" },
];

export const DEPARTURE_STATUS_VALUES = ["guaranteed", "open", "almost_full", "full"] as const satisfies readonly DepartureStatus[];

/**
 * Deposit to confirm a booking, the same for every trek (design: Prices and dates). Shown as information;
 * it will move to Site settings with the cancellation terms.
 */
export const BOOKING_DEPOSIT_PERCENT = 10;

export const MAX_HIGHLIGHTS = 10;
/** The design asks for 4–6 highlights; fewer shows a reminder. */
export const RECOMMENDED_HIGHLIGHTS = 4;
export const MAX_SUITABILITY_POINTS = 10;
export const MAX_PHOTO_BADGES = 3;

export const STATUS_OPTIONS: { value: TrekStatus; label: string; hint: string }[] = [
  { value: "draft", label: "Draft", hint: "Not on the website yet" },
  { value: "published", label: "Published", hint: "On the website" },
  { value: "hidden", label: "Hidden", hint: "Taken off the website" },
];

/** Difficulty and the grades that go with it (the website shows "grade 3 of 5"). Colors as on the website. */
export const DIFFICULTIES: { value: TrekDifficulty; label: string; grades: number[]; chip: string }[] = [
  { value: "easy", label: "Easy", grades: [1, 2], chip: "bg-green-tint text-whatsapp" },
  { value: "moderate", label: "Moderate", grades: [3], chip: "bg-brand-tint text-brand" },
  { value: "challenging", label: "Challenging", grades: [4], chip: "bg-saffron-tint text-saffron-ink" },
  { value: "strenuous", label: "Strenuous", grades: [5], chip: "bg-danger-tint text-danger" },
];

export const difficultyOf = (value: TrekDifficulty) => DIFFICULTIES.find((level) => level.value === value) ?? DIFFICULTIES[1];

export const SEASON_OPTIONS: { value: TrekSeason; label: string }[] = [
  { value: "spring", label: "Spring (Mar–May)" },
  { value: "autumn", label: "Autumn (Sep–Nov)" },
  { value: "winter", label: "Winter (Dec–Feb)" },
  { value: "monsoon", label: "Monsoon (Jun–Aug)" },
];

export const TAG_OPTIONS: { value: TrekTag; label: string }[] = [
  { value: "classic", label: "Classic trek" },
  { value: "off-the-beaten-path", label: "Off the beaten path" },
];

/** Icons a photo badge can use (as on the website's trek photos). */
export const BADGE_ICON_VALUES = ["route", "nordic_walking", "health_and_safety", "landscape", "groups", "star"] as const satisfies readonly IconName[];

export const BADGE_ICONS: { value: (typeof BADGE_ICON_VALUES)[number]; label: string }[] = [
  { value: "route", label: "Route" },
  { value: "nordic_walking", label: "Walker" },
  { value: "health_and_safety", label: "Safety" },
  { value: "landscape", label: "Mountains" },
  { value: "groups", label: "Group" },
  { value: "star", label: "Star" },
];

export const MAX_PACKING_GROUPS = 6;
export const MAX_PACKING_ITEMS = 10;

/** Icons a packing card can use (as on the website's packing list). */
export const PACKING_ICONS: { value: PackingIcon; label: string }[] = [
  { value: "apparel", label: "Clothing" },
  { value: "footprint", label: "Footwear" },
  { value: "backpack", label: "Bags and gear" },
  { value: "medical_services", label: "Health" },
  { value: "water_drop", label: "Water" },
  { value: "description", label: "Documents" },
];

export const PACKING_ICON_VALUES = ["apparel", "footprint", "backpack", "medical_services", "water_drop", "description"] as const satisfies readonly PackingIcon[];

/** The usual four cards (as on the Langtang page), to start a new packing list with. */
export const STARTER_PACKING_GROUPS: PackingGroup[] = [
  { title: "Clothing and layering", icon: "apparel", items: [] },
  { title: "Footwear and trail care", icon: "footprint", items: [] },
  { title: "Gear and packs", icon: "backpack", items: [] },
  { title: "Health, hygiene and water", icon: "medical_services", items: [] },
];

/** The shared sections of the trek page, in page order (the database checks the same keys). */
export const SHARED_SECTIONS: { key: SharedSectionKey; label: string; description: string; icon: IconName }[] = [
  { key: "founder", label: "Founder’s story", description: "A short note from our founder on planning every trek.", icon: "format_quote" },
  { key: "consultation", label: "Free trip consultation", description: "Invites visitors to a free WhatsApp call before they book.", icon: "chat" },
  { key: "customization", label: "Make it your own", description: "The custom itinerary box with its option chips, under Day by day.", icon: "tune" },
  { key: "credentials", label: "Licences and memberships", description: "Government registration, TAAN and other badges.", icon: "verified" },
  { key: "reviews", label: "Reviews", description: "Reviews of this trek. Shows only when the trek has some.", icon: "star" },
  { key: "why_book", label: "Why book with us", description: "The promises from the About page.", icon: "workspace_premium" },
  { key: "differentiators", label: "What makes us different", description: "How a local team compares with big agencies.", icon: "compare_arrows" },
  { key: "booking_form", label: "WhatsApp booking form", description: "Builds a ready-made WhatsApp message. Nothing is stored.", icon: "send" },
  { key: "newsletter", label: "Newsletter sign-up", description: "Email sign-up next to the similar treks.", icon: "mail" },
];

export const SHARED_SECTION_KEYS = [
  "founder",
  "consultation",
  "customization",
  "credentials",
  "reviews",
  "why_book",
  "differentiators",
  "booking_form",
  "newsletter",
] as const satisfies readonly SharedSectionKey[];

/** Guides a trek can show ("Meet your trek guide" scrolls sideways). */
export const MAX_TREK_GUIDES = 10;

/** The trek page shows 4 similar treks. */
export const MAX_SIMILAR_TREKS = 4;

export const MAX_FAQ_TOPICS = 15;
export const MAX_FAQ_QUESTIONS = 15;
/** Fewer questions than this on a trek shows a reminder (more gives Google more to show). */
export const RECOMMENDED_FAQS = 6;

/** Icons a question topic can use (as on the website's FAQ topic list). */
export const FAQ_ICONS: { value: FaqIcon; label: string }[] = [
  { value: "info", label: "Information" },
  { value: "calendar_month", label: "Calendar" },
  { value: "nordic_walking", label: "Walker" },
  { value: "fitness_center", label: "Fitness" },
  { value: "wb_twilight", label: "Weather" },
  { value: "description", label: "Permits" },
  { value: "payments", label: "Money" },
  { value: "event", label: "Booking" },
  { value: "route", label: "Route" },
  { value: "groups", label: "Team" },
  { value: "cottage", label: "Teahouse" },
  { value: "restaurant", label: "Food" },
  { value: "medical_services", label: "Health" },
  { value: "backpack", label: "Gear" },
  { value: "temple_buddhist", label: "Culture" },
];

export const FAQ_ICON_VALUES = [
  "info",
  "calendar_month",
  "nordic_walking",
  "fitness_center",
  "wb_twilight",
  "description",
  "payments",
  "event",
  "route",
  "groups",
  "cottage",
  "restaurant",
  "medical_services",
  "backpack",
  "temple_buddhist",
] as const satisfies readonly FaqIcon[];

/** A new trek before anything is typed (status Draft, so nothing goes on the website by accident). */
export const EMPTY_TREK_VALUES: TrekValues = {
  name: "",
  slug: "",
  regionId: "",
  status: "draft",
  difficulty: "moderate",
  grade: 3,
  days: null,
  maxAltitudeM: null,
  distanceKm: null,
  seasons: [],
  tags: [],
  isPopular: false,
  summary: "",
  cardBadge: "",
  photoBadges: [],
  startFinish: "",
  dailyWalking: "",
  guideRatio: "",
  seasonLabel: "",
  accommodation: "",
  transport: "",
  introduction: EMPTY_RICH_TEXT,
  highlightsHeading: "",
  highlights: [],
  suitabilityIntro: "",
  suitabilityPoints: [],
  itineraryIntro: "",
  itinerary: [],
  included: [],
  excluded: [],
  mealBudgetMinUsd: null,
  mealBudgetMaxUsd: null,
  mealTrailTips: [],
  mealTeahouseNotes: [],
  groupPrices: [],
  hasFixedDates: false,
  departures: [],
  mapPlace: "",
  myMapsId: null,
  packingIntro: "",
  packingGroups: [],
  faqs: [],
  headline: "",
  shortName: "",
  seoKeyword: "",
  seoTitle: "",
  seoDescription: "",
  similarTrekIds: [],
  hiddenSharedSections: [],
  guidesIntro: "",
  guideIds: [],
};

export const NO_TREK_PHOTOS: TrekPhotos = { cover: null, gallery: [] };
