"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { REGIONS_PATH } from "../constants";
import { deleteRegion as deleteRegionFromDatabase } from "../services/regionsRepository";

const FAILURE_MESSAGES = {
  forbidden: "Only a Super admin can delete a region.",
  not_found: "This region no longer exists. Go back to Regions.",
  in_use: "Something was linked to this region in the meantime. Reload the page to see what, and take it off first.",
  failed: "The region couldn't be deleted. Try again in a moment.",
} as const;

/**
 * Deletes a region for good, then opens the Regions list. Super admins only: checked here for the message, and
 * enforced by RLS. The database refuses while anything still uses the region. regionId comes from the browser, so it
 * is checked.
 */
export const deleteRegion = async (regionId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: FAILURE_MESSAGES.forbidden };
  if (!z.uuid().safeParse(regionId).success) return { error: FAILURE_MESSAGES.not_found };

  try {
    const result = await deleteRegionFromDatabase(regionId);
    if (result !== "deleted") return { error: FAILURE_MESSAGES[result] };
  } catch (error) {
    console.error(error);
    return { error: FAILURE_MESSAGES.failed };
  }

  // The Regions page, the region's own page, the sitemap and the list pages' region count.
  refreshWebsite([WEBSITE_CACHE_TAGS.regions]);
  revalidatePath(REGIONS_PATH);
  redirect(REGIONS_PATH);
};
