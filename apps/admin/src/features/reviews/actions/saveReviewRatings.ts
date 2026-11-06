"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { REVIEWS_PATH } from "../constants";
import { readRatingsForm } from "../schemas/reviewSchema";
import { saveReviewRatings as saveRatingsToDatabase } from "../services/reviewsRepository";

/** Saves the overall ratings ("4.9 from 37 reviews on Google"), typed from the review sites' own numbers, for the website `siteId` (bound by the page). */
export const saveReviewRatings = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;
  const parsed = readRatingsForm(formData);
  if (!parsed.ok) return { status: "error", message: "Check the highlighted numbers.", fieldErrors: parsed.fieldErrors };

  if (!(await saveRatingsToDatabase(siteId, parsed.ratings))) {
    return { status: "error", message: "The ratings couldn't be saved. Try again in a moment.", fieldErrors: {} };
  }

  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.reviews]);
  revalidatePath(REVIEWS_PATH);
  return { status: "saved" };
};
