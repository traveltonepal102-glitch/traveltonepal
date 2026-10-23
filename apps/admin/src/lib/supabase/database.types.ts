/**
 * Types for the Supabase database (public schema), written to match supabase/migrations/.
 * Keep in step with the migrations. To generate instead (needs Docker running):
 *   supabase gen types typescript --db-url "<DATABASE_URI>" --schema public
 */
export type AdminRole = "super_admin" | "editor";

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
      login_clear_failures: { Args: { p_email: string }; Returns: undefined };
      login_locked_until: { Args: { p_email: string }; Returns: string | null };
      login_record_failure: {
        Args: { p_email: string; p_max_attempts: number; p_lock_seconds: number };
        Returns: { failed_attempts: number; locked_until: string | null }[];
      };
    };
    Enums: { admin_role: AdminRole };
    CompositeTypes: { [_ in never]: never };
  };
};

export type CurrentAdmin = Database["public"]["Functions"]["current_admin"]["Returns"][number];
