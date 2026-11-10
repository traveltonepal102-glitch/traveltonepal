import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { TREK_LOCALE } from "../constants";
import type { TrekUsageItem } from "../types";

const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

/** What still uses a trek (trek_usage): a website's main trek, a region's featured trek, travel guides. */
export const getTrekUsage = async (trekId: string): Promise<TrekUsageItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("trek_usage", { p_trek_id: trekId, p_locale: TREK_LOCALE });
  if (error) throw new Error(`Could not check what uses trek ${trekId}: ${error.message}`);
  return data;
};

export type DeleteTrekResult =
  | { status: "deleted"; pdfMapPath: string | null }
  | { status: "in_use" | "not_found" | "forbidden" };

/**
 * Deletes a trek of the website `siteId` once nothing uses it (delete_trek, one transaction). "in_use": something
 * still does; "not_found": no such trek on that website; "forbidden": not a Super admin (RLS).
 */
export const deleteTrek = async (trekId: string, siteId: string): Promise<DeleteTrekResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("delete_trek", { p_trek_id: trekId, p_site_id: siteId });
  if (!error) return { status: "deleted", pdfMapPath: data };
  if (error.code === FOREIGN_KEY_VIOLATION) return { status: "in_use" };
  if (error.code === NOT_FOUND) return { status: "not_found" };
  if (error.code === RLS_VIOLATION) return { status: "forbidden" };
  throw new Error(`Could not delete trek ${trekId}: ${error.code} ${error.message}`);
};
