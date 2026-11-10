"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { removeUnusedTrekFile } from "@/lib/storage/trekFiles";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { TREKS_PATH } from "../constants";
import { deleteTrek as deleteTrekFromDatabase } from "../services/trekDeletionRepository";

const FAILURE_MESSAGES = {
  forbidden: "Only a Super admin can delete a trek.",
  not_found: "This trek no longer exists. Go back to Treks.",
  in_use: "Something was linked to this trek in the meantime. Reload the page to see what, and take it off first.",
  failed: "The trek couldn't be deleted. Try again in a moment.",
} as const;

/**
 * Deletes a trek of the website `siteId` for good, with its printable map, then opens Treks. Super admins only:
 * checked here for the message, and enforced by RLS. The database refuses while anything still uses the trek. Both
 * ids come from the browser, so they are checked.
 */
export const deleteTrek = async (siteId: string, trekId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: FAILURE_MESSAGES.forbidden };
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite?.status === "error") return { error: wrongSite.message };
  if (!z.uuid().safeParse(trekId).success) return { error: FAILURE_MESSAGES.not_found };

  try {
    const result = await deleteTrekFromDatabase(trekId, siteId);
    if (result.status !== "deleted") return { error: FAILURE_MESSAGES[result.status] };
    if (result.pdfMapPath) await removeUnusedTrekFile(result.pdfMapPath);
  } catch (error) {
    console.error(error);
    return { error: FAILURE_MESSAGES.failed };
  }

  // Its page, the lists and similar treks (treks), its reviews now without a trek, and its own JSON-LD blocks.
  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.treks, WEBSITE_CACHE_TAGS.reviews, WEBSITE_CACHE_TAGS.structuredData]);
  revalidatePath(TREKS_PATH);
  redirect(TREKS_PATH);
};
