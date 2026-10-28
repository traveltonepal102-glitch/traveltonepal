"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { REVIEWS_PATH, reviewsSavedPath } from "../constants";
import { readReviewForm, reviewSchema } from "../schemas/reviewSchema";
import { saveReview as saveReviewToDatabase } from "../services/reviewsRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  not_found: "This review no longer exists. Close the panel and open the review again.",
  missing_link: "The trek or the photo no longer exists. Pick the trek again, or upload the photo again.",
  forbidden: "Your account can't make this change.",
  failed: "The review couldn't be saved. Nothing was lost in the form: try Save again in a moment.",
} as const;

/**
 * Saves the review form (reviewId null adds a review), then closes the panel and the list says so. reviewId comes
 * from the browser (bound argument), so it is checked here; access is enforced by RLS.
 */
export const saveReview = async (reviewId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (reviewId !== null && !z.uuid().safeParse(reviewId).success) return failure(FAILURE_MESSAGES.not_found);

  const parsed = reviewSchema.safeParse(readReviewForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveReviewToDatabase(parsed.data, reviewId);
  if (!result.ok) {
    if (result.reason === "duplicate_link") return failure("This review is already in the list.", { url: "Another saved review has this link." });
    return failure(FAILURE_MESSAGES[result.reason]);
  }

  refreshWebsite([WEBSITE_CACHE_TAGS.reviews]);
  revalidatePath(REVIEWS_PATH);
  redirect(reviewsSavedPath(reviewId === null ? "added" : "changed"));
};
