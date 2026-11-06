"use server";

import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";

import { pagePath } from "../constants";
import { aboutContentOf } from "../lib/aboutContent";
import { aboutPageSchema, readAboutForm } from "../schemas/aboutPageSchema";
import { saveSitePage } from "../services/pagesRepository";
import { refreshSitePages } from "./pageSite";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › About of the site it was opened for (siteId, bound by the page). Any admin may (checked here and by Row Level Security). */
export const saveAboutPage = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = aboutPageSchema.safeParse(readAboutForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const values = parsed.data;
  const result = await saveSitePage(siteId, "about", { ...values, content: aboutContentOf(values) });
  if (!result.ok) return failedPageSave(result);

  // The About page, and the founder, his short story and the promises on every trek page.
  refreshSitePages(siteId);
  revalidatePath(pagePath("about"));
  return { status: "saved" };
};
