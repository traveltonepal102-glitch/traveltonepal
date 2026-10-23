import "server-only";
import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

import type { Database } from "./database.types";

/**
 * Supabase client with the secret key: it bypasses Row Level Security. Used only for the sign-in lock
 * (login_* functions, which signed-out visitors can't call). Never use it to read or change content.
 */
export const createSupabaseAdminClient = () =>
  createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
