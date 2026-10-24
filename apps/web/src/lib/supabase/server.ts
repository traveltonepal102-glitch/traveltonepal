import "server-only";
import { createClient } from "@supabase/supabase-js";

import { env } from "@/env";

import type { Database } from "./database.types";

/**
 * The database for the website's server, read-only: the publishable key reads the "web_" views and nothing
 * else (no sign-in, no cookies, never used in the browser).
 */
export const createWebsiteClient = () =>
  createClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
