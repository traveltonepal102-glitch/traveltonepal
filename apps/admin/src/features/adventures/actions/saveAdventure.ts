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

import { ADVENTURES_PATH, adventuresSavedPath } from "../constants";
import { adventureSchema, readAdventureForm } from "../schemas/adventureSchema";
import { saveAdventure as saveAdventureToDatabase } from "../services/adventuresRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  missing_photo: "The photo is no longer in the library. Choose another one.",
  not_found: "This adventure no longer exists. Close the panel and open it again.",
  forbidden: "Your account can't make this change.",
  failed: "The adventure couldn't be saved. Nothing was lost in the form: try Save again in a moment.",
} as const;

/**
 * Saves the adventure form (adventureId null adds one), then closes the panel and the list says so. adventureId
 * comes from the browser (bound argument), so it is checked here; access is enforced by RLS.
 */
export const saveAdventure = async (adventureId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (adventureId !== null && !z.uuid().safeParse(adventureId).success) return failure(FAILURE_MESSAGES.not_found);

  const parsed = adventureSchema.safeParse(readAdventureForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveAdventureToDatabase(parsed.data, adventureId);
  if (!result.ok) return failure(FAILURE_MESSAGES[result.reason], result.reason === "missing_photo" ? { photoId: "Choose another photo." } : {});

  refreshWebsite([WEBSITE_CACHE_TAGS.adventures]);
  revalidatePath(ADVENTURES_PATH);
  redirect(adventuresSavedPath(adventureId === null ? "added" : "changed"));
};
