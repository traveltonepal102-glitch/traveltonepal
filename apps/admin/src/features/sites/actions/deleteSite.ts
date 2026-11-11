"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { sitesSavedPath } from "../constants";
import type { DeleteSiteFailure } from "../services/sitesRepository";
import { deleteSite as deleteSiteFromDatabase } from "../services/sitesRepository";

const MESSAGES: Record<DeleteSiteFailure, string> = {
  main_site: "The main site can't be deleted.",
  site_is_live: "This site is live. Switch it off and save first, then delete it.",
  has_content: "This site still has treks, travel guides, reviews, adventures, trekking guides or authors. Delete them first.",
  not_found: "This site no longer exists.",
  forbidden: "Only a Super admin can delete a site.",
  failed: "The site couldn't be deleted. Try again in a moment.",
};

/**
 * Deletes a draft region site for good, then opens Sites. Super admins only: checked here for the message, and
 * enforced with the "not live, not the main site" rules by the database. siteId comes from the browser.
 */
export const deleteSite = async (siteId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: MESSAGES.forbidden };

  const result = await deleteSiteFromDatabase(siteId);
  if (!result.ok) return { error: MESSAGES[result.reason] };

  // "Working on" falls back to the main site when it showed this one.
  revalidatePath("/", "layout");
  redirect(sitesSavedPath("deleted"));
};
