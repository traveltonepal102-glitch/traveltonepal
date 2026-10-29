import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { ArticleStatus, ArticleTopic, ArticleValues, FactIcon, MonthEntry } from "./types";

export const TRAVEL_GUIDES_PATH = ADMIN_SECTIONS.travelGuides.href;
export const NEW_ARTICLE_PATH = `${TRAVEL_GUIDES_PATH}/new`;
export const articlePath = (articleId: string) => `${TRAVEL_GUIDES_PATH}/${articleId}`;

/** The admin edits English for now; German comes later (article_translations.locale). */
export const ARTICLE_LOCALE = "en";

/** Hard limits, the same as the database checks (supabase/migrations/20261024260000_travel_guides.sql). */
export const ARTICLE_LIMITS = {
  slug: 100,
  title: 120,
  titleRecommended: 70,
  intro: 300,
  cardText: 120,
  coverAlt: 160,
  highlightTag: 40,
  updatedLine: 60,
  factLabel: 30,
  factValue: 40,
  seoKeyword: 80,
  seoTitle: 120,
  seoTitleRecommended: 60,
  seoDescription: 300,
  seoDescriptionRecommended: 160,
} as const;

export const MAX_FACTS = 4;
export const MAX_RELATED = 3;
export const START_HERE_POSITIONS = [1, 2, 3, 4, 5, 6] as const;

/** Topics in the design's order. `label` is also the tag on the photo and the breadcrumb's last step. */
export const ARTICLE_TOPICS: { value: ArticleTopic; label: string }[] = [
  { value: "best-time", label: "Best time to trek" },
  { value: "planning", label: "Planning and permits" },
  { value: "health", label: "Health and altitude" },
  { value: "gear", label: "Gear and packing" },
];

export const ARTICLE_TOPIC_VALUES = ["best-time", "planning", "health", "gear"] as const satisfies readonly ArticleTopic[];

export const ARTICLE_STATUSES: { value: ArticleStatus; label: string; hint: string }[] = [
  { value: "draft", label: "Draft", hint: "Not on the website yet" },
  { value: "published", label: "Published", hint: "On the website" },
  { value: "hidden", label: "Hidden", hint: "Taken off the website" },
];

export const ARTICLE_STATUS_VALUES = ["draft", "published", "hidden"] as const satisfies readonly ArticleStatus[];

/** Key fact icons, each with the tile color it has on the website (its IconTone). */
export const FACT_ICONS: { value: FactIcon; label: string; tone: "green" | "saffron" | "brand" | "navy" }[] = [
  { value: "wb_sunny", label: "Sun", tone: "green" },
  { value: "water_drop", label: "Rain", tone: "brand" },
  { value: "altitude", label: "Altitude", tone: "saffron" },
  { value: "wb_twilight", label: "Night", tone: "navy" },
  { value: "calendar_month", label: "Calendar", tone: "brand" },
  { value: "schedule", label: "Time", tone: "navy" },
  { value: "payments", label: "Money", tone: "green" },
  { value: "hiking", label: "Hiker", tone: "saffron" },
  { value: "landscape", label: "Mountains", tone: "green" },
  { value: "route", label: "Route", tone: "brand" },
  { value: "groups", label: "Group", tone: "navy" },
  { value: "description", label: "Permit", tone: "brand" },
];

export const FACT_ICON_VALUES = [
  "wb_sunny",
  "water_drop",
  "altitude",
  "wb_twilight",
  "calendar_month",
  "schedule",
  "payments",
  "hiking",
  "landscape",
  "route",
  "groups",
  "description",
] as const satisfies readonly FactIcon[];

/** Jan–Dec before they are filled in: "Not ideal" and no notes (like a new region's months). */
export const emptyMonths = (): MonthEntry[] => Array.from({ length: 12 }, () => ({ rating: "avoid", onTheTrail: "", crowds: "" }));

/** A new travel guide before anything is typed (the main site, "Best time to trek", a draft). */
export const EMPTY_ARTICLE_VALUES: ArticleValues = {
  title: "",
  intro: "",
  cardText: "",
  coverAlt: "",
  photoTrekId: null,
  highlightTag: "",
  updatedLine: "",
  facts: [],
  siteRegionId: null,
  alsoOnMainSite: false,
  topic: "best-time",
  slug: "",
  status: "draft",
  publishMode: "now",
  publishedOn: null,
  isFeatured: false,
  startHerePosition: null,
  authorId: null,
  checkerGuideId: null,
  mainTrekId: null,
  regionIds: [],
  relatedIds: [],
  sections: [],
  months: emptyMonths(),
  seoKeyword: "",
  seoTitle: "",
  seoDescription: "",
  canonicalPath: "",
  hideFromGoogle: false,
  helpHeading: "",
  helpText: "",
  helpMessage: "",
};
