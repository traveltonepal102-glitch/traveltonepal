import type { Photo, PhotoDetails } from "@/features/photos/types";
import type { RichTextDoc } from "@/lib/richText/richText";
import type { IconName } from "@ttn/ui/icon";

import type { MonthRating, RegionDifficultyValue, RegionUsageKind } from "@/lib/supabase/database.types";

export type SeasonKey = "spring" | "monsoon" | "autumn" | "winter";

export type RegionFaq = { question: string; answer: RichTextDoc };

/** The website's six difficulty levels (cards, filters and the compare table use them). */
export type RegionDifficulty = RegionDifficultyValue;

/** A "why trek here" card under the introduction, e.g. "Gentle climb: good for a first Himalayan trek". */
export type WhyPoint = { icon: WhyPointIcon; title: string; text: string };

export type WhyPointIcon = Extract<
  IconName,
  "landscape" | "temple_buddhist" | "directions_walk" | "volunteer_activism" | "mountain_flag" | "groups" | "wb_sunny" | "cottage" | "hiking" | "route"
>;

/** A trek from another region suggested on this region's page, e.g. "Nearby · same trailhead". */
export type NearbyTrek = { trekId: string; label: string; note: string };

/** Everything the region editor saves (one language). */
export type RegionValues = {
  name: string;
  district: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  pinLabel: string;
  tagline: string;
  introduction: RichTextDoc;
  bestFor: string[];
  /** Where space is tight, e.g. "Tamang Heritage" (optional). */
  shortName: string;
  /** One or two lines on the Regions page cards. */
  summary: string;
  /** The fourth small label over the top photo, e.g. "No flights needed". */
  heroHighlight: string;
  /** "About the region": the heading above the introduction. */
  overviewHeading: string;
  whyPoints: WhyPoint[];
  /** Highest point trekkers reach, in metres. */
  maxAltitudeM: number | null;
  trekLength: string;
  difficulty: RegionDifficulty | null;
  /** Short, e.g. "Drive" or "Fly to Lukla" (key facts and the Regions page). */
  gettingThere: string;
  /** Flown in: the website shows a plane instead of a road. */
  isFlight: boolean;
  /** One line on the Regions page, e.g. "Drive to Syabrubesi (7–8 hrs)". */
  gettingThereDetails: string;
  /** Short, e.g. "Langtang NP + TIMS" (key facts). */
  permits: string;
  /** "Where it is" lines. */
  fromKathmandu: string;
  nearestAirport: string;
  permitsDetails: string;
  whereYouSleep: string;
  /** Jan–Dec, always 12. */
  monthRatings: MonthRating[];
  seasons: Record<SeasonKey, string>;
  faqs: RegionFaq[];
  seoKeyword: string;
  seoTitle: string;
  seoDescription: string;
  /** The photo of the region's shared links (its 1200×630 share picture); null: the region's cover. */
  sharePhoto: Photo | null;
  /** Another page of the website ("/regions/…") as the main version of this one; "" = this page itself. */
  canonicalPath: string;
  /** "Hide from Google": noindex and not in the sitemap. */
  hideFromGoogle: boolean;
  /** One of the region's own treks, shown as its signature trek; null for none. */
  featuredTrekId: string | null;
  /** e.g. "Our signature Langtang trek" */
  featuredTrekLabel: string;
  featuredTrekPitch: string;
  nearbyTreks: NearbyTrek[];
  /** "Want your own route?" */
  customRoutePitch: string;
  /** Guides who lead here but are switched off for the region page (the others show automatically). */
  hiddenGuideIds: string[];
  /** "Compare with other regions": up to 4, in order; empty lets the website choose. */
  compareRegionIds: string[];
  /** "Before you go": up to 3 of the region's travel guides shown first, in order (the rest follow, newest first). */
  pinnedArticleIds: string[];
};

/** The region's photos as the editor shows them: the cover slot and the gallery, in order. */
export type RegionPhotos = { cover: Photo | null; gallery: Photo[] };

/** What the photos section saves: which photos, in which order, and their description and place. */
export type RegionPhotoSelection = { coverPhotoId: string | null; galleryPhotoIds: string[]; details: PhotoDetails[] };

/** Everything the editor's Save sends (checked by regionSchema). */
export type RegionFormValues = Omit<RegionValues, "sharePhoto"> & { sharePhotoId: string | null; photos: RegionPhotoSelection };

export type Region = RegionValues & {
  id: string;
  /** The region's own website; set by the developer. */
  websiteDomain: string | null;
  /** Every guide with this region in their regions (Trekking guides), shown or not. */
  leadingGuideIds: string[];
  /** Every travel guide about this region (ticked in the guide's settings), any status. */
  articleIds: string[];
  updatedAt: string;
  photos: RegionPhotos;
};

/** Something that still uses a region, so it can't be deleted yet (region_usage). */
export type RegionUsageItem = { kind: RegionUsageKind; id: string; name: string };

/** The editor's sections (design: Admin-region-editor). */
export type RegionSectionKey =
  | "basics"
  | "facts"
  | "about"
  | "where"
  | "treks"
  | "months"
  | "guides"
  | "photos"
  | "articles"
  | "faq"
  | "compare"
  | "seo";
