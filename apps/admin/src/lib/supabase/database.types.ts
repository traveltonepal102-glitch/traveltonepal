/**
 * Types for the Supabase database (public schema), written to match supabase/migrations/.
 * Keep in step with the migrations. To generate instead (needs Docker running):
 *   supabase gen types typescript --db-url "<DATABASE_URI>" --schema public
 */
export type AdminRole = "super_admin" | "editor";

export type MonthRating = "best" | "possible" | "avoid";

/** What region_usage lists as still using a region. */
export type RegionUsageKind = "trek" | "travel_guide" | "trekking_guide" | "region";

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
  /** TREK_PAGE_SECTIONS keys in the trek's own order; empty = the default order. */
  section_order: string[];
  optional_high_point_m: number | null;
  /** pdf-maps/<uuid>.pdf in the trek-files bucket. */
  pdf_map_path: string | null;
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
  /** Rich text (Tiptap JSON). */
  itinerary_intro: Json;
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
  current_season: string;
  category: string;
  protected_area: string;
  days_note: string;
  high_point: string;
  optional_high_point: string;
  activity: string;
  suitability_heading: string;
  itinerary_heading: string;
  route_line: string;
  inclusions_heading: string;
  guides_heading: string;
  elevation_heading: string;
  elevation_note: string;
  route_map_heading: string;
  trek_start: string;
  trek_end: string;
  pricing_heading: string;
  pricing_intro: string;
  packing_heading: string;
  know_heading: string;
  know_intro: string;
  /** [{ icon, title, points: [{ title, text }], note, photoId, videoId }] */
  know_topics: Json;
  faq_heading: string;
  similar_heading: string;
  similar_intro: string;
  /** [{ youtubeId, title, inGallery, inGuide }] */
  videos: Json;
  seo_keyword: string;
  seo_title: string;
  seo_description: string;
  /** The photo shown when the page is shared (its 1200×630 share.jpg); null: the page's main photo. */
  share_photo_id: string | null;
  updated_at: string;
};

type TrekGuideRow = { trek_id: string; guide_id: string; position: number };

/** The badge printed on a guide's photo (its words and icon are set by the admin and the website). */
export type GuideBadgeValue = "local" | "culture" | "solo" | "rescue" | "family" | "photo";

