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

import { TRAVEL_GUIDES_PATH, articlePath } from "../constants";
import { articleSchema, readArticleForm } from "../schemas/articleSchema";
import type { SaveArticleResult } from "../services/articlesRepository";
import { saveArticle as saveArticleToDatabase } from "../services/articlesRepository";
import { listGuideFilePaths, removeUnusedGuideFiles } from "../services/guideFilesRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

type FailureReason = Extract<SaveArticleResult, { ok: false }>["reason"];

/** What each failed save says, and on which field. */
const FAILURES: Record<FailureReason, { message: string; field?: [string, string] }> = {
  slug_taken: { message: "That web address is already used.", field: ["slug", "Another travel guide on this website uses this web address. Pick another."] },
  author_language: { message: "That author doesn't write in English.", field: ["authorId", "Pick an author who writes in English, or add English in Authors."] },
  checker_not_allowed: { message: "That guide can't check travel guides.", field: ["checkerGuideId", "Pick a guide who can check travel guides."] },
  guest_needs_checker: {
    message: "A guest writer's guide needs a local guide's check before it can be published.",
    field: ["checkerGuideId", "Pick the trekking guide who checked it."],
  },
  date_needed: { message: "Pick the date it goes live.", field: ["publishedOn", "Pick the date it goes live."] },
  section_guide_not_agreed: { message: "A guide in the article body hasn't agreed to be shown. Tick their consent in Trekking guides, or pick another guide." },
  missing_link: { message: "The photo, a video, a trek, a region or a person no longer exists. Reload the page and try again." },
  not_found: { message: "This travel guide no longer exists. Go back to Travel guides and open it again." },
  forbidden: { message: "Your account can't make this change." },
  failed: { message: "The travel guide couldn't be saved. Nothing was lost on this page: try Save again in a moment." },
};

/**
 * Saves the travel guide editor. articleId null adds a guide to the website `siteId` and opens it; otherwise updates
 * it (a guide stays on its website). Both are bound by the page; the save is refused when "Working on" changed since,
 * and access is enforced by RLS.
 */
export const saveArticle = async (siteId: string, articleId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (articleId !== null && !z.uuid().safeParse(articleId).success) return failure(FAILURES.not_found.message);
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = articleSchema.safeParse(readArticleForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const previousFiles = articleId ? await listGuideFilePaths(articleId) : [];
  const result = await saveArticleToDatabase(parsed.data, articleId, siteId);
  if (!result.ok) {
    const { message, field } = FAILURES[result.reason];
    return failure(message, field ? { [field[0]]: field[1] } : {});
  }

  // A removed or replaced "File to download" PDF is public, so it is deleted once no guide uses it.
  const keptFiles = new Set(parsed.data.sections.flatMap((section) => (section.type === "file" ? [section.path] : [])));
  await removeUnusedGuideFiles(previousFiles.filter((path) => !keptFiles.has(path)));

  refreshSiteWebsite(siteId, [WEBSITE_CACHE_TAGS.travelGuides]);
  revalidatePath(TRAVEL_GUIDES_PATH, "layout");
  if (articleId === null) redirect(`${articlePath(result.articleId)}?added=1`);
  return { status: "saved" };
};
