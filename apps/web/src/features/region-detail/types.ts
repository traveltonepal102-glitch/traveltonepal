import type { IconName } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { GuideSummary } from "@/features/guides/types";
import type { MonthRating } from "@/features/regions/overviews";
import type { RegionCard } from "@/features/regions/regionRows";
import type { PageSeo } from "@/features/seo/shareMetadata";
import type { TrekSummary } from "@/features/treks/types";
import type { SiteImageSource } from "@/lib/images";

export type { MonthRating };

export type RegionFact = { icon: IconName; tone: IconTone; label: string; value: string };

export type RegionPoint = { icon: IconName; tone: IconTone; title: string; text: string };

export type SeasonNote = { name: string; rating: MonthRating; text: string };

export type RegionPhoto = SiteImageSource & {
  /** Where it was taken, shown in the photo viewer, e.g. "Kyanjin Gompa". */
  place?: string;
};

/** A trek the page suggests: the featured one (with its pitch as `note`) or a nearby one. */
export type RegionTrekPick = { trek: TrekSummary; label: string; note: string };

/** A guide who leads treks in the region ("Your guides"). */
export type RegionGuide = {
  id: string;
  name: string;
  role: string;
  /** e.g. "10+ yrs guiding"; missing when not filled in. */
  experience?: string;
  quote?: string;
  languages: readonly string[];
  isLicensed: boolean;
  photo?: SiteImageSource;
};

export type RegionFaqItem = { question: string; answer: RichTextDoc };

/** Everything the region page shows: the region's card (facts, map pin, months) and the rest of its page. */
export type RegionDetail = RegionCard & {
  seo: PageSeo;
  /** Extra hero chip, e.g. "No flights needed"; blank to leave out. */
  heroHighlight: string;
  /** e.g. "Mar–May, Oct–Nov"; blank when no month is rated best. */
  bestMonthsLabel: string;
  overview: { heading: string; introduction: RichTextDoc; points: readonly RegionPoint[] };
  /** "Where it is" card lines (getting there, airport, permits, lodging); blank ones left out. */
  gettingThere: readonly { icon: IconName; label: string; value: string }[];
  featuredTrek?: RegionTrekPick;
  nearbyTreks: readonly RegionTrekPick[];
  customRoutePitch: string;
  /** Seasons with a note, in calendar order from spring. */
  seasons: readonly SeasonNote[];
  guides: readonly RegionGuide[];
  photos: readonly RegionPhoto[];
  /** "Before you go": travel guides about the region, pinned first. */
  articles: readonly GuideSummary[];
  faqs: readonly RegionFaqItem[];
  /** Regions to compare with: the admin's picks, else the nearest ones. */
  compareWith: readonly RegionCard[];
};
