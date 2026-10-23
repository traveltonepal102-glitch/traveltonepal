import type { Photo, PhotoDetails } from "@/features/photos/types";
import type { RichTextDoc } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

export type SeasonKey = "spring" | "monsoon" | "autumn" | "winter";

export type RegionFaq = { question: string; answer: RichTextDoc };

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
  highestPoint: string;
  trekLength: string;
  difficulty: string;
  gettingThere: string;
  gettingThereDetails: string;
  permits: string;
  /** Jan–Dec, always 12. */
  monthRatings: MonthRating[];
  seasons: Record<SeasonKey, string>;
  faqs: RegionFaq[];
  seoKeyword: string;
  seoTitle: string;
  seoDescription: string;
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
};

/** The region's photos as the editor shows them: the cover slot and the gallery, in order. */
export type RegionPhotos = { cover: Photo | null; gallery: Photo[] };

/** What the photos section saves: which photos, in which order, and their description and place. */
export type RegionPhotoSelection = { coverPhotoId: string | null; galleryPhotoIds: string[]; details: PhotoDetails[] };

/** Everything the editor's Save sends (checked by regionSchema). */
export type RegionFormValues = RegionValues & { photos: RegionPhotoSelection };

export type Region = RegionValues & {
  id: string;
  /** The region's own website; set by the developer. */
  websiteDomain: string | null;
  /** Every guide with this region in their regions (Trekking guides), shown or not. */
  leadingGuideIds: string[];
  updatedAt: string;
  photos: RegionPhotos;
};

/** The editor's sections (design: Admin-region-editor). */
export type RegionSectionKey = "basics" | "photos" | "facts" | "months" | "treks" | "guides" | "articles" | "faq" | "seo";
