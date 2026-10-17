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

/** Sections of the About us page, linked from the header menu and the footer. */
export const ABOUT_PATHS = {
  story: `${ROUTES.about}#our-story`,
  team: `${ROUTES.about}#team`,
  reviews: `${ROUTES.about}#reviews`,
  whyUs: `${ROUTES.about}#why-us`,
  licences: `${ROUTES.about}#licences`,
  responsibleTravel: `${ROUTES.about}#responsible-travel`,
  faq: `${ROUTES.about}#faq`,
} as const;
