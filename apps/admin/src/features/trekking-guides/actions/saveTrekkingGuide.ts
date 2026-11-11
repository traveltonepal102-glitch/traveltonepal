"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { TREKKING_GUIDES_PATH, guidePath } from "../constants";
import { guideSchema, readGuideForm } from "../schemas/guideSchema";
import { saveTrekkingGuide as saveGuideToDatabase } from "../services/guidesRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  not_found: "This guide no longer exists. Close the panel and open the guide again.",
  missing_link: "The photo or one of the regions no longer exists. Reload the page and try again.",
  forbidden: "Your account can't make this change.",
  failed: "The guide couldn't be saved. Nothing was lost in the form: try Save again in a moment.",
} as const;

/**
 * Saves the guide form. guideId null adds a guide to the website `siteId` and opens it; otherwise updates it. Both are
 * bound by the page; the save is refused when "Working on" changed since, and access is enforced by RLS.
 */
export const saveTrekkingGuide = async (siteId: string, guideId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (guideId !== null && !z.uuid().safeParse(guideId).success) return failure(FAILURE_MESSAGES.not_found);
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = guideSchema.safeParse(readGuideForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveGuideToDatabase(parsed.data, guideId, siteId);
  if (!result.ok) return failure(FAILURE_MESSAGES[result.reason]);

  // The guide's website shows them on its treks, About page and travel guides (Travel To Nepal on its regions too).
  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.trekkingGuides]);
  revalidatePath(TREKKING_GUIDES_PATH);
  if (guideId === null) redirect(`${guidePath(result.guideId)}&added=1`);
  return { status: "saved" };
};
