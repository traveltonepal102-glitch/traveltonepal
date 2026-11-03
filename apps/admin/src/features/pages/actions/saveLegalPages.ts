"use server";

import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { todayInNepal } from "@/utils/formatDateTime";

import { LEGAL_PAGES, LEGAL_PAGES_ROUTE, pagePath } from "../constants";
import { legalWordsChanged, toLegalValues } from "../lib/pageContent";
import { legalPagesSchema, readLegalPagesForm } from "../schemas/legalPagesSchema";
import { getSitePages, saveLegalPages as saveLegalPagesToDatabase } from "../services/pagesRepository";
import type { LegalPagesValues } from "../types";
import { checkPageSite, refreshSitePages } from "./pageSite";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/**
 * Saves Pages › Legal pages (all four together). A page with "set to today when I publish" gets today's date (Nepal)
 * as "last updated", but only when its words changed: publishing never re-dates a page nobody touched.
 */
export const saveLegalPages = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkPageSite(siteId);
  if (wrongSite) return wrongSite;

  const parsed = legalPagesSchema.safeParse(readLegalPagesForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const saved = await getSitePages(siteId, LEGAL_PAGES.map((page) => page.slug));
  const today = todayInNepal();
  const withDate = (slug: keyof LegalPagesValues) => {
    const page = parsed.data[slug];
    const before = saved.find((item) => item.slug === slug);
    const isChanged = !before || legalWordsChanged(toLegalValues(before), page);
    return page.autoDate && isChanged ? { ...page, lastUpdated: today } : page;
  };
  const pages: LegalPagesValues = { terms: withDate("terms"), privacy: withDate("privacy"), impressum: withDate("impressum"), cookies: withDate("cookies") };

  const result = await saveLegalPagesToDatabase(siteId, pages);
  if (!result.ok) return failedPageSave(result);

  refreshSitePages(siteId);
  revalidatePath(pagePath(LEGAL_PAGES_ROUTE));
  return { status: "saved" };
};
