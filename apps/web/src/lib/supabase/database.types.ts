/**
 * The database as the website sees it: only the read-only "web_" views (supabase/migrations/…_website_views.sql).
 * Keep in step with those views.
 */
type Locale = "en" | "de";

/** A view's photo columns (null without a photo). */
export type CoverColumns = {
  cover_id: string | null;
  cover_width: number | null;
  cover_height: number | null;
  cover_variant_widths: number[] | null;
  cover_placeholder: string | null;
  cover_place: string | null;
};

export type WebRegionRow = CoverColumns & {
  id: string;
  slug: string;
  locale: Locale;
  name: string;
  short_name: string;
  tagline: string;
  summary: string;
  max_altitude_m: number | null;
  website_domain: string | null;
  district: string;
  /** Map pin, in degrees; both null until the pin is set. */
  latitude: number | null;
  longitude: number | null;
  difficulty: "easy" | "easy_moderate" | "moderate" | "easy_challenging" | "challenging" | "strenuous" | null;
  is_flight: boolean;
  /** Jan–Dec, always 12. */
  month_ratings: ("best" | "possible" | "avoid")[];
  trek_length: string;
  getting_there: string;
  getting_there_details: string;
  permits: string;
  /** Up to 3 short phrases. */
  best_for: string[];
  /** True once the introduction is written: the region has its own page (web_region_pages). */
  has_page: boolean;
};

/**
 * The rest of a region's page; only regions that have one (web_regions.has_page). JSON columns are `unknown`:
 * the website checks their shape when it reads them (regionPageRows).
 */
export type WebRegionPageRow = {
  id: string;
  slug: string;
  locale: Locale;
  seo_title: string;
  seo_description: string;
  hero_highlight: string;
  overview_heading: string;
  /** Rich text (@ttn/ui/lib/richText). */
  introduction: unknown;
  /** Up to 4 of { icon, title, text }. */
  why_points: unknown;
  from_kathmandu: string;
  nearest_airport: string;
  permits_details: string;
  where_you_sleep: string;
  season_spring: string;
  season_monsoon: string;
  season_autumn: string;
  season_winter: string;
  /** Up to 20 of { question, answer (rich text) }. */
  faqs: unknown;
  /** Null when none is picked or it isn't published. */
  featured_trek_slug: string | null;
  featured_trek_label: string;
  featured_trek_pitch: string;
  custom_route_pitch: string;
  /** Published ones only, in order: [{ slug, label, note }]. */
  nearby_treks: unknown;
  compare_slugs: string[];
  /** Published ones only, pinned first, then the newest. */
  travel_guide_slugs: string[];
};

/** A region's gallery photo (the photo columns named as in the other views). */
export type WebRegionPhotoRow = CoverColumns & { region_slug: string; position: number };

/** A guide shown on a region's page (agreed to be shown, not switched off there). */
export type WebRegionGuideRow = CoverColumns & {
  region_slug: string;
  locale: Locale;
  id: string;
  name: string;
  role: string;
  quote: string;
  years_guiding: number | null;
  languages: string[];
  badge: "local" | "culture" | "solo" | "rescue" | "family" | "photo";
  is_licensed: boolean;
};

export type WebTrekRow = CoverColumns & {
  id: string;
  slug: string;
  locale: Locale;
  name: string;
  summary: string;
  card_badge: string;
  season_label: string;
  days: number | null;
  difficulty: "easy" | "moderate" | "challenging" | "strenuous";
  max_altitude_m: number | null;
  seasons: ("spring" | "autumn" | "winter" | "monsoon")[];
  tags: ("classic" | "off-the-beaten-path")[];
  is_popular: boolean;
  has_fixed_dates: boolean;
  price_from_usd: number | null;
  region_slug: string;
  region_name: string;
  updated_at: string;
};

export type WebTravelGuideRow = CoverColumns & {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  card_text: string;
  topic: "best-time" | "planning" | "health" | "gear";
  site_region_slug: string | null;
  also_on_main_site: boolean;
  is_featured: boolean;
  start_here_position: number | null;
  published_on: string;
  updated_on: string | null;
  cover_alt: string;
};

type View<Row> = { Row: Row; Relationships: [] };

export type Database = {
  public: {
    Tables: { [_ in never]: never };
    Views: {
      web_regions: View<WebRegionRow>;
      web_region_pages: View<WebRegionPageRow>;
      web_region_photos: View<WebRegionPhotoRow>;
      web_region_guides: View<WebRegionGuideRow>;
      web_treks: View<WebTrekRow>;
      web_travel_guides: View<WebTravelGuideRow>;
    };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
