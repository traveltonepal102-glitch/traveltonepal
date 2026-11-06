import { SITE_ID_HEADER } from "@ttn/config/sites";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

type SiteClientOptions = { supabaseUrl: string; publishableKey: string; siteId: string };

/**
 * A website's read-only database client: the publishable key reads the "web_" views and nothing else, and the header
 * makes those views return only this website's rows. No sign-in, no cookies, never used in the browser.
 */
export const createSiteClient = ({ supabaseUrl, publishableKey, siteId }: SiteClientOptions) =>
  createClient<Database>(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { [SITE_ID_HEADER]: siteId } },
  });
