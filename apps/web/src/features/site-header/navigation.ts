import type { IconName } from "@ttn/ui/icon";

import { ABOUT_PATHS, MAIN_SECTIONS } from "@/lib/navigation";
import type { SectionKey } from "@/lib/navigation";
import { ROUTES, guidePath, regionPath, trekPath } from "@/lib/routes";

/**
 * Header menu content, as in the website design (Header.dc.html).
 * Popular treks and regions are demo values until they come from Payload (CMS phase).
 */
export type MenuKey = Exclude<SectionKey, "contact">;

export type NavTab =
  | { key: MenuKey; label: string; href: string; hasMenu: true }
  | { key: "contact"; label: string; href: string; hasMenu: false };

export type MenuLink = { name: string; meta: string; href: string; icon: IconName };

export type TrekColumn = { title: string; links: MenuLink[] };

export type RegionLink = { name: string; meta: string; href: string; image?: string };

/** Icon tile colors, from the design system's tints. */
export type TileTone = "brand" | "saffron" | "green" | "navy";

export type TopicLink = MenuLink & { tone: TileTone };

/** Every main section opens a dropdown menu except Contact. */
export const NAV_TABS: readonly NavTab[] = MAIN_SECTIONS.map((section) =>
  section.key === "contact" ? { ...section, hasMenu: false } : { ...section, hasMenu: true },
);

export const TREK_COLUMNS: readonly TrekColumn[] = [
  {
    title: "Popular treks",
    links: [
      { name: "Everest Base Camp", meta: "14 days · from $1,000", href: trekPath("everest-base-camp"), icon: "hiking" },
      { name: "Annapurna Circuit", meta: "16 days · from $1,150", href: trekPath("annapurna-circuit"), icon: "hiking" },
      { name: "Langtang Valley", meta: "10 days · from $890", href: trekPath("langtang-valley"), icon: "hiking" },
      { name: "Manaslu Circuit", meta: "15 days · from $1,280", href: trekPath("manaslu-circuit"), icon: "hiking" },
    ],
  },
  {
    title: "By length",
    links: [
      { name: "Short treks", meta: "Under 10 days", href: `${ROUTES.treks}?length=short`, icon: "timer" },
      { name: "Classic treks", meta: "10 to 16 days", href: `${ROUTES.treks}?length=classic`, icon: "calendar_month" },
      { name: "Long and remote", meta: "16 days and more", href: `${ROUTES.treks}?length=long`, icon: "route" },
    ],
  },
  {
    title: "By style",
    links: [
      { name: "Quiet, off the beaten path", meta: "Fewer trekkers, wild valleys", href: `${ROUTES.treks}?style=quiet`, icon: "landscape" },
      { name: "Teahouse treks", meta: "Lodges every night", href: `${ROUTES.treks}?style=teahouse`, icon: "cottage" },
      { name: "Private treks", meta: "Your group, your dates", href: `${ROUTES.treks}?style=private`, icon: "groups" },
    ],
  },
];

export const REGION_LINKS: readonly RegionLink[] = [
  { name: "Everest", meta: "Up to 5,545 m", href: regionPath("everest") },
  { name: "Annapurna", meta: "Up to 5,416 m", href: regionPath("annapurna") },
  { name: "Manaslu", meta: "Up to 5,106 m", href: regionPath("manaslu") },
  { name: "Langtang", meta: "Up to 4,984 m", href: regionPath("langtang"), image: "/images/langtang-peaks.jpg" },
  { name: "Mardi Himal", meta: "Up to 4,500 m", href: regionPath("mardi-himal") },
  { name: "Kanchenjunga", meta: "Up to 5,143 m", href: regionPath("kanchenjunga") },
  { name: "Nar Phu", meta: "Up to 5,320 m", href: regionPath("nar-phu") },
  { name: "Pikey Peak", meta: "4,065 m", href: regionPath("pikey-peak") },
  {
    name: "Tamang Heritage Trail",
    meta: "Up to 3,165 m",
    href: regionPath("tamang-heritage-trail"),
    image: "/images/tamang-heritage-village.jpg",
  },
];

export const GUIDE_LINKS: readonly TopicLink[] = [
  { name: "Planning and permits", meta: "Permits, visas, costs, guides", href: guidePath("planning-and-permits"), icon: "description", tone: "brand" },
  { name: "Best time to trek", meta: "Seasons and weather by region", href: guidePath("best-time-to-trek"), icon: "wb_sunny", tone: "saffron" },
  { name: "Health and altitude", meta: "Fitness, acclimatization, safety", href: guidePath("health-and-altitude"), icon: "health_and_safety", tone: "green" },
  { name: "Gear and packing", meta: "Packing lists and rentals", href: guidePath("gear-and-packing"), icon: "backpack", tone: "navy" },
];

export const ABOUT_LINKS: readonly TopicLink[] = [
  { name: "Our story", meta: "Who we are and why we started", href: ABOUT_PATHS.story, icon: "cottage", tone: "brand" },
  { name: "Our guides and team", meta: "Meet the people who lead you", href: ABOUT_PATHS.team, icon: "groups", tone: "green" },
  { name: "Reviews", meta: "What trekkers say about us", href: ABOUT_PATHS.reviews, icon: "person", tone: "saffron" },
  { name: "Why travel with us", meta: "Safety, prices, flexibility", href: ABOUT_PATHS.whyUs, icon: "shield_person", tone: "navy" },
  { name: "Licences and legal", meta: "Registration and memberships", href: ABOUT_PATHS.licences, icon: "verified", tone: "brand" },
  { name: "Responsible travel", meta: "Porters, villages, nature", href: ABOUT_PATHS.responsibleTravel, icon: "volunteer_activism", tone: "green" },
];
