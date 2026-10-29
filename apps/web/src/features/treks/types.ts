import type { SiteImageSource } from "@/lib/images";

export type TrekDifficulty = "Easy" | "Moderate" | "Challenging" | "Strenuous";

/** Character of a trek, used by the home chips and the Treks page "Quiet trails" shortcut. */
export type TrekTag = "classic" | "off-the-beaten-path";

export type TrekSeason = "spring" | "autumn" | "winter" | "monsoon";

/** A region on a trek's route. */
export type TrekRouteRegion = { slug: string; name: string };

/** What cards, menus and filters need; the full trek comes from Payload later. */
export type TrekSummary = {
  slug: string;
  name: string;
  region: string;
  /** Slug of the region (filters and links). */
  regionSlug: string;
  /** Every region on the route in order, the main one (region) first; a one-region trek has just that. */
  route: readonly TrekRouteRegion[];
  /** One line for the Treks page card. */
  summary: string;
  days: number;
  maxAltitudeM: number;
  difficulty: TrekDifficulty;
  /** Missing while the price is not set: cards show "Price on request". */
  priceFromUsd?: number;
  /** Best months, as shown on cards, e.g. "Mar–May, Oct–Nov". */
  seasonLabel: string;
  /** Seasons the trek suits, for the season filter. */
  seasons: readonly TrekSeason[];
  tags: readonly TrekTag[];
  /** Short highlight on the card photo, e.g. "Best value". */
  badge?: string;
  isPopular: boolean;
  /** It has its own page (a day-by-day plan); cards for the others offer a WhatsApp inquiry. */
  hasPage: boolean;
  /** When the trek was last saved (ISO), for the sitemap; demo treks have none. */
  updatedAt?: string;
  image?: SiteImageSource;
};
