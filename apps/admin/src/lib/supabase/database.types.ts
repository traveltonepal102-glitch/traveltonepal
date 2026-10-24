/**
 * Types for the Supabase database (public schema), written to match supabase/migrations/.
 * Keep in step with the migrations. To generate instead (needs Docker running):
 *   supabase gen types typescript --db-url "<DATABASE_URI>" --schema public
 */
export type AdminRole = "super_admin" | "editor";

export type MonthRating = "best" | "possible" | "avoid";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type RegionRow = {
  id: string;
  slug: string;
  district: string;
  website_domain: string | null;
  latitude: number | null;
  longitude: number | null;
  month_ratings: MonthRating[];
  cover_photo_id: string | null;
  /** One of the region's own treks, shown as its signature trek. */
  featured_trek_id: string | null;
  max_altitude_m: number | null;
  difficulty: RegionDifficultyValue | null;
  is_flight: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type PhotoRow = {
  id: string;
  region_id: string | null;
  master_key: string;
  variant_widths: number[];
  width: number;
  height: number;
  placeholder: string;
  place: string;
  original_name: string;
  byte_size: number;
  created_at: string;
  created_by: string | null;
  updated_at: string;
};

type RegionPhotoRow = { region_id: string; photo_id: string; position: number };

export type TrekStatusValue = "draft" | "published" | "hidden";
export type TrekDifficultyValue = "easy" | "moderate" | "challenging" | "strenuous";
export type TrekSeasonValue = "spring" | "autumn" | "winter" | "monsoon";
export type TrekTagValue = "classic" | "off-the-beaten-path";

type TrekRow = {
  id: string;
  slug: string;
  region_id: string;
  status: TrekStatusValue;
  difficulty: TrekDifficultyValue;
  grade: number;
  days: number;
  max_altitude_m: number;
  distance_km: number | null;
  seasons: TrekSeasonValue[];
  tags: TrekTagValue[];
  is_popular: boolean;
  price_from_usd: number | null;
  cover_photo_id: string | null;
  meal_budget_min_usd: number | null;
  meal_budget_max_usd: number | null;
  has_fixed_dates: boolean;
  /** What the Google map centres on, e.g. "Kyanjin Gompa, Langtang, Nepal". */
  map_place: string;
  /** Google My Maps id, to draw the GPS trail on the map. */
  my_maps_id: string | null;
  /** Shared sections this trek doesn't show (see the trek editor's SHARED_SECTIONS). */
  hidden_shared_sections: string[];
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type TrekTranslationRow = {
  trek_id: string;
  locale: "en" | "de";
  name: string;
  summary: string;
  card_badge: string;
  photo_badges: Json;
  start_finish: string;
  daily_walking: string;
  guide_ratio: string;
  season_label: string;
  accommodation: string;
  transport: string;
  /** Rich text (Tiptap JSON), see src/lib/richText. */
  introduction: Json;
  highlights_heading: string;
  /** [{ title, text }] */
  highlights: Json;
  suitability_intro: string;
  /** [{ title, text }] */
  suitability_points: Json;
  itinerary_intro: string;
  /** [{ title, text }] each: what's covered, what's not, meal tips, teahouse notes. */
  included: Json;
  excluded: Json;
  meal_trail_tips: Json;
  meal_teahouse_notes: Json;
  packing_intro: string;
  /** [{ title, icon, items: [{ title, text }] }] */
  packing_groups: Json;
  /** [{ title, icon, items: [{ question, answer }] }] */
  faqs: Json;
  /** The page's H1, written for search. */
  headline: string;
  /** How people say it, e.g. "Langtang Trek". */
  short_name: string;
  /** One line above "Meet your trek guide". */
  guides_intro: string;
  seo_keyword: string;
  seo_title: string;
  seo_description: string;
  updated_at: string;
};

type TrekGuideRow = { trek_id: string; guide_id: string; position: number };

export type FirstAidLevel = "wfr" | "basic" | "none";

type TrekkingGuideRow = {
  id: string;
  name: string;
  photo_id: string | null;
  home: string;
  age: number | null;
  years_guiding: number | null;
  specialty_icon: string;
  languages: string[];
  /** Admin only, never on the website. */
  licence_number: string;
  licence_valid_until: string | null;
  first_aid: FirstAidLevel;
  show_on_about: boolean;
  can_lead_treks: boolean;
  can_fact_check: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type TrekkingGuideTranslationRow = { guide_id: string; locale: "en" | "de"; role: string; specialty: string; bio: string; quote: string };

type TrekkingGuideRegionRow = { guide_id: string; region_id: string };

type TrekSimilarRow = { trek_id: string; similar_trek_id: string; position: number };

type TrekDayRow = {
  id: string;
  trek_id: string;
  position: number;
  altitude_m: number;
  sleep_altitude_m: number | null;
  is_high_point: boolean;
  photo_id: string | null;
};

type TrekGroupPriceRow = { id: string; trek_id: string; position: number; price_usd: number; is_default: boolean };
type TrekGroupPriceTranslationRow = { price_id: string; locale: "en" | "de"; label: string; short_label: string; team: string };
/** start_date is "YYYY-MM-DD". */
export type DepartureStatusValue = "guaranteed" | "open" | "almost_full" | "full";

type TrekDepartureRow = {
  id: string;
  trek_id: string;
  start_date: string;
  status: DepartureStatusValue;
  special_price_usd: number | null;
  /** Never shown on the website. */
  team_note: string;
};
type TrekDepartureTranslationRow = { departure_id: string; locale: "en" | "de"; note: string };

type TrekDayTranslationRow = {
  day_id: string;
  locale: "en" | "de";
  place: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
};

type TrekPhotoRow = { trek_id: string; photo_id: string; position: number };

/** A foreign key to another table's id, as supabase-js expects it in Relationships. */
type Fk<Name extends string, Column extends string, Table extends string> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: Table;
  referencedColumns: ["id"];
};

type RegionTranslationRow = {
  region_id: string;
  locale: "en" | "de";
  name: string;
  pin_label: string;
  tagline: string;
  /** Rich text (Tiptap JSON), see src/lib/richText. */
  introduction: Json;
  best_for: string[];
  trek_length: string;
  getting_there: string;
  getting_there_details: string;
  permits: string;
  season_spring: string;
  season_monsoon: string;
  season_autumn: string;
  season_winter: string;
  faqs: Json;
  seo_keyword: string;
  seo_title: string;
  seo_description: string;
  featured_trek_label: string;
  featured_trek_pitch: string;
  custom_route_pitch: string;
  short_name: string;
  summary: string;
  hero_highlight: string;
  overview_heading: string;
  /** [{ icon, title, text }] */
  why_points: Json;
  from_kathmandu: string;
  nearest_airport: string;
  permits_details: string;
  where_you_sleep: string;
  updated_at: string;
};

export type RegionDifficultyValue = "easy" | "easy_moderate" | "moderate" | "easy_challenging" | "challenging" | "strenuous";

type RegionCompareRow = { region_id: string; other_region_id: string; position: number };

type RegionNearbyTrekRow = { region_id: string; trek_id: string; position: number };

type RegionNearbyTrekTranslationRow = { region_id: string; trek_id: string; locale: "en" | "de"; label: string; note: string };

type RegionHiddenGuideRow = { region_id: string; guide_id: string };

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: { id: string; full_name: string; role: AdminRole; created_at: string };
        Insert: { id: string; full_name?: string; role?: AdminRole; created_at?: string };
        Update: { id?: string; full_name?: string; role?: AdminRole; created_at?: string };
        Relationships: [];
      };
      login_locks: {
        Row: { email: string; failed_attempts: number; locked_until: string | null; updated_at: string };
        Insert: { email: string; failed_attempts?: number; locked_until?: string | null; updated_at?: string };
        Update: { email?: string; failed_attempts?: number; locked_until?: string | null; updated_at?: string };
        Relationships: [];
      };
      regions: {
        Row: RegionRow;
        Insert: Partial<RegionRow> & Pick<RegionRow, "slug">;
        Update: Partial<RegionRow>;
        Relationships: [
          {
            foreignKeyName: "regions_cover_photo_id_fkey";
            columns: ["cover_photo_id"];
            isOneToOne: false;
            referencedRelation: "photos";
            referencedColumns: ["id"];
          },
          Fk<"regions_featured_trek_id_fkey", "featured_trek_id", "treks">,
        ];
      };
      region_nearby_treks: {
        Row: RegionNearbyTrekRow;
        Insert: RegionNearbyTrekRow;
        Update: Partial<RegionNearbyTrekRow>;
        Relationships: [Fk<"region_nearby_treks_region_id_fkey", "region_id", "regions">, Fk<"region_nearby_treks_trek_id_fkey", "trek_id", "treks">];
      };
      region_nearby_trek_translations: {
        Row: RegionNearbyTrekTranslationRow;
        Insert: Partial<RegionNearbyTrekTranslationRow> & Pick<RegionNearbyTrekTranslationRow, "region_id" | "trek_id" | "locale">;
        Update: Partial<RegionNearbyTrekTranslationRow>;
        Relationships: [
          {
            foreignKeyName: "region_nearby_trek_translations_region_id_trek_id_fkey";
            columns: ["region_id", "trek_id"];
            isOneToOne: false;
            referencedRelation: "region_nearby_treks";
            referencedColumns: ["region_id", "trek_id"];
          },
        ];
      };
      region_compare: {
        Row: RegionCompareRow;
        Insert: RegionCompareRow;
        Update: Partial<RegionCompareRow>;
        Relationships: [Fk<"region_compare_region_id_fkey", "region_id", "regions">, Fk<"region_compare_other_region_id_fkey", "other_region_id", "regions">];
      };
      region_hidden_guides: {
        Row: RegionHiddenGuideRow;
        Insert: RegionHiddenGuideRow;
        Update: Partial<RegionHiddenGuideRow>;
        Relationships: [
          Fk<"region_hidden_guides_region_id_fkey", "region_id", "regions">,
          Fk<"region_hidden_guides_guide_id_fkey", "guide_id", "trekking_guides">,
        ];
      };
      photos: {
        Row: PhotoRow;
        Insert: Partial<PhotoRow> &
          Pick<PhotoRow, "master_key" | "variant_widths" | "width" | "height" | "byte_size">;
        Update: Partial<PhotoRow>;
        Relationships: [
          {
            foreignKeyName: "photos_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      treks: {
        Row: TrekRow;
        Insert: Partial<TrekRow> & Pick<TrekRow, "slug" | "region_id" | "days" | "max_altitude_m">;
        Update: Partial<TrekRow>;
        Relationships: [
          Fk<"treks_region_id_fkey", "region_id", "regions">,
          Fk<"treks_cover_photo_id_fkey", "cover_photo_id", "photos">,
        ];
      };
      trek_translations: {
        Row: TrekTranslationRow;
        Insert: Partial<TrekTranslationRow> & Pick<TrekTranslationRow, "trek_id" | "locale" | "name">;
        Update: Partial<TrekTranslationRow>;
        Relationships: [Fk<"trek_translations_trek_id_fkey", "trek_id", "treks">];
      };
      trek_photos: {
        Row: TrekPhotoRow;
        Insert: TrekPhotoRow;
        Update: Partial<TrekPhotoRow>;
        Relationships: [Fk<"trek_photos_trek_id_fkey", "trek_id", "treks">, Fk<"trek_photos_photo_id_fkey", "photo_id", "photos">];
      };
      trek_days: {
        Row: TrekDayRow;
        Insert: Partial<TrekDayRow> & Pick<TrekDayRow, "trek_id" | "position" | "altitude_m">;
        Update: Partial<TrekDayRow>;
        Relationships: [Fk<"trek_days_trek_id_fkey", "trek_id", "treks">, Fk<"trek_days_photo_id_fkey", "photo_id", "photos">];
      };
      trek_day_translations: {
        Row: TrekDayTranslationRow;
        Insert: Partial<TrekDayTranslationRow> & Pick<TrekDayTranslationRow, "day_id" | "locale" | "title">;
        Update: Partial<TrekDayTranslationRow>;
        Relationships: [Fk<"trek_day_translations_day_id_fkey", "day_id", "trek_days">];
      };
      trek_group_prices: {
        Row: TrekGroupPriceRow;
        Insert: Partial<TrekGroupPriceRow> & Pick<TrekGroupPriceRow, "trek_id" | "position" | "price_usd">;
        Update: Partial<TrekGroupPriceRow>;
        Relationships: [Fk<"trek_group_prices_trek_id_fkey", "trek_id", "treks">];
      };
      trek_group_price_translations: {
        Row: TrekGroupPriceTranslationRow;
        Insert: TrekGroupPriceTranslationRow;
        Update: Partial<TrekGroupPriceTranslationRow>;
        Relationships: [Fk<"trek_group_price_translations_price_id_fkey", "price_id", "trek_group_prices">];
      };
      trek_departures: {
        Row: TrekDepartureRow;
        Insert: Partial<TrekDepartureRow> & Pick<TrekDepartureRow, "trek_id" | "start_date">;
        Update: Partial<TrekDepartureRow>;
        Relationships: [Fk<"trek_departures_trek_id_fkey", "trek_id", "treks">];
      };
      trek_departure_translations: {
        Row: TrekDepartureTranslationRow;
        Insert: TrekDepartureTranslationRow;
        Update: Partial<TrekDepartureTranslationRow>;
        Relationships: [Fk<"trek_departure_translations_departure_id_fkey", "departure_id", "trek_departures">];
      };
      trek_guides: {
        Row: TrekGuideRow;
        Insert: TrekGuideRow;
        Update: Partial<TrekGuideRow>;
        Relationships: [Fk<"trek_guides_trek_id_fkey", "trek_id", "treks">, Fk<"trek_guides_guide_id_fkey", "guide_id", "trekking_guides">];
      };
      trekking_guides: {
        Row: TrekkingGuideRow;
        Insert: Partial<TrekkingGuideRow> & Pick<TrekkingGuideRow, "name">;
        Update: Partial<TrekkingGuideRow>;
        Relationships: [Fk<"trekking_guides_photo_id_fkey", "photo_id", "photos">];
      };
      trekking_guide_translations: {
        Row: TrekkingGuideTranslationRow;
        Insert: Partial<TrekkingGuideTranslationRow> & Pick<TrekkingGuideTranslationRow, "guide_id" | "locale" | "role">;
        Update: Partial<TrekkingGuideTranslationRow>;
        Relationships: [Fk<"trekking_guide_translations_guide_id_fkey", "guide_id", "trekking_guides">];
      };
      trekking_guide_regions: {
        Row: TrekkingGuideRegionRow;
        Insert: TrekkingGuideRegionRow;
        Update: Partial<TrekkingGuideRegionRow>;
        Relationships: [
          Fk<"trekking_guide_regions_guide_id_fkey", "guide_id", "trekking_guides">,
          Fk<"trekking_guide_regions_region_id_fkey", "region_id", "regions">,
        ];
      };
      trek_similar: {
        Row: TrekSimilarRow;
        Insert: TrekSimilarRow;
        Update: Partial<TrekSimilarRow>;
        Relationships: [
          Fk<"trek_similar_trek_id_fkey", "trek_id", "treks">,
          Fk<"trek_similar_similar_trek_id_fkey", "similar_trek_id", "treks">,
        ];
      };
      region_photos: {
        Row: RegionPhotoRow;
        Insert: RegionPhotoRow;
        Update: Partial<RegionPhotoRow>;
        Relationships: [
          {
            foreignKeyName: "region_photos_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "region_photos_photo_id_fkey";
            columns: ["photo_id"];
            isOneToOne: false;
            referencedRelation: "photos";
            referencedColumns: ["id"];
          },
        ];
      };
      region_translations: {
        Row: RegionTranslationRow;
        Insert: Partial<RegionTranslationRow> & Pick<RegionTranslationRow, "region_id" | "locale" | "name">;
        Update: Partial<RegionTranslationRow>;
        Relationships: [
          {
            foreignKeyName: "region_translations_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      admin_upsert_user: {
        Args: { p_email: string; p_password: string; p_full_name: string; p_role?: AdminRole };
        Returns: string;
      };
      current_admin: {
        Args: never;
        Returns: { id: string; email: string; full_name: string; role: AdminRole }[];
      };
      is_admin: { Args: never; Returns: boolean };
      is_super_admin: { Args: never; Returns: boolean };
      save_trek: {
        Args: {
          p_trek_id: string | null;
          p_locale: string;
          p_trek: Json;
          p_text: Json;
          p_photos: Json;
          p_days: Json;
          p_prices: Json;
          p_departures: Json;
        };
        Returns: string;
      };
      save_departure: {
        Args: { p_departure_id: string | null; p_locale: string; p_departure: Json };
        Returns: string;
      };
      add_departures: {
        Args: { p_trek_id: string; p_locale: string; p_departures: Json };
        Returns: number;
      };
      save_trekking_guide: {
        Args: { p_guide_id: string | null; p_locale: string; p_guide: Json; p_text: Json; p_region_ids: Json };
        Returns: string;
      };
      save_region: {
        Args: { p_region_id: string | null; p_locale: string; p_region: Json; p_text: Json; p_photos: Json };
        Returns: string;
      };
      login_clear_failures: { Args: { p_email: string }; Returns: undefined };
      login_locked_until: { Args: { p_email: string }; Returns: string | null };
      login_record_failure: {
        Args: { p_email: string; p_max_attempts: number; p_lock_seconds: number };
        Returns: { failed_attempts: number; locked_until: string | null }[];
      };
    };
    Enums: {
      admin_role: AdminRole;
      month_rating: MonthRating;
      trek_status: TrekStatusValue;
      trek_difficulty: TrekDifficultyValue;
      trek_season: TrekSeasonValue;
      trek_tag: TrekTagValue;
      first_aid_level: FirstAidLevel;
      departure_status: DepartureStatusValue;
      region_difficulty: RegionDifficultyValue;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type CurrentAdmin = Database["public"]["Functions"]["current_admin"]["Returns"][number];
