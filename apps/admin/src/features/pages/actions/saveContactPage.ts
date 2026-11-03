"use server";

import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { pagePath } from "../constants";
import { contactContentOf } from "../lib/pageContent";
import { contactPageSchema, readContactForm } from "../schemas/contactPageSchema";
import { saveSitePage } from "../services/pagesRepository";
import { checkPageSite, refreshSitePages } from "./pageSite";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › Contact of the site it was opened for (siteId, bound by the page). Any admin may (checked here and by Row Level Security). */
export const saveContactPage = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkPageSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = contactPageSchema.safeParse(readContactForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const values = parsed.data;
  const result = await saveSitePage(siteId, "contact", { ...values, content: contactContentOf(values) });
  if (!result.ok) return failedPageSave(result);

  refreshSitePages(siteId);
  revalidatePath(pagePath("contact"));
  return { status: "saved" };
};
