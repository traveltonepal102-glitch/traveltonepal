"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";
import { todayInNepal } from "@/utils/formatDateTime";

import { LEGAL_PAGES, LEGAL_PAGES_ROUTE, pagePath } from "../constants";
import { legalWordsChanged, toLegalValues } from "../lib/pageContent";
import { legalPagesSchema, readLegalPagesForm } from "../schemas/legalPagesSchema";
import { getSitePages, saveLegalPages as saveLegalPagesToDatabase } from "../services/pagesRepository";
import type { LegalPagesValues } from "../types";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/**
 * Saves Pages › Legal pages (all four together). A page with "set to today when I publish" gets today's date (Nepal)
 * as "last updated", but only when its words changed: publishing never re-dates a page nobody touched.
 */
export const saveLegalPages = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();

  const parsed = legalPagesSchema.safeParse(readLegalPagesForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const saved = await getSitePages(LEGAL_PAGES.map((page) => page.slug));
  const today = todayInNepal();
  const withDate = (slug: keyof LegalPagesValues) => {
    const page = parsed.data[slug];
    const before = saved.find((item) => item.slug === slug);
    const isChanged = !before || legalWordsChanged(toLegalValues(before), page);
    return page.autoDate && isChanged ? { ...page, lastUpdated: today } : page;
  };
  const pages: LegalPagesValues = { terms: withDate("terms"), privacy: withDate("privacy"), impressum: withDate("impressum"), cookies: withDate("cookies") };

  const result = await saveLegalPagesToDatabase(pages);
  if (!result.ok) return failedPageSave(result);

  refreshWebsite([WEBSITE_CACHE_TAGS.pages]);
  revalidatePath(pagePath(LEGAL_PAGES_ROUTE));
  return { status: "saved" };
};
