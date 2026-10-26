import type { IconName } from "@ttn/ui/icon";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { SitePageSlug } from "@/lib/supabase/database.types";

export const PAGES_PATH = ADMIN_SECTIONS.pages.href;
export const pagePath = (slug: SitePageSlug | "lists" | "legal") => `${PAGES_PATH}/${slug}`;

/** The pages that can be edited here now, in menu order. */
export const EDITABLE_PAGES = [
  {
    slug: "about",
    label: "About us",
    websitePath: "/about",
    icon: "groups",
    summary: "Top of the page, story and founder, promises, team, reviews, licences, Google",
  },
  {
    slug: "contact",
    label: "Contact",
    websitePath: "/contact",
    icon: "chat",
    summary: "Top of the page, ways to reach us, next steps, time difference, questions, Google",
  },
] as const satisfies readonly { slug: SitePageSlug; label: string; websitePath: string; icon: IconName; summary: string }[];

export type EditablePageSlug = (typeof EDITABLE_PAGES)[number]["slug"];

/** The list pages' one editor (/pages/lists), each page a section of it (design: Admin-pages, "List pages"). */
export const LIST_PAGES_ROUTE = "lists";

export const LIST_PAGES = [
  {
    slug: "home",
    label: "Home",
    websitePath: "/",
    icon: "home",
    hint: "The photo comes from the home page design. Featured treks, regions and reviews fill in by themselves.",
    auto: "Filled in by itself: popular treks, regions, the latest travel guides and reviews.",
  },
  {
    slug: "treks",
    label: "Treks",
    websitePath: "/treks",
    icon: "landscape",
    hint: "Shown above the filters and the trek cards.",
    auto: "Filled in by itself: every published trek, with its card, price and filters.",
  },
  {
    slug: "regions",
    label: "Regions",
    websitePath: "/regions",
    icon: "map",
    hint: "Shown above the map and the region cards.",
    auto: "Filled in by itself: the regions with their map pins, best months and number of treks.",
  },
  {
    slug: "travel-guides",
    label: "Travel guides",
    websitePath: "/travel-guides",
    icon: "article",
    hint: "Shown above the search box. The featured guide and the “Start here” list are set in each travel guide.",
    auto: "Filled in by itself: the featured guide, topics, the “Start here” list and the latest guides.",
  },
] as const satisfies readonly { slug: SitePageSlug; label: string; websitePath: string; icon: IconName; hint: string; auto: string }[];

export type ListPageSlug = (typeof LIST_PAGES)[number]["slug"];

export const isEditablePage = (slug: string): slug is EditablePageSlug | typeof LIST_PAGES_ROUTE | typeof LEGAL_PAGES_ROUTE =>
  slug === LIST_PAGES_ROUTE || slug === LEGAL_PAGES_ROUTE || EDITABLE_PAGES.some((page) => page.slug === slug);

/** A list page in the list editor, opened at that page. */
export const listPagePath = (slug: ListPageSlug) => `${PAGES_PATH}/${LIST_PAGES_ROUTE}?page=${slug}`;

/** The legal pages' one editor (/pages/legal), each page a section of it (design: Admin-pages, "Legal pages"). */
export const LEGAL_PAGES_ROUTE = "legal";

export const LEGAL_PAGES = [
  { slug: "terms", label: "Terms and booking", websitePath: "/terms", icon: "description", what: "Deposit, cancellation table, insurance", note: "Have these terms checked by a lawyer, including whether EU package travel rules apply to bookings from Germany." },
  { slug: "privacy", label: "Privacy policy", websitePath: "/privacy", icon: "lock", what: "What we collect, cookies, your rights", note: "Have this policy checked by a data protection specialist before going live." },
  { slug: "impressum", label: "Impressum", websitePath: "/impressum", icon: "verified", what: "Company, address, registrations, responsible person", note: "Fill in every bracket with your real company details. The Impressum must be complete and reachable from every page." },
  { slug: "cookies", label: "Cookie policy", websitePath: "/cookies", icon: "tune", what: "What we use and why · the switches work by themselves", note: "Check the text matches what the website loads." },
] as const satisfies readonly { slug: SitePageSlug; label: string; websitePath: string; icon: IconName; what: string; note: string }[];

export type LegalPageSlug = (typeof LEGAL_PAGES)[number]["slug"];

/** A legal page in the legal editor, opened at that page. */
export const legalPagePath = (slug: LegalPageSlug) => `${PAGES_PATH}/${LEGAL_PAGES_ROUTE}?page=${slug}`;

