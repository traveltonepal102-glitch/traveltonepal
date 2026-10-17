export type TrekDifficulty = "Easy" | "Moderate" | "Challenging" | "Strenuous";

/** Character of a trek, used by the home chips and the Treks page "Quiet trails" shortcut. */
export type TrekTag = "classic" | "off-the-beaten-path";

export type TrekSeason = "spring" | "autumn" | "winter" | "monsoon";

/** What cards, menus and filters need; the full trek comes from Payload later. */
export type TrekSummary = {
  slug: string;
  name: string;
  region: string;
  /** Slug of the region (filters and links). */
  regionSlug: string;
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
  hasFixedDates: boolean;
  image?: { src: string; alt: string };
};
