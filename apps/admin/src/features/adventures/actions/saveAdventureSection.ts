"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { ADVENTURES_PATH } from "../constants";
import { adventureSectionSchema, readSectionForm } from "../schemas/adventureSchema";
import { saveAdventureSection as saveSectionToDatabase } from "../services/adventuresRepository";

/**
 * Saves the section's own words on the home page of the website `siteId` (heading, last card, "How it works", note). The
 * website is bound by the page; the save is refused when "Working on" changed since.
 */
export const saveAdventureSection = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;
  const parsed = adventureSectionSchema.safeParse(readSectionForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return { status: "error", message: `${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors };
  }

  if (!(await saveSectionToDatabase(parsed.data, siteId))) {
    return { status: "error", message: "The section couldn't be saved. Nothing was lost in the form: try Save again in a moment.", fieldErrors: {} };
  }

  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.adventures]);
  revalidatePath(ADVENTURES_PATH);
  return { status: "saved" };
};
