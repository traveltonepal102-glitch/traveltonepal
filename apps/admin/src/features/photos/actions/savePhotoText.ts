"use server";

import { WEBSITE_CACHE_TAG_VALUES } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { photoTextSchema, readPhotoTextForm } from "../schemas/photoTextSchema";
import { updatePhotoText } from "../services/photosRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

/**
 * Saves a photo's alt text, caption and place (Photos screen, "Choose a photo" window). photoId comes from the browser
 * (bound argument), so it is checked; access is enforced by RLS. A photo can show on any page of any website, so
 * every website refreshes everything.
 */
export const savePhotoText = async (photoId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (!z.uuid().safeParse(photoId).success) return failure("This photo no longer exists.");

  const parsed = photoTextSchema.safeParse(readPhotoTextForm(formData));
  if (!parsed.success) return failure("Some text is too long. Shorten the marked fields, then save again.", toFieldErrors(parsed.error));

  try {
    if (!(await updatePhotoText(photoId, parsed.data))) return failure("This photo no longer exists, or your account can't change it.");
  } catch (error) {
    console.error(error);
    return failure("The text couldn't be saved. Nothing was lost in the form: try Save again in a moment.");
  }

  refreshWebsite(WEBSITE_CACHE_TAG_VALUES);
  revalidatePath(ADMIN_SECTIONS.photos.href, "layout");
  return { status: "saved" };
};
