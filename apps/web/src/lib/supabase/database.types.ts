/**
 * The database as the website sees it: the read-only "web_" views (supabase/migrations/…_website_views.sql) and
 * two writes, record_guide_feedback and record_contact_click. Keep in step with those.
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

/** A page's chosen share photo (null: none chosen); every library photo has a 1200×630 share.jpg. */
export type ShareColumns = {
  share_id: string | null;
  share_variant_widths: number[] | null;
  share_place: string | null;
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
export type WebRegionPageRow = ShareColumns & {
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
  /** No longer shown: trekkers pick their own start date (kept in the view, unused). */
  has_fixed_dates: boolean;
  price_from_usd: number | null;
  region_slug: string;
  region_name: string;
  updated_at: string;
  /** True once it has a day-by-day plan: the trek has its own page (web_trek_pages). */
  has_page: boolean;
  /** Every region on the route in order, the main region (region_slug) first. */
  route_regions: { slug: string; name: string }[];
};

/**
 * The rest of a trek's page; only published treks that have one (web_treks.has_page). JSON columns are `unknown`:
 * the website checks their shape when it reads them (trekPageRows).
 */
export type WebTrekPageRow = ShareColumns & {
  id: string;
  slug: string;
  locale: Locale;
  headline: string;
  short_name: string;
  seo_title: string;
  seo_description: string;
  category: string;
  protected_area: string;
  current_season: string;
  days_note: string;
  grade: number;
  high_point: string;
  optional_high_point: string;
  optional_high_point_m: number | null;
  /** Rich text (@ttn/ui/lib/richText), as are itinerary_intro and each day's and answer's text. */
  introduction: unknown;
  /** Up to 3 of { label, icon, tone }. */
  photo_badges: unknown;
  highlights_heading: string;
  /** Titled points { title, text }, as are suitability_points, included, excluded and the meal lists. */
  highlights: unknown;
  suitability_intro: string;
  suitability_points: unknown;
  itinerary_intro: unknown;
  /** In order: [{ place, title, subtitle, duration, altitude_m, sleep_altitude_m, is_high_point, description, photo }]. */
  days: unknown;
  guides_intro: string;
  included: unknown;
  excluded: unknown;
  meal_budget_min_usd: number | null;
  meal_budget_max_usd: number | null;
  meal_trail_tips: unknown;
  meal_teahouse_notes: unknown;
  start_finish: string;
  distance_km: number | null;
  daily_walking: string;
  guide_ratio: string;
  accommodation: string;
  transport: string;
  trek_start: string;
  map_place: string;
  my_maps_id: string | null;
  packing_intro: string;
  /** [{ title, icon, items: [{ title, text }] }]. */
  packing_groups: unknown;
  know_heading: string;
  /** [{ icon, title, points: [{ title, text }], note }]. */
  know_topics: unknown;
  /** [{ title, icon, items: [{ question, answer }] }]. */
  faqs: unknown;
  /** In order: [{ label, short_label, price_usd, team, is_default }]. */
  group_prices: unknown;
  /** No longer shown: trekkers pick their own start date (kept in the view, unused). */
  has_fixed_dates: boolean;
  /** No longer shown (see has_fixed_dates). */
  departures: unknown;
  /** Published ones only, in the admin's order. */
  similar_slugs: string[];
  hidden_shared_sections: string[];
  /** The route's best months, Jan–Dec ("best" | "possible" | "avoid"): each month the worst of its regions. */
  region_month_ratings: string[] | null;
  /** The trek's own order of its page sections (TREK_PAGE_SECTIONS keys); empty = the default order. */
  section_order: string[];
};

/** A trek's gallery photo (the photo columns named as in the other views). */
export type WebTrekPhotoRow = CoverColumns & { trek_slug: string; position: number };

/** A guide shown on a trek's page, in the admin's order (agreed to be shown, leads treks). */
export type WebTrekGuideRow = CoverColumns & {
  trek_slug: string;
  position: number;
  locale: Locale;
  id: string;
  name: string;
  role: string;
  quote: string;
  home_village: string;
  home_district: string;
  years_guiding: number | null;
  languages: string[];
  badge: WebRegionGuideRow["badge"];
  is_licensed: boolean;
  /** Valid today. */
  has_wfr: boolean;
  has_first_aid: boolean;
  /** Of nathm, nma and language (no end date). */
  other_certificates: string[];
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
  /** The author's name (a trekking guide author's comes from the guide). */
  author_name: string;
  /** Regions the guide is about, A–Z. */
  region_slugs: string[];
  /** About 200 words a minute, at least 1. */
  read_minutes: number;
};

/**
 * The rest of a published travel guide's page (web_travel_guide_pages). JSON columns are `unknown`: the website
 * checks their shape when it reads them (guidePageRows).
 */
export type WebTravelGuidePageRow = CoverColumns & ShareColumns & {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  intro: string;
  highlight_tag: string;
  updated_line: string;
  /** Up to 4 of { icon, label, value }. */
  facts: unknown;
  seo_title: string;
  seo_description: string;
  /** The help box beside the guide; "" = the default wording (@ttn/config/guideHelpBox). */
  help_heading: string;
  help_text: string;
  help_message: string;
  published_on: string;
  updated_on: string | null;
  topic: WebTravelGuideRow["topic"];
  month_ratings: ("best" | "possible" | "avoid")[] | null;
  /** Jan–Dec: [{ onTheTrail, crowds }]. */
  month_notes: unknown;
  cover_alt: string;
  /** Published treks only. */
  main_trek_slug: string | null;
  photo_trek_slug: string | null;
  /** { kind, name, job_title, bio, photo }. */
  author: unknown;
  /** { name, role, photo }, or null without a checker who agreed to be shown. */
  checker: unknown;
  /** Published ones only, in order. */
  related_slugs: string[];
  region_slugs: string[];
  read_minutes: number;
  /** In order: [{ type, settings, content, trek_slug, trek_slugs, guides, photos, days }]. */
  sections: unknown;
};

/** Site settings, as the website shows them (one row: contact details, company and licences, social links). */
export type WebSiteSettingsRow = {
  phone_country_code: string;
  phone_number: string;
  email: string;
  office_address: string;
  office_days: number[];
  /** "HH:MM", Nepal time. */
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
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  tripadvisor_url: string;
  google_business_url: string;
  certificate_id: string | null;
  certificate_width: number | null;
  certificate_height: number | null;
  certificate_variant_widths: number[] | null;
  share_id: string | null;
  share_variant_widths: number[] | null;
  updated_at: string;
  linkedin_url: string;
  google_review_url: string;
  /** The PAN registration certificate scan (About › Licences). */
  pan_certificate_id: string | null;
  pan_certificate_width: number | null;
  pan_certificate_height: number | null;
  pan_certificate_variant_widths: number[] | null;
  /** The office on Google Maps: its share link and the address from Google's "Embed a map" code ("" when not set). */
  google_maps_url: string;
  google_maps_embed_url: string;
};

/** An old address that answers with a permanent redirect to today's (only to a page that exists). */
export type WebRedirectRow = { kind: "trek" | "region" | "guide"; from_slug: string; to_slug: string };

export type SitePageSlug = "about" | "contact" | "home" | "treks" | "regions" | "travel-guides" | "terms" | "privacy" | "impressum" | "cookies";

/** A fixed page from the admin's Pages: its top, Google result and `content` (what only that page has, read with zod). */
export type WebSitePageRow = CoverColumns & ShareColumns & {
  slug: SitePageSlug;
  eyebrow: string;
  heading: string;
  intro: string;
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
  content: unknown;
  updated_at: string;
  /** About: the founder (an office author); the photo only with their consent. */
  founder_name: string | null;
  founder_role: string | null;
  founder_photo_id: string | null;
  founder_photo_variant_widths: number[] | null;
  founder_photo_placeholder: string | null;
  /** The page's photos by place: [{ id, width, height, variant_widths, placeholder, place, position }] (About: 1 the founder, 2 "flexible", 3–5 the villages). */
  story_photos: unknown;
};

/** About › "Our guides and team": office authors, then trekking guides. */
export type WebAboutTeamRow = CoverColumns & {
  team_group: "office" | "guides";
  id: string;
  name: string;
  role: string;
  place: string;
  languages: string[];
  sort_group: number;
  years_guiding: number;
};

type View<Row> = { Row: Row; Relationships: [] };

/** A review the admin chose to show (supabase/migrations/20261027130000_reviews.sql), copied word for word. */
export type WebReviewRow = {
  id: string;
  source: "google" | "tripadvisor";
  /** The review itself on the review site. */
  url: string;
  reviewer_name: string;
  /** "" when the review site doesn't say. */
  reviewer_country: string;
  rating: number;
  title: string;
  quote: string;
  /** "YYYY-MM-DD". */
  reviewed_on: string;
  /** Set while the trek it is about is published. */
  trek_slug: string | null;
  trek_name: string | null;
  /** The reviewer's photo (photo library), or null: the card shows their initial. */
  photo_id: string | null;
  photo_variant_widths: number[] | null;
  photo_placeholder: string | null;
};

/** The overall rating on a review site, as typed in the admin, with the profile from Site settings. */
export type WebReviewRatingRow = { source: "google" | "tripadvisor"; rating: number; review_count: number; profile_url: string };

/** The custom adventures section's words (web_adventure_section, one row). `steps`: 3 of { title, text }, read leniently. */
export type WebAdventureSectionRow = {
  eyebrow: string;
  heading: string;
  intro: string;
  ask_title: string;
  ask_text: string;
  steps_title: string;
  steps: unknown;
  note: string;
};

/** A custom adventure card the website shows (web_adventures: shown ones, always with a photo). */
export type WebAdventureRow = CoverColumns & {
  id: string;
  title: string;
  tag: string;
  summary: string;
  photo_alt: string;
  position: number;
};

/**
 * One of the SEO person's own JSON-LD blocks (web_page_schemas: shown ones, on pages the website shows), for a
 * fixed page (page_slug: its SitePageSlug) or a trek, region or guide (its slug). `data`: schema.org without "@context".
 */
export type WebPageSchemaRow = { page_kind: "page" | "trek" | "region" | "guide"; page_slug: string; position: number; data: unknown };

/**
 * A page the website shows that names another page of the site as its main version or is hidden from Google
 * (web_page_seo_overrides): a fixed page (page_slug: its SitePageSlug) or a trek, region or guide (its slug).
 */
export type WebPageSeoOverrideRow = {
  page_kind: "page" | "trek" | "region" | "guide";
  page_slug: string;
  locale: Locale;
  /** "" when it is its own main version. */
  canonical_path: string;
  hide_from_google: boolean;
};

export type Database = {
  public: {
    Tables: { [_ in never]: never };
    Views: {
      web_regions: View<WebRegionRow>;
      web_region_pages: View<WebRegionPageRow>;
      web_region_photos: View<WebRegionPhotoRow>;
      web_region_guides: View<WebRegionGuideRow>;
      web_treks: View<WebTrekRow>;
      web_trek_pages: View<WebTrekPageRow>;
      web_trek_photos: View<WebTrekPhotoRow>;
      web_trek_guides: View<WebTrekGuideRow>;
      web_travel_guides: View<WebTravelGuideRow>;
      web_travel_guide_pages: View<WebTravelGuidePageRow>;
      web_redirects: View<WebRedirectRow>;
      web_site_settings: View<WebSiteSettingsRow>;
      web_site_pages: View<WebSitePageRow>;
      web_about_team: View<WebAboutTeamRow>;
      web_reviews: View<WebReviewRow>;
      web_review_ratings: View<WebReviewRatingRow>;
      web_adventure_section: View<WebAdventureSectionRow>;
      web_adventures: View<WebAdventureRow>;
      web_page_schemas: View<WebPageSchemaRow>;
      web_page_seo_overrides: View<WebPageSeoOverrideRow>;
    };
    Functions: {
      /** "Was this guide helpful?": the website's one write (…_guide_feedback.sql). False: unknown guide or too many votes. */
      record_guide_feedback: { Args: { p_slug: string; p_is_helpful: boolean }; Returns: boolean };
      /** One WhatsApp or email button click for a page (…_contact_clicks.sql): no cookie, no IP address. */
      record_contact_click: { Args: { p_channel: "whatsapp" | "email"; p_page_path: string }; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
