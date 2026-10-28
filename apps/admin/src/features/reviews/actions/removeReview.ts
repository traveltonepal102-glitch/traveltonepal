"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { REVIEWS_PATH } from "../constants";
import { removeReview as removeReviewFromDatabase } from "../services/reviewsRepository";

/**
 * Removes a review for good, then closes the panel (switching "Show on website" off hides it instead). Super
 * admins only: checked here for the message, and enforced by RLS. reviewId comes from the browser, so it is checked.
 */
export const removeReview = async (reviewId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove a review." };
  if (!z.uuid().safeParse(reviewId).success) return { error: "This review no longer exists." };

  try {
    if (!(await removeReviewFromDatabase(reviewId))) return { error: "This review no longer exists, or your account can't remove it." };
  } catch (error) {
    console.error(error);
    return { error: "The review couldn't be removed. Try again in a moment." };
  }

  refreshWebsite([WEBSITE_CACHE_TAGS.reviews]);
  revalidatePath(REVIEWS_PATH);
  redirect(REVIEWS_PATH);
};
