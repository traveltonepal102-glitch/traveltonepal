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
    Views: { web_regions: View<WebRegionRow>; web_treks: View<WebTrekRow>; web_travel_guides: View<WebTravelGuideRow> };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
