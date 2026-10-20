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
  whyUs: "why-us",
  team: "team",
  reviews: "reviews",
  licences: "licences",
  responsibleTravel: "responsible-travel",
  visit: "visit-us",
  faq: "faq",
} as const;

const aboutPath = (id: string) => `${ROUTES.about}#${id}`;

/** Sections of the About us page, linked from the header menu and the footer. */
export const ABOUT_PATHS = {
  story: aboutPath(ABOUT_SECTION_IDS.story),
  team: aboutPath(ABOUT_SECTION_IDS.team),
  reviews: aboutPath(ABOUT_SECTION_IDS.reviews),
  whyUs: aboutPath(ABOUT_SECTION_IDS.whyUs),
  licences: aboutPath(ABOUT_SECTION_IDS.licences),
  responsibleTravel: aboutPath(ABOUT_SECTION_IDS.responsibleTravel),
  visit: aboutPath(ABOUT_SECTION_IDS.visit),
  faq: aboutPath(ABOUT_SECTION_IDS.faq),
} as const;
