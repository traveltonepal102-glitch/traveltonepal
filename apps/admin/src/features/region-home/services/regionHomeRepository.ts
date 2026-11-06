import "server-only";

import type { SavePageInput } from "@/features/pages/services/pagesRepository";
import { toPagePayload } from "@/features/pages/services/pagesRepository";
import { TREK_LOCALE } from "@/features/treks/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { HomeTrekOption } from "../types";

/** The website's treks to pick as its main trek, A–Z. Throws when the database can't be read. */
export const listHomeTrekOptions = async (siteId: string): Promise<HomeTrekOption[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("treks").select("id, status, trek_translations!inner(name)").eq("site_id", siteId).eq("trek_translations.locale", TREK_LOCALE);
  if (error) throw new Error(`Could not load the website's treks: ${error.message}`);
  return data.map((trek) => ({ id: trek.id, name: trek.trek_translations[0]?.name ?? "", status: trek.status })).sort((a, b) => a.name.localeCompare(b.name));
};

export type SaveRegionHomeResult = { ok: true } | { ok: false; reason: "forbidden" | "missing" | "failed" };

const RLS_VIOLATION = "42501";
const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";

/** Saves a region website's Home (save_region_home): the top and Google result, and the main trek, in one transaction. */
export const saveRegionHome = async (siteId: string, page: SavePageInput, homeTrekId: string | null): Promise<SaveRegionHomeResult> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_region_home", { p_site_id: siteId, p_page: toPagePayload(page), p_home_trek_id: homeTrekId });
  if (!error) return { ok: true };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  // The main trek is no longer this website's (or a photo was deleted), or the website itself is gone.
  if (error.code === FOREIGN_KEY_VIOLATION || error.code === NOT_FOUND) return { ok: false, reason: "missing" };
  console.error(`save_region_home failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};
