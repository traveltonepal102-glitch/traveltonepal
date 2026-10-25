import type { IconName } from "@ttn/ui/icon";

import { formatCount } from "@/lib/format";
import type { SiteImageSource } from "@/lib/images";
import { ABOUT_PATHS, MAIN_SECTIONS } from "@/lib/navigation";
import type { SectionKey } from "@/lib/navigation";
import { ROUTES, trekPath } from "@/lib/routes";
import { guideListHref } from "@/features/guides/guideFiltering";
import { regionHref } from "@/features/region-detail/regionDetails";
import type { RegionSummary } from "@/features/regions/regions";
import { popularTreksWithPage } from "@/features/trek-detail/trekDetails";
import { TREK_LENGTHS, treksFilterPath } from "@/features/treks/filters";
import type { TrekLength } from "@/features/treks/filters";
import { formatAltitude, formatUsd } from "@/features/treks/format";
import type { TrekSummary } from "@/features/treks/types";

/**
 * Header menu content, as in the website design (Header.dc.html). Popular treks and regions come from the
 * database (SiteHeader reads them); the rest is fixed.
 */
export type MenuKey = Exclude<SectionKey, "contact">;

export type NavTab =
  | { key: MenuKey; label: string; href: string; hasMenu: true }
  | { key: "contact"; label: string; href: string; hasMenu: false };

export type MenuLink = { name: string; meta: string; href: string; icon: IconName };

export type TrekColumn = { title: string; links: MenuLink[] };

export type RegionLink = { name: string; meta: string; href: string; image?: SiteImageSource };

/** Icon tile colors, from the design system's tints. */
export type TileTone = "brand" | "saffron" | "green" | "navy";

export type TopicLink = MenuLink & { tone: TileTone };

/** Every main section opens a dropdown menu except Contact. */
export const NAV_TABS: readonly NavTab[] = MAIN_SECTIONS.map((section) =>
  section.key === "contact" ? { ...section, hasMenu: false } : { ...section, hasMenu: true },
);

const POPULAR_TREKS_IN_MENU = 4;

const LENGTH_LINKS: Record<TrekLength, { name: string; icon: IconName }> = {
  short: { name: "Short treks", icon: "timer" },
  classic: { name: "Classic treks", icon: "calendar_month" },
  long: { name: "Long and remote", icon: "route" },
};

const popularColumn = (treks: readonly TrekSummary[]): TrekColumn => ({
  title: "Popular treks",
  links: popularTreksWithPage(treks)
    .slice(0, POPULAR_TREKS_IN_MENU)
    .map((trek) => ({
      name: trek.name,
      meta: trek.priceFromUsd ? `${formatCount(trek.days, "day")} · from ${formatUsd(trek.priceFromUsd)}` : formatCount(trek.days, "day"),
      href: trekPath(trek.slug),
      icon: "hiking",
    })),
});

const FIXED_TREK_COLUMNS: readonly TrekColumn[] = [
  {
    title: "By length",
    links: TREK_LENGTHS.map((length) => ({
      ...LENGTH_LINKS[length.value],
      meta: length.label,
      href: treksFilterPath({ length: length.value }),
    })),
  },
  {
    title: "By style",
    links: [
      { name: "Quiet, off the beaten path", meta: "Fewer trekkers, wild valleys", href: treksFilterPath({ show: "quiet" }), icon: "landscape" },
      // Every trek is private and teahouse-based for now (no data to filter on), so these open the full list.
      { name: "Teahouse treks", meta: "Lodges every night", href: ROUTES.treks, icon: "cottage" },
      { name: "Private treks", meta: "Your group, your dates", href: ROUTES.treks, icon: "groups" },
    ],
  },
];

/** The Treks menu's columns: popular published treks (left out while there are none), by length, by style. */
export const trekColumns = (treks: readonly TrekSummary[]): TrekColumn[] => {
  const popular = popularColumn(treks);
  return popular.links.length > 0 ? [popular, ...FIXED_TREK_COLUMNS] : [...FIXED_TREK_COLUMNS];
};

/** The Treks menu's footer line: "12 treks across 9 regions · private treks on your dates". */
export const treksMenuNote = (trekCount: number, regionCount: number) =>
  trekCount > 0 && regionCount > 0
    ? `${formatCount(trekCount, "trek")} across ${formatCount(regionCount, "region")} · private treks on your dates`
    : "Private treks on your dates";

/** The Regions menu: every region, opening its page (its treks while it has no page yet). */
export const regionLinks = (regions: readonly RegionSummary[]): RegionLink[] =>
  regions.map((region) => ({
    name: region.name,
    meta: `Up to ${formatAltitude(region.maxAltitudeM)}`,
    href: regionHref(region),
    image: region.image,
  }));

/** Each opens the Travel guides list filtered to that topic (the same links as the page's topic cards). */
export const GUIDE_LINKS: readonly TopicLink[] = [
  { name: "Planning and permits", meta: "Permits, visas, costs, guides", href: guideListHref({ topic: "planning" }), icon: "description", tone: "brand" },
  { name: "Best time to trek", meta: "Seasons and weather by region", href: guideListHref({ topic: "best-time" }), icon: "wb_sunny", tone: "saffron" },
  { name: "Health and altitude", meta: "Fitness, acclimatization, safety", href: guideListHref({ topic: "health" }), icon: "health_and_safety", tone: "green" },
  { name: "Gear and packing", meta: "Packing lists and rentals", href: guideListHref({ topic: "gear" }), icon: "backpack", tone: "navy" },
];

export const ABOUT_LINKS: readonly TopicLink[] = [
  { name: "Our story", meta: "Who we are and why we started", href: ABOUT_PATHS.story, icon: "cottage", tone: "brand" },
  { name: "Our guides and team", meta: "Meet the people who lead you", href: ABOUT_PATHS.team, icon: "groups", tone: "green" },
  { name: "Reviews", meta: "What trekkers say about us", href: ABOUT_PATHS.reviews, icon: "person", tone: "saffron" },
  { name: "Why travel with us", meta: "Safety, prices, flexibility", href: ABOUT_PATHS.whyUs, icon: "shield_person", tone: "navy" },
  { name: "Licences and legal", meta: "Registration and memberships", href: ABOUT_PATHS.licences, icon: "verified", tone: "brand" },
  { name: "Responsible travel", meta: "Porters, villages, nature", href: ABOUT_PATHS.responsibleTravel, icon: "volunteer_activism", tone: "green" },
];
