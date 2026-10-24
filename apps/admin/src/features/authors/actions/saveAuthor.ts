"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { AUTHORS_PATH, authorPath } from "../constants";
import { authorSchema, readAuthorForm } from "../schemas/authorSchema";
import { saveAuthor as saveAuthorToDatabase } from "../services/authorsRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  not_found: "This author no longer exists. Close the panel and open the author again.",
  missing_link: "The photo or the trekking guide no longer exists. Reload the page and try again.",
  forbidden: "Your account can't make this change.",
  failed: "The author couldn't be saved. Nothing was lost in the form: try Save again in a moment.",
} as const;

/**
 * Saves the author form. authorId null adds an author and opens them; otherwise updates them.
 * authorId comes from the browser (bound argument), so it is checked here; access is enforced by RLS.
 */
export const saveAuthor = async (authorId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (authorId !== null && !z.uuid().safeParse(authorId).success) return failure(FAILURE_MESSAGES.not_found);

  const parsed = authorSchema.safeParse(readAuthorForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveAuthorToDatabase(parsed.data, authorId);
  if (!result.ok) {
    if (result.reason === "guide_taken") return failure("That guide is already an author.", { guideId: "This trekking guide already has an author profile." });
    if (result.reason === "guide_not_agreed") {
      return failure("That guide hasn't agreed to be shown yet.", { guideId: "Tick their consent in Trekking guides first." });
    }
    return failure(FAILURE_MESSAGES[result.reason]);
  }

  revalidatePath(AUTHORS_PATH);
  if (authorId === null) redirect(`${authorPath(result.authorId)}&added=1`);
  return { status: "saved" };
};
