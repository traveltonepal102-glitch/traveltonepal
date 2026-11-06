"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { invalidPageForm, pageSaveFailure } from "@/features/pages/actions/pageSaveResult";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { REGION_HOME_PATH } from "../constants";
import { homePageSchema, readHomePageForm } from "../schemas/homePageSchema";
import { saveRegionHome as saveRegionHomeToDatabase } from "../services/regionHomeRepository";

const FAILURE_MESSAGES = {
  forbidden: "You can't change this page. Ask a Super admin.",
  missing: "The main trek or a photo no longer exists. Reload the page and pick it again.",
  failed: "The page couldn't be saved. Nothing was lost on this page: try Publish again in a moment.",
} as const;

/**
 * Saves a region website's Home (its main trek, the top of the page and the Google result) for the site it was
 * opened for. Any admin may; the database checks the website is a region website and the trek is one of its own.
 */
export const saveRegionHome = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = homePageSchema.safeParse(readHomePageForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const { homeTrekId, photoAlt, buttonLabel, secondLabel, ...top } = parsed.data;
  const result = await saveRegionHomeToDatabase(siteId, { ...top, content: { photoAlt, buttonLabel, secondLabel } }, homeTrekId);
  if (!result.ok) return pageSaveFailure(FAILURE_MESSAGES[result.reason]);

  // The main trek decides which trek shows at "/" and which address redirects there.
  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.pages, WEBSITE_CACHE_TAGS.treks]);
  revalidatePath(REGION_HOME_PATH);
  return { status: "saved" };
};