/** What the legal texts can write instead of typing a company detail (filled in from Site settings on the website). */
export const LEGAL_PLACEHOLDERS = [
  { token: "{company}", meaning: "legal name and form" },
  { token: "{address}", meaning: "office address" },
  { token: "{email}", meaning: "email" },
  { token: "{phone}", meaning: "phone and WhatsApp" },
  { token: "{registration}", meaning: "Department of Tourism registration" },
  { token: "{licence}", meaning: "tourism licence" },
  { token: "{companyRegistration}", meaning: "company registration" },
  { token: "{pan}", meaning: "PAN number" },
  { token: "{taan}", meaning: "TAAN number" },
  { token: "{registers}", meaning: "on a line of its own: the table of registers and numbers" },
  { token: "{cookieTable}", meaning: "on a line of its own: what the website stores, from its code" },
] as const;

/** How the list pages' texts name a count that stays true by itself. */
export const COUNT_TOKENS_HINT = "Write {regions} or {treks} for the number of regions or treks: the website keeps it up to date.";

/** The Pages list's groups (design: Admin-pages, list view). */
export const PAGE_GROUPS: { title: string; tag?: string; description: string; pages: readonly (EditablePageSlug | ListPageSlug | LegalPageSlug)[]; tone: "blue" | "navy" | "sand" }[] = [
  { title: "Company pages", description: "Who you are and how to reach you. The pages people read before they trust you with their trek.", pages: ["about", "contact"], tone: "blue" },
  {
    title: "Legal pages",
    tag: "One editor for all four",
    description: "Title, intro, “last updated” date and numbered sections. A section holds paragraphs, a list or a table.",
    tone: "navy",
    pages: ["terms", "privacy", "impressum", "cookies"],
  },
  {
    title: "List pages",
    description: "The lists fill themselves from your treks, regions and travel guides. Here you only change the text at the top and how the page shows on Google.",
    tone: "sand",
    pages: ["home", "treks", "regions", "travel-guides"],
  },
];

/** Hard limits, the same as the database checks (supabase/migrations/20261026150000_site_pages.sql) or tighter. */
export const PAGE_LIMITS = {
  eyebrow: 80,
  heading: 140,
  intro: 600,
  seoTitle: 80,
  seoDescription: 200,
  seoKeyword: 80,
  trekkersGuided: 20,
  /** A section's H2 on the page (the design counts to 70). */
  sectionHeading: 70,
  /** The line under a section's heading. */
  sectionIntro: 200,
  storyTeaser: 400,
  storyText: 2400,
  quote: 240,
  milestoneYear: 12,
  milestoneTitle: 60,
  milestoneText: 160,
  promiseTitle: 60,
  promiseText: 200,
  replyTime: 60,
  officeDirections: 160,
  timeNote: 160,
  stepWhen: 30,
  stepTitle: 70,
  stepText: 200,
  faqQuestion: 120,
  faqAnswer: 1000,
  legalTitle: 120,
  legalIntro: 400,
  legalText: 40000,
} as const;

export const SEO_TITLE_RECOMMENDED = 60;
export const SEO_DESCRIPTION_RECOMMENDED = 160;

export const MAX_STORY_PHOTOS = 3;
export const MAX_MILESTONES = 4;
export const PROMISE_ROWS = 6;
export const NEXT_STEP_ROWS = 3;
export const MAX_CONTACT_FAQS = 10;
export const RECOMMENDED_CONTACT_FAQS = 4;

/** Icons a promise can have (all in the website's icon set). */
export const PROMISE_ICONS: { value: IconName; label: string }[] = [
  { value: "shield_person", label: "Guide" },
  { value: "price_check", label: "Price" },
  { value: "health_and_safety", label: "Safety" },
  { value: "tune", label: "Flexible" },
  { value: "chat", label: "Chat" },
  { value: "volunteer_activism", label: "Fair to people" },
  { value: "verified", label: "Licensed" },
  { value: "landscape", label: "Mountains" },
  { value: "groups", label: "Team" },
  { value: "hiking", label: "Trekking" },
  { value: "temple_buddhist", label: "Culture" },
  { value: "cottage", label: "Teahouse" },
  { value: "support_agent", label: "Support" },
  { value: "medical_services", label: "First aid" },
  { value: "calendar_month", label: "Dates" },
  { value: "star", label: "Quality" },
];
