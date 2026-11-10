"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { refreshSiteWebsite } from "@/lib/website/refreshWebsite";

import { TRAVEL_GUIDES_PATH } from "../constants";
import { deleteArticle as deleteArticleFromDatabase } from "../services/articlesRepository";
import { listGuideFilePaths, removeUnusedGuideFiles } from "../services/guideFilesRepository";

const FAILURE_MESSAGES = {
  forbidden: "Only a Super admin can delete a travel guide.",
  gone: "This travel guide no longer exists, or your account can't delete it.",
  failed: "The travel guide couldn't be deleted. Try again in a moment.",
} as const;

/**
 * Deletes a travel guide of the website `siteId` for good, with the PDFs only it offered, then opens Travel guides.
 * Super admins only: checked here for the message, and enforced by RLS. Both ids come from the browser, so they are
 * checked.
 */
export const deleteArticle = async (siteId: string, articleId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: FAILURE_MESSAGES.forbidden };
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite?.status === "error") return { error: wrongSite.message };
  if (!z.uuid().safeParse(articleId).success) return { error: FAILURE_MESSAGES.gone };

  try {
    // Read before deleting: the sections that name the files go with the guide.
    const files = await listGuideFilePaths(articleId);
    if (!(await deleteArticleFromDatabase(articleId, siteId))) return { error: FAILURE_MESSAGES.gone };
    await removeUnusedGuideFiles(files);
  } catch (error) {
    console.error(error);
    return { error: FAILURE_MESSAGES.failed };
  }

  // Its page, the lists, region pages and treks that link guides (travel-guides), and its own JSON-LD blocks.
  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.travelGuides, WEBSITE_CACHE_TAGS.structuredData]);
  revalidatePath(TRAVEL_GUIDES_PATH, "layout");
  redirect(TRAVEL_GUIDES_PATH);
};
