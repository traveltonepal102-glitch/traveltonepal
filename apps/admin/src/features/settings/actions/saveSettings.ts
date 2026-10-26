"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { SETTINGS_PATH } from "../constants";
import { readSettingsForm, settingsSchema } from "../schemas/settingsSchema";
import { saveSiteSettings } from "../services/settingsRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  forbidden: "Only a Super admin can change the site settings.",
  missing_photo: "A photo no longer exists. Reload the page and pick it again.",
  failed: "The settings couldn't be saved. Nothing was lost on this page: try Save again in a moment.",
} as const;

/** Saves Site settings. Only a Super admin may (checked here and by Row Level Security). */
export const saveSettings = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return failure(FAILURE_MESSAGES.forbidden);

  const parsed = settingsSchema.safeParse(readSettingsForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveSiteSettings(parsed.data);
  if (!result.ok) return failure(FAILURE_MESSAGES[result.reason]);

  // Every page shows the contact details, so the whole website refreshes.
  refreshWebsite([WEBSITE_CACHE_TAGS.settings]);
  revalidatePath(SETTINGS_PATH);
  return { status: "saved" };
};