type TrekkingGuideRow = {
  id: string;
  name: string;
  photo_id: string | null;
  /** The guide agreed that we show their photo and name. */
  photo_consent: boolean;
  home_village: string;
  home_district: string;
  age: number | null;
  years_guiding: number | null;
  badge: GuideBadgeValue;
  languages: string[];
  /** Admin only, never on the website. */
  licence_number: string;
  licence_valid_until: string | null;
  /** "nathm" | "wfr" | "first_aid" | "nma" | "language" */
  certificates: string[];
  wfr_valid_until: string | null;
  first_aid_valid_until: string | null;
  show_on_about: boolean;
  can_lead_treks: boolean;
  can_fact_check: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type TrekkingGuideTranslationRow = { guide_id: string; locale: "en" | "de"; role: string; bio: string; quote: string };

export type ReviewSourceValue = "google" | "tripadvisor";

/** A real review copied from a review site (supabase/migrations/20261027130000_reviews.sql). */
export type ReviewRow = {
  id: string;
  source: ReviewSourceValue;
  url: string;
  reviewer_name: string;
  reviewer_country: string;
  rating: number;
  title: string;
  quote: string;
  /** "YYYY-MM-DD". */
  reviewed_on: string;
  trek_id: string | null;
  is_shown: boolean;
  /** The reviewer's photo (photo library); null: the website shows their initial. */
  photo_id: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
};

/** The home page's custom adventures section, one row (supabase/migrations/20261028110000_custom_adventures.sql). */
export type AdventureSectionRow = {
  id: boolean;
  eyebrow: string;
  heading: string;
  intro: string;
  ask_title: string;
  ask_text: string;
  steps_title: string;
  /** 3 of { title, text }. */
  steps: Json;
  note: string;
  updated_at: string;
  updated_by: string | null;
};

/** One custom adventure card. */
export type AdventureRow = {
  id: string;
  title: string;
  tag: string;
  summary: string;
  photo_id: string | null;
  photo_alt: string;
  position: number;
  is_shown: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
};

/** One custom JSON-LD block on a page (supabase/migrations/20261029155000_page_schemas.sql): exactly one page column is set. */
export type PageSchemaRow = {
  id: string;
  site_page_slug: SitePageSlug | null;
  trek_id: string | null;
  region_id: string | null;
  article_id: string | null;
  position: number;
  label: string;
  /** schema.org data without "@context". */
  data: Json;
  is_shown: boolean;
  updated_at: string;
  updated_by: string | null;
};

/** One "Was this guide helpful?" vote from the website (supabase/migrations/20261028100000_guide_feedback.sql). */
export type ArticleFeedbackRow = { id: number; article_id: string; is_helpful: boolean; created_at: string };

/** The overall rating on a review site, as typed in. */
export type ReviewRatingRow = { source: ReviewSourceValue; rating: number; review_count: number; updated_at: string; updated_by: string | null };

export type AuthorKindValue = "office" | "guide" | "guest";

/** The one row of Site settings (supabase/migrations/20261026120000_site_settings.sql). */
export type SiteSettingsRow = {
  id: boolean;
  phone_country_code: string;
  phone_number: string;
  email: string;
  office_address: string;
  office_days: number[];
  /** "HH:MM:SS". */
  office_opens: string;
  office_closes: string;
  reply_languages: string[];
  legal_name: string;
  legal_form: string;
  founded_year: number | null;
  tourism_registration: string;
  tourism_licence: string;
  company_registration: string;
  pan_number: string;
  taan_number: string;
  memberships: string[];
  staff_insurer: string;
  payments_note: string;
  certificate_photo_id: string | null;
  /** The PAN registration certificate, beside the agency licence on the About page. */
  pan_certificate_photo_id: string | null;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tripadvisor_url: string;
  google_business_url: string;
  linkedin_url: string;
  google_review_url: string;
  /** The office's Google Maps share link, and the address from Google's "Embed a map" code. */
  google_maps_url: string;
  google_maps_embed_url: string;
  share_photo_id: string | null;
  updated_at: string;
  updated_by: string | null;
};

export type SitePageSlug = "about" | "contact" | "home" | "treks" | "regions" | "travel-guides" | "terms" | "privacy" | "impressum" | "cookies";

/** One fixed page of the website (supabase/migrations/20261026150000_site_pages.sql); `content` is checked by zod. */
export type SitePageRow = {
  slug: SitePageSlug;
  eyebrow: string;
  heading: string;
  intro: string;
  seo_title: string;
  seo_description: string;
  /** The photo shown when the page is shared (its 1200×630 share.jpg); null: the page's main photo. */
  share_photo_id: string | null;
  seo_keyword: string;
  photo_id: string | null;
  founder_author_id: string | null;
  content: Json;
  updated_at: string;
  updated_by: string | null;
};

type SitePagePhotoRow = { page_slug: SitePageSlug; position: number; photo_id: string };

type AuthorRow = {
  id: string;
  kind: AuthorKindValue;
  /** Only for kind "guide". */
  guide_id: string | null;
  name: string;
  photo_id: string | null;
  photo_consent: boolean;
  /** "en" | "de" */
  writes_in: string[];
  topics: string[];
  /** For Google; the first is the main link. */
  profile_links: string[];
  show_author_box: boolean;
  show_on_about: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type AuthorTranslationRow = { author_id: string; locale: "en" | "de"; job_title: string; bio: string };

export type ArticleTopicValue = "best-time" | "planning" | "health" | "gear";
export type ArticleStatusValue = "draft" | "published" | "hidden";

type ArticleRow = {
  id: string;
  /** Null: the main site. */
  site_region_id: string | null;
  also_on_main_site: boolean;
  slug: string;
  topic: ArticleTopicValue;
  status: ArticleStatusValue;
  /** "YYYY-MM-DD", a Nepal date. */
  published_on: string | null;
  updated_on: string | null;
  is_featured: boolean;
  start_here_position: number | null;
  author_id: string | null;
  checker_guide_id: string | null;
  main_trek_id: string | null;
  photo_trek_id: string | null;
  cover_photo_id: string | null;
  /** Jan–Dec, shared by the guide's "Month by month" sections; null until set. */
  month_ratings: MonthRating[] | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

type ArticleTranslationRow = {
  article_id: string;
  locale: "en" | "de";
  title: string;
  intro: string;
  card_text: string;
  cover_alt: string;
  highlight_tag: string;
  updated_line: string;
  /** [{ icon, label, value }] */
  facts: Json;
  seo_keyword: string;
  seo_title: string;
  seo_description: string;
  /** The photo shown when the page is shared (its 1200×630 share.jpg); null: the page's main photo. */
  share_photo_id: string | null;
  /** Jan–Dec: [{ onTheTrail, crowds }], or [] */
  month_notes: Json;
  updated_at: string;
};

export type ArticleSectionTypeValue =
  | "text"
  | "paragraph"
  | "quick"
  | "callout"
  | "check"
  | "table"
  | "html"
  | "quote"
  | "trek"
  | "months"
  | "days"
  | "altitude"
  | "cost"
  | "compare"
  | "tip"
  | "gquote"
  | "meet"
  | "image"
  | "gallery"
  | "map"
  | "embed"
  | "video"
  | "faq"
  | "cta";

type ArticleSectionRow = {
  id: string;
  article_id: string;
  position: number;
  type: ArticleSectionTypeValue;
  trek_id: string | null;
  /** The same in every language, e.g. { tone } of a note, { view } of the months. */
  settings: Json;
};

/** The section's words: text { heading, tocLabel, body }, quick { body }, trek {}, faq { items }. */
type ArticleSectionTranslationRow = { section_id: string; locale: "en" | "de"; content: Json };

type ArticleSectionGuideRow = { section_id: string; guide_id: string; position: number };

type ArticleSectionPhotoRow = { section_id: string; photo_id: string; position: number };

/** pin_position: 0–2 when the region pins the guide first ("Before you go"), else null. */
type ArticleRegionRow = { article_id: string; region_id: string; pin_position: number | null };

type ArticleRelatedRow = { article_id: string; related_article_id: string; position: number };

type TrekkingGuideRegionRow = { guide_id: string; region_id: string };

type TrekSimilarRow = { trek_id: string; similar_trek_id: string; position: number };

/** A region a trek passes through after its main region (treks.region_id); position 1 = second on the route. */
type TrekRegionRow = { trek_id: string; region_id: string; position: number };

type TrekDayRow = {
  id: string;
  trek_id: string;
  position: number;
  altitude_m: number;
  sleep_altitude_m: number | null;
  is_high_point: boolean;
  photo_id: string | null;
  /** "breakfast" | "lunch" | "dinner" */
  meals: string[];
  /** On a trek across several regions: the region the day is in; null = the same as the day before. */
  region_id: string | null;
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
  /** Rich text (Tiptap JSON). */
  description: Json;
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
  /** The photo shown when the page is shared (its 1200×630 share.jpg); null: the page's main photo. */
  share_photo_id: string | null;
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
        Relationships: [
          Fk<"trek_translations_trek_id_fkey", "trek_id", "treks">,
          Fk<"trek_translations_share_photo_id_fkey", "share_photo_id", "photos">,
        ];
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
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [Fk<"site_settings_certificate_photo_id_fkey", "certificate_photo_id", "photos">,
          Fk<"site_settings_share_photo_id_fkey", "share_photo_id", "photos">,
          Fk<"site_settings_pan_certificate_photo_id_fkey", "pan_certificate_photo_id", "photos">,
        ];
      };
      site_pages: {
        Row: SitePageRow;
        Insert: never;
        Update: Partial<SitePageRow>;
        Relationships: [
          Fk<"site_pages_photo_id_fkey", "photo_id", "photos">,
          Fk<"site_pages_founder_author_id_fkey", "founder_author_id", "authors">,
          Fk<"site_pages_share_photo_id_fkey", "share_photo_id", "photos">,
        ];
      };
      site_page_photos: {
        Row: SitePagePhotoRow;
        Insert: SitePagePhotoRow;
        Update: never;
        Relationships: [Fk<"site_page_photos_page_slug_fkey", "page_slug", "site_pages">, Fk<"site_page_photos_photo_id_fkey", "photo_id", "photos">];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow> & Pick<ReviewRow, "url" | "reviewer_name" | "rating" | "quote" | "reviewed_on">;
        Update: Partial<ReviewRow>;
        Relationships: [Fk<"reviews_trek_id_fkey", "trek_id", "treks">, Fk<"reviews_photo_id_fkey", "photo_id", "photos">];
      };
      adventure_section: {
        Row: AdventureSectionRow;
        Insert: never;
        Update: Partial<AdventureSectionRow>;
        Relationships: [];
      };
      adventures: {
        Row: AdventureRow;
        Insert: Partial<AdventureRow> & Pick<AdventureRow, "title" | "summary">;
        Update: Partial<AdventureRow>;
        Relationships: [Fk<"adventures_photo_id_fkey", "photo_id", "photos">];
      };
      page_schemas: {
        Row: PageSchemaRow;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      article_feedback: {
        Row: ArticleFeedbackRow;
        Insert: never;
        Update: never;
        Relationships: [Fk<"article_feedback_article_id_fkey", "article_id", "articles">];
      };
      review_ratings: {
        Row: ReviewRatingRow;
        Insert: Partial<ReviewRatingRow> & Pick<ReviewRatingRow, "source" | "rating" | "review_count">;
        Update: Partial<ReviewRatingRow>;
        Relationships: [];
      };
      authors: {
        Row: AuthorRow;
        Insert: Partial<AuthorRow> & Pick<AuthorRow, "kind">;
        Update: Partial<AuthorRow>;
        Relationships: [Fk<"authors_photo_id_fkey", "photo_id", "photos">, Fk<"authors_guide_id_fkey", "guide_id", "trekking_guides">];
      };
      author_translations: {
        Row: AuthorTranslationRow;
        Insert: Partial<AuthorTranslationRow> & Pick<AuthorTranslationRow, "author_id" | "locale" | "job_title">;
        Update: Partial<AuthorTranslationRow>;
        Relationships: [Fk<"author_translations_author_id_fkey", "author_id", "authors">];
      };
      articles: {
        Row: ArticleRow;
        Insert: Partial<ArticleRow> & Pick<ArticleRow, "slug" | "topic">;
        Update: Partial<ArticleRow>;
        Relationships: [
          Fk<"articles_cover_photo_id_fkey", "cover_photo_id", "photos">,
          Fk<"articles_author_id_fkey", "author_id", "authors">,
          Fk<"articles_checker_guide_id_fkey", "checker_guide_id", "trekking_guides">,
          Fk<"articles_site_region_id_fkey", "site_region_id", "regions">,
          Fk<"articles_main_trek_id_fkey", "main_trek_id", "treks">,
          Fk<"articles_photo_trek_id_fkey", "photo_trek_id", "treks">,
        ];
      };
      article_translations: {
        Row: ArticleTranslationRow;
        Insert: Partial<ArticleTranslationRow> & Pick<ArticleTranslationRow, "article_id" | "locale" | "title">;
        Update: Partial<ArticleTranslationRow>;
        Relationships: [
          Fk<"article_translations_article_id_fkey", "article_id", "articles">,
          Fk<"article_translations_share_photo_id_fkey", "share_photo_id", "photos">,
        ];
      };
      article_sections: {
        Row: ArticleSectionRow;
        Insert: Partial<ArticleSectionRow> & Pick<ArticleSectionRow, "article_id" | "position" | "type">;
        Update: Partial<ArticleSectionRow>;
        Relationships: [Fk<"article_sections_article_id_fkey", "article_id", "articles">, Fk<"article_sections_trek_id_fkey", "trek_id", "treks">];
      };
      article_section_translations: {
        Row: ArticleSectionTranslationRow;
        Insert: Partial<ArticleSectionTranslationRow> & Pick<ArticleSectionTranslationRow, "section_id" | "locale">;
        Update: Partial<ArticleSectionTranslationRow>;
        Relationships: [Fk<"article_section_translations_section_id_fkey", "section_id", "article_sections">];
      };
      article_section_guides: {
        Row: ArticleSectionGuideRow;
        Insert: ArticleSectionGuideRow;
        Update: Partial<ArticleSectionGuideRow>;
        Relationships: [
          Fk<"article_section_guides_section_id_fkey", "section_id", "article_sections">,
          Fk<"article_section_guides_guide_id_fkey", "guide_id", "trekking_guides">,
        ];
      };
      article_section_photos: {
        Row: ArticleSectionPhotoRow;
        Insert: ArticleSectionPhotoRow;
        Update: Partial<ArticleSectionPhotoRow>;
        Relationships: [
          Fk<"article_section_photos_section_id_fkey", "section_id", "article_sections">,
          Fk<"article_section_photos_photo_id_fkey", "photo_id", "photos">,
        ];
      };
      article_regions: {
        Row: ArticleRegionRow;
        Insert: Omit<ArticleRegionRow, "pin_position"> & Partial<Pick<ArticleRegionRow, "pin_position">>;
        Update: Partial<ArticleRegionRow>;
        Relationships: [Fk<"article_regions_article_id_fkey", "article_id", "articles">, Fk<"article_regions_region_id_fkey", "region_id", "regions">];
      };
      article_related: {
        Row: ArticleRelatedRow;
        Insert: ArticleRelatedRow;
        Update: Partial<ArticleRelatedRow>;
        Relationships: [
          Fk<"article_related_article_id_fkey", "article_id", "articles">,
          Fk<"article_related_related_article_id_fkey", "related_article_id", "articles">,
        ];
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
      trek_regions: {
        Row: TrekRegionRow;
        Insert: TrekRegionRow;
        Update: Partial<TrekRegionRow>;
        Relationships: [
          Fk<"trek_regions_trek_id_fkey", "trek_id", "treks">,
          Fk<"trek_regions_region_id_fkey", "region_id", "regions">,
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
          Fk<"region_translations_share_photo_id_fkey", "share_photo_id", "photos">,
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
      save_article: {
        Args: { p_article_id: string | null; p_locale: string; p_article: Json; p_text: Json; p_region_ids: Json; p_related_ids: Json; p_sections: Json };
        Returns: string;
      };
      save_site_settings: {
        Args: { p_settings: Json };
        Returns: undefined;
      };
      save_site_page: {
        Args: { p_slug: SitePageSlug; p_page: Json; p_photo_ids: Json };
        Returns: undefined;
      };
      save_site_pages: {
        Args: { p_pages: Json };
        Returns: undefined;
      };
      save_review: {
        Args: { p_review_id: string | null; p_review: Json };
        Returns: string;
      };
      save_review_ratings: {
        Args: { p_ratings: Json };
        Returns: undefined;
      };
      save_adventure_section: {
        Args: { p_section: Json };
        Returns: undefined;
      };
      save_adventure: {
        Args: { p_adventure_id: string | null; p_adventure: Json };
        Returns: string;
      };
      save_page_schemas: {
        Args: { p_page_kind: "page" | "trek" | "region" | "guide"; p_page_key: string; p_schemas: Json };
        Returns: undefined;
      };
      contact_click_totals: {
        Args: { p_days?: number };
        Returns: { channel: "whatsapp" | "email"; page_path: string; clicks: number }[];
      };
      guide_feedback_totals: {
        Args: { p_article_id?: string };
        Returns: { article_id: string; helpful_count: number; not_helpful_count: number; last_vote_at: string }[];
      };
      photo_ids_in: {
        Args: { p_value: Json };
        Returns: string[];
      };
      photo_uses: {
        Args: { p_photo_id?: string };
        Returns: { photo_id: string; kind: string; item_id: string; item_label: string; detail: string }[];
      };
      delete_unused_photo: {
        Args: { p_photo_id: string };
        Returns: { master_key: string; variant_widths: number[] }[];
      };
      save_author: {
        Args: { p_author_id: string | null; p_locale: string; p_author: Json; p_text: Json };
        Returns: string;
      };
      save_trekking_guide: {
        Args: { p_guide_id: string | null; p_locale: string; p_guide: Json; p_text: Json; p_region_ids: Json };
        Returns: string;
      };
      save_region: {
        Args: { p_region_id: string | null; p_locale: string; p_region: Json; p_text: Json; p_photos: Json };
        Returns: string;
      };
      region_usage: {
        Args: { p_region_id: string; p_locale?: string };
        Returns: { kind: RegionUsageKind; id: string; name: string }[];
      };
      delete_region: {
        Args: { p_region_id: string };
        Returns: undefined;
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
      guide_badge: GuideBadgeValue;
      author_kind: AuthorKindValue;
      review_source: ReviewSourceValue;
      article_topic: ArticleTopicValue;
      article_status: ArticleStatusValue;
      article_section_type: ArticleSectionTypeValue;
      departure_status: DepartureStatusValue;
      region_difficulty: RegionDifficultyValue;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type CurrentAdmin = Database["public"]["Functions"]["current_admin"]["Returns"][number];
