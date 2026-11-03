import "server-only";
import { MAIN_SITE_ID } from "@ttn/config/sites";
import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { EditSiteValues, NewSiteValues, Site } from "../types";

/** Postgres error codes the save can raise. */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const RLS_VIOLATION = "42501";
const CHECK_VIOLATION = "23514";
const NOT_FOUND = "P0002";
const INVALID_REQUEST = "22023";
/** PostgREST: the table or function isn't in the database (the sites migration isn't applied yet). */
const TABLE_MISSING = "PGRST205";
const FUNCTION_MISSING = "PGRST202";

/** Until supabase/migrations/20261103100000_sites.sql is applied: the main site alone, so the admin keeps working. */
const MAIN_SITE_ONLY: Site[] = [
  { id: MAIN_SITE_ID, kind: "main", regionId: null, name: "Travel To Nepal", url: "https://traveltonepal.com", isLive: true, position: 1 },
];

/** Every site, in switcher order (the main site first). Throws when the database can't be read. Once per request. */
export const listSites = cache(async (): Promise<Site[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sites")
    .select("id, kind, region_id, name, url, is_live, position")
    .order("position")
    .order("name");
  if (error?.code === TABLE_MISSING) {
    console.warn("The sites table is missing: apply supabase/migrations/20261103100000_sites.sql. Showing the main site only.");
    return MAIN_SITE_ONLY;
  }
  if (error) throw new Error(`Could not load sites: ${error.message}`);
  return data.map((row) => ({
    id: row.id,
    kind: row.kind,
    regionId: row.region_id,
    name: row.name,
    url: row.url,
    isLive: row.is_live,
    position: row.position,
  }));
});

export type AddSiteFailure = "id_taken" | "region_taken" | "url_taken" | "missing_region" | "forbidden" | "not_set_up" | "failed";

export type AddSiteResult = { ok: true; siteId: string } | { ok: false; reason: AddSiteFailure };

/** Which unique rule a duplicate broke, from the constraint name Postgres reports. */
const duplicateReason = (message: string): AddSiteFailure => {
  if (message.includes("sites_region_id_key")) return "region_taken";
  if (message.includes("sites_url_key")) return "url_taken";
  return "id_taken";
};

/** Adds a region site as a draft (save_site). */
export const addSite = async (values: NewSiteValues): Promise<AddSiteResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_site", {
    p_site_id: null,
    p_site: { id: values.id, region_id: values.regionId, name: values.name, url: values.url },
  });
  if (!error) return { ok: true, siteId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: duplicateReason(error.message) };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_region" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  if (error.code === FUNCTION_MISSING) return { ok: false, reason: "not_set_up" };
  console.error(`save_site failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

export type SaveSiteFailure = "url_taken" | "needs_url" | "not_found" | "forbidden" | "failed";

/** Saves a site's name, address and "Live" switch (save_site; the main site stays live). */
export const saveSite = async (siteId: string, values: EditSiteValues): Promise<{ ok: true } | { ok: false; reason: SaveSiteFailure }> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_site", {
    p_site_id: siteId,
    p_site: { name: values.name, url: values.url, is_live: values.isLive },
  });
  if (!error) return { ok: true };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "url_taken" };
  if (error.code === CHECK_VIOLATION) return { ok: false, reason: "needs_url" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`save_site failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

export type DeleteSiteFailure = "main_site" | "site_is_live" | "has_content" | "not_found" | "forbidden" | "failed";

/** Deletes a draft region site (delete_site refuses the main site and a live one). */
export const deleteSite = async (siteId: string): Promise<{ ok: true } | { ok: false; reason: DeleteSiteFailure }> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("delete_site", { p_site_id: siteId });
  if (!error) return { ok: true };
  if (error.code === INVALID_REQUEST && (error.message === "main_site" || error.message === "site_is_live")) return { ok: false, reason: error.message };
  // Content that belongs to the site (from the next migrations) keeps it.
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "has_content" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`delete_site failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};
