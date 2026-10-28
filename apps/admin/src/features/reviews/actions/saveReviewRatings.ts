"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { REVIEWS_PATH } from "../constants";
import { readRatingsForm } from "../schemas/reviewSchema";
import { saveReviewRatings as saveRatingsToDatabase } from "../services/reviewsRepository";

/** Saves the overall ratings ("4.9 from 37 reviews on Google"), typed from the review sites' own numbers. */
export const saveReviewRatings = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const parsed = readRatingsForm(formData);
  if (!parsed.ok) return { status: "error", message: "Check the highlighted numbers.", fieldErrors: parsed.fieldErrors };

  if (!(await saveRatingsToDatabase(parsed.ratings))) {
    return { status: "error", message: "The ratings couldn't be saved. Try again in a moment.", fieldErrors: {} };
  }

  refreshWebsite([WEBSITE_CACHE_TAGS.reviews]);
  revalidatePath(REVIEWS_PATH);
  return { status: "saved" };
};
