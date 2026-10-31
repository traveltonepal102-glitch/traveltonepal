import type { IconName } from "@ttn/ui/icon";

import type { Crowds, SectionType } from "./types";

export const MAX_SECTIONS = 60;
export const MAX_FAQ_ITEMS = 15;
export const MAX_CHECK_ITEMS = 20;
export const MAX_COST_ROWS = 15;
export const MAX_DAYS_SHOWN = 6;
export const MAX_GALLERY_PHOTOS = 20;
/** "Table": columns and body rows. */
export const TABLE_SIZE = { maxColumns: 8, maxRows: 30 } as const;
/** "Compare treks": 2 or 3; "Meet the guides": 2 to 4. */
export const COMPARE_TREKS = { min: 2, max: 3 } as const;
export const MEET_GUIDES = { min: 2, max: 4 } as const;

/** Limits of the article body (words only for rich text, not formatting). */
export const SECTION_LIMITS = {
  heading: 120,
  tocLabel: 30,
  text: 20000,
  quickAnswer: 600,
  question: 200,
  answer: 2000,
  calloutText: 600,
  checkItem: 200,
  monthNote: 120,
  ctaHeading: 100,
  ctaButton: 40,
  ctaMessage: 300,
  quote: 200,
  costItem: 80,
  costPrice: 30,
  costTotalLabel: 60,
  tip: 400,
  guideQuote: 300,
  caption: 200,
  photoAlt: 160,
  mapTitle: 80,
  mapPlace: 120,
  videoTitle: 100,
  tableCell: 200,
  embedTitle: 100,
  embedCode: 4000,
  customHtml: 20000,
} as const;

export const CROWDS: { value: Crowds; label: string }[] = [
  { value: "very-low", label: "Very low" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "busy", label: "Busy" },
  { value: "busiest", label: "Busiest" },
];

export const CROWD_VALUES = ["very-low", "low", "medium", "busy", "busiest"] as const satisfies readonly Crowds[];

export type SectionGroup = "text" | "trek" | "people" | "media" | "engage" | "advanced";

/** The catalog's groups (design order), with the colors of their icons. */
export const SECTION_GROUPS: { value: SectionGroup; label: string; tone: string }[] = [
  { value: "text", label: "Writing", tone: "bg-brand-tint text-brand" },
  { value: "trek", label: "Trek information", tone: "bg-green-tint text-whatsapp" },
  { value: "people", label: "Guides and people", tone: "bg-saffron-tint text-saffron-deep" },
  { value: "media", label: "Photos, map and video", tone: "bg-muted text-text" },
  { value: "engage", label: "End of the article", tone: "bg-green-tint text-whatsapp" },
  { value: "advanced", label: "Advanced", tone: "bg-muted text-text" },
];

export type SectionKind = {
  /** The section type once it is built; null: coming soon. */
  type: SectionType | null;
  group: SectionGroup;
  name: string;
  description: string;
  goodFor: string;
  youFillIn: string[];
  icon: IconName;
  /** Only once per article (e.g. one quick answer, one set of questions for Google). */
  isOncePerArticle?: boolean;
};

