import type { IconName } from "@ttn/ui/icon";

import type { IconTone } from "@/components/shared/iconTones";
import type { RegionSummary } from "@/features/regions/regions";

/** How good a month is for trekking in the region. */
export type MonthRating = "best" | "possible" | "avoid";

export type RegionFact = { icon: IconName; tone: IconTone; label: string; value: string };

export type RegionPoint = { icon: IconName; tone: IconTone; title: string; text: string };

export type SeasonNote = { name: string; rating: MonthRating; text: string };

export type RegionPhoto = {
  src: string;
  alt: string;
  /** Where it was taken, shown in the photo viewer, e.g. "Kyanjin Gompa". */
  place?: string;
};

/** A travel guide about the region, linked from "Before you go". */
export type RegionArticle = {
  slug: string;
  title: string;
  category: string;
  tone: IconTone;
  readMinutes: number;
  image: RegionPhoto;
};

/** Everything the region page shows beyond REGIONS (name, highest point, photo). From Payload later. */
export type RegionDetailContent = {
  slug: string;
  seo: { title: string; description: string };
  /** District shown in the hero, e.g. "Rasuwa, Nepal". */
  district: string;
  /** Hero line under the name. */
  tagline: string;
  heroImage: RegionPhoto;
  /** Map pin, in degrees. */
  location: { lat: number; lon: number };
  /** e.g. "7–12 days" (the region's treks plus custom routes). */
  trekLength: string;
  difficulty: string;
  bestMonthsLabel: string;
  /** Extra hero chip, e.g. "No flights needed". */
  heroHighlight: string;
  facts: readonly RegionFact[];
  overview: { heading: string; paragraphs: readonly string[]; bestFor: readonly string[]; points: readonly RegionPoint[] };
  /** "Where it is" card lines (getting there, airport, permits, lodging). */
  gettingThere: readonly { icon: IconName; label: string; value: string }[];
  /** The region's signature trek (needs a trek page) and why. */
  featuredTrek: { slug: string; label: string; pitch: string };
  /** Other treks near the region, e.g. sharing the trailhead. */
  nearbyTreks: readonly { slug: string; label: string; note: string }[];
  customRoutePitch: string;
  /** Jan–Dec, exactly 12 entries. */
  months: readonly MonthRating[];
  seasons: readonly SeasonNote[];
  guideIds: readonly string[];
  photos: readonly RegionPhoto[];
  articles: readonly RegionArticle[];
  faqs: readonly { question: string; answer: string }[];
  /** Regions to compare with, by slug, in display order. */
  compareWith: readonly string[];
};

export type RegionDetail = RegionSummary & RegionDetailContent;
