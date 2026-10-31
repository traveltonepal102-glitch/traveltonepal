"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { removeUnusedTrekFile } from "@/lib/storage/trekFiles";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { TREKS_PATH, trekPath } from "../constants";
import { readTrekForm, trekSchema } from "../schemas/trekSchema";
import { getTrekPdfMapPath, saveTrek as saveTrekToDatabase } from "../services/treksRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  missing_link: "The region, a photo or a video no longer exists. Reload the page and try again.",
  not_found: "This trek no longer exists. Go back to Treks and open it again.",
  forbidden: "Your account can't make this change.",
  failed: "The trek couldn't be saved. Nothing was lost on this page: try Save again in a moment.",
} as const;

/**
 * Saves the trek editor. trekId null adds a trek and opens it; otherwise updates it.
 * trekId comes from the browser (bound argument), so it is checked here and access is enforced by RLS.
 */
export const saveTrek = async (trekId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (trekId !== null && !z.uuid().safeParse(trekId).success) return failure(FAILURE_MESSAGES.not_found);

  const parsed = trekSchema.safeParse(readTrekForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const previousPdfMap = trekId ? await getTrekPdfMapPath(trekId) : null;
  const result = await saveTrekToDatabase(parsed.data, trekId);
  if (!result.ok) {
    if (result.reason === "slug_taken") {
      return failure("That web address is already used.", { slug: "Another trek uses this web address. Pick another." });
    }
    return failure(FAILURE_MESSAGES[result.reason]);
  }

  // A replaced or removed printable map is public, so it is deleted once the trek no longer points to it.
  if (previousPdfMap && previousPdfMap !== parsed.data.pdfMapPath) await removeUnusedTrekFile(previousPdfMap);

  refreshWebsite([WEBSITE_CACHE_TAGS.treks]);
  revalidatePath(TREKS_PATH);
  revalidatePath(trekPath(result.trekId));
  if (trekId === null) redirect(`${trekPath(result.trekId)}?added=1`);

  return { status: "saved" };
};
