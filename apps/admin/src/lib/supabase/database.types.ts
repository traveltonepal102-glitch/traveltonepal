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

type RegionTranslationRow = {
  region_id: string;
  locale: "en" | "de";
  name: string;
  pin_label: string;
  tagline: string;
  /** Rich text (Tiptap JSON), see src/lib/richText. */
  introduction: Json;
  best_for: string[];
  highest_point: string;
  trek_length: string;
  difficulty: string;
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
  updated_at: string;
};

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
    Enums: { admin_role: AdminRole; month_rating: MonthRating };
    CompositeTypes: { [_ in never]: never };
  };
};

export type CurrentAdmin = Database["public"]["Functions"]["current_admin"]["Returns"][number];