/** Every kind of section in the design's catalog, in the catalog's order. */
export const SECTION_KINDS: SectionKind[] = [
  {
    type: "text",
    group: "text",
    name: "Heading and text",
    description: "The main writing block. Headings help readers and Google scan the article.",
    goodFor: "Every article: most of your writing goes here.",
    youFillIn: ["Heading", "Text with bold, lists and links"],
    icon: "notes",
  },
  {
    type: "paragraph",
    group: "text",
    name: "Text",
    description: "Paragraphs with no heading, carrying on from the section above.",
    goodFor: "An opening before the first heading, or more text after a trek card or photo.",
    youFillIn: ["Text with bold, lists and links"],
    icon: "description",
  },
  {
    type: "heading",
    group: "text",
    name: "Heading",
    description: "A heading on its own, with no text under it. An H2 shows in “In this guide”.",
    goodFor: "A heading over a table, photo, trek card or checklist.",
    youFillIn: ["H2 or H3", "Heading"],
    icon: "title",
  },
  {
    type: "quick",
    group: "text",
    name: "Quick answer",
    description: "A short answer in a blue box, right under the title.",
    goodFor: "Titles that ask a question: “Best time to…”, “How much does…”.",
    youFillIn: ["2–3 sentences"],
    icon: "lightbulb",
    isOncePerArticle: true,
  },
  { type: "callout", group: "text", name: "Note or warning", description: "A coloured box that stands out from the text.", goodFor: "Permit rules, safety advice, recent trail changes.", youFillIn: ["Note or warning", "Short text"], icon: "warning" },
  { type: "quote", group: "text", name: "Pull quote", description: "One sentence in large type.", goodFor: "Breaking up long text with a strong line.", youFillIn: ["One sentence"], icon: "format_quote" },
  { type: "check", group: "text", name: "Checklist", description: "A list with green ticks.", goodFor: "Packing lists, things to book before you fly.", youFillIn: ["List items"], icon: "checklist" },
  {
    type: "table",
    group: "text",
    name: "Table",
    description: "A table you build: as many rows and columns as you need, with a header row and a footer row if wanted.",
    goodFor: "Walking times between villages, teahouse prices, what to wear each season.",
    youFillIn: ["Heading (optional)", "The cells", "Header row, footer row, first column as row headings"],
    icon: "grid_on",
  },
  {
    type: "trek",
    group: "trek",
    name: "Trek card",
    description: "A card that links to one of your treks.",
    goodFor: "Sending readers from the article to the trek page.",
    youFillIn: ["Pick a trek: photo, days and price fill in"],
    icon: "hiking",
  },
  {
    type: "months",
    group: "trek",
    name: "Month by month",
    description: "12 months marked Best, Possible or Not ideal, as a colour strip or a table with notes.",
    goodFor: "Season and weather articles.",
    youFillIn: ["Heading", "Click each month", "Notes and crowds for the table"],
    icon: "calendar_month",
  },
  { type: "days", group: "trek", name: "Itinerary days", description: "Some days from a trek’s day-by-day plan.", goodFor: "Showing what one part of the trek is like.", youFillIn: ["Pick a trek", "Pick the days"], icon: "route" },
  {
    type: "altitude",
    group: "trek",
    name: "Altitude chart",
    description: "A trek’s altitude day by day, as on its trek page, with the high point and the highest night.",
    goodFor: "Altitude sickness and acclimatisation articles.",
    youFillIn: ["Pick a trek: the chart comes from its day-by-day plan", "Heading (optional)"],
    icon: "altitude",
  },
  { type: "cost", group: "trek", name: "Cost table", description: "A list of costs with a total.", goodFor: "Budget and permit articles.", youFillIn: ["Item", "Price"], icon: "payments" },
  { type: "compare", group: "trek", name: "Compare treks", description: "Two or three treks side by side.", goodFor: "Articles like “Langtang or Annapurna?”.", youFillIn: ["Pick 2–3 treks"], icon: "table" },
  { type: "tip", group: "people", name: "Guide’s tip", description: "Advice shown with the guide’s photo and name.", goodFor: "Local advice that shows real experience.", youFillIn: ["Pick a guide", "The tip"], icon: "lightbulb" },
  { type: "gquote", group: "people", name: "Guide quote", description: "A guide’s own words with their photo.", goodFor: "Personal stories about a place.", youFillIn: ["Pick a guide", "The quote"], icon: "format_quote" },
  { type: "meet", group: "people", name: "Meet the guides", description: "Small cards of 2–4 guides.", goodFor: "“Who will lead my trek?” and region articles.", youFillIn: ["Pick guides"], icon: "groups" },
  {
    type: "image",
    group: "media",
    name: "Photo",
    description: "One large photo with a caption.",
    goodFor: "A viewpoint, a teahouse, a trail.",
    youFillIn: ["Photo from library", "Caption", "Description for Google"],
    icon: "image",
  },
  { type: "gallery", group: "media", name: "Photo gallery", description: "Several photos visitors can swipe through.", goodFor: "Trip reports and “what you will see”.", youFillIn: ["Photos from library"], icon: "photo_library" },
  { type: "map", group: "media", name: "Map", description: "A Google map with a “Load map” button first (privacy rules).", goodFor: "Trailheads and how to get there.", youFillIn: ["Place name or pin"], icon: "map" },
  {
    type: "embed",
    group: "media",
    name: "Embed",
    description: "A Google My Maps route, a Komoot or Wikiloc track or a Vimeo video, with a “Load” button first (privacy rules).",
    goodFor: "Your own route maps and GPS tracks.",
    youFillIn: ["Embed code or link", "Title", "Height"],
    icon: "code_blocks",
  },
  { type: "video", group: "media", name: "YouTube video", description: "A video with a “Play” button first (privacy rules).", goodFor: "Trail videos, guide introductions.", youFillIn: ["YouTube link"], icon: "smart_display" },
  {
    type: "faq",
    group: "engage",
    name: "Questions and answers",
    description: "Questions that open to show the answer.",
    goodFor: "The end of most articles. Google can show them in results.",
    youFillIn: ["Questions", "Answers"],
    icon: "quiz",
    isOncePerArticle: true,
  },
  {
    type: "cta",
    group: "engage",
    name: "WhatsApp and email box",
    description: "A green box with a WhatsApp and an Email button and a ready-made message.",
    goodFor: "The end of the article, or right after a trek card.",
    youFillIn: ["Heading", "Button text", "Message"],
    icon: "chat",
  },
  {
    type: "html",
    group: "advanced",
    name: "Custom HTML",
    description: "Your own HTML, for a layout the other sections don’t offer. Scripts, frames, forms and images are taken out.",
    goodFor: "A styled box, a details list or a table copied from elsewhere.",
    youFillIn: ["HTML"],
    icon: "code",
  },
];

/** A built section kind's catalog entry. */
export const sectionKindOf = (type: SectionType) => SECTION_KINDS.find((kind) => kind.type === type) ?? SECTION_KINDS[0];
