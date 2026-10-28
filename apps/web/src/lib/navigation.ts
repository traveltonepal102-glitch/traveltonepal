import { ROUTES } from "./routes";

/** The site's five main sections, in menu order: the header tabs and the footer's Explore column. */
export const MAIN_SECTIONS = [
  { key: "treks", label: "Treks", href: ROUTES.treks },
  { key: "regions", label: "Regions", href: ROUTES.regions },
  { key: "guides", label: "Travel guides", href: ROUTES.guides },
  { key: "about", label: "About us", href: ROUTES.about },
  { key: "contact", label: "Contact", href: ROUTES.contact },
] as const;

export type SectionKey = (typeof MAIN_SECTIONS)[number]["key"];

/** Anchors of the About us page's sections (the page uses these ids). */
export const ABOUT_SECTION_IDS = {
  story: "our-story",
  /** The four beliefs' cards (the menu's "Why travel with us"); each belief has its own section below. */
  whyUs: "why-us",
  listen: "listen",
  honest: "honest",
  flexible: "flexible",
  openMind: "open-mind",
  team: "team",
  licences: "licences",
  responsibleTravel: "responsible-travel",
  visit: "visit-us",
  faq: "faq",
} as const;

const aboutPath = (id: string) => `${ROUTES.about}#${id}`;

/** Anchors of the home page's sections. */
export const HOME_SECTION_IDS = { reviews: "reviews" } as const;

/** The reviews trekkers wrote, on the home page (linked from the header menu and the footer). */
export const REVIEWS_PATH = `${ROUTES.home}#${HOME_SECTION_IDS.reviews}`;

/** Sections of the About us page, linked from the header menu and the footer. */
export const ABOUT_PATHS = {
  story: aboutPath(ABOUT_SECTION_IDS.story),
  team: aboutPath(ABOUT_SECTION_IDS.team),
  whyUs: aboutPath(ABOUT_SECTION_IDS.whyUs),
  licences: aboutPath(ABOUT_SECTION_IDS.licences),
  responsibleTravel: aboutPath(ABOUT_SECTION_IDS.responsibleTravel),
  visit: aboutPath(ABOUT_SECTION_IDS.visit),
  faq: aboutPath(ABOUT_SECTION_IDS.faq),
} as const;
