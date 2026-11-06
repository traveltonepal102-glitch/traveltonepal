"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { REVIEWS_PATH, reviewsSavedPath } from "../constants";
import { removeReview as removeReviewFromDatabase } from "../services/reviewsRepository";

/**
 * Removes a review for good, then closes the panel (switching "Show on website" off hides it instead). Super
 * admins only: checked here for the message, and enforced by RLS. Both ids come from the browser, so they are checked.
 */
export const removeReview = async (siteId: string, reviewId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove a review." };
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite?.status === "error") return { error: wrongSite.message };
  if (!z.uuid().safeParse(reviewId).success) return { error: "This review no longer exists." };

  try {
    if (!(await removeReviewFromDatabase(reviewId))) return { error: "This review no longer exists, or your account can't remove it." };
  } catch (error) {
    console.error(error);
    return { error: "The review couldn't be removed. Try again in a moment." };
  }

  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.reviews]);
  revalidatePath(REVIEWS_PATH);
  redirect(reviewsSavedPath("removed"));
};
