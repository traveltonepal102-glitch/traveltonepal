"use server";

import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { checkCurrentSite } from "@/features/sites/lib/checkCurrentSite";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

import { LIST_PAGES_ROUTE, listPagesFor, pagePath } from "../constants";
import { listPagesSchemaFor, readListPagesForm } from "../schemas/listPagesSchema";
import { saveListPages as saveListPagesToDatabase } from "../services/pagesRepository";
import { refreshSitePages } from "./pageSite";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › List pages (Home, Treks, Regions, Travel guides; Home and Travel guides on a region site) of the site it was opened for, together. Any admin may (and Row Level Security). */
export const saveListPages = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  const wrongSite = await checkCurrentSite(siteId);
  if (wrongSite) return wrongSite;

  // checkCurrentSite made sure "Working on" is this site.
  const site = await getCurrentSite();
  const pages = listPagesFor(site?.kind ?? "main");
  const parsed = listPagesSchemaFor(pages).safeParse(readListPagesForm(formData, pages));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const result = await saveListPagesToDatabase(siteId, parsed.data);
  if (!result.ok) return failedPageSave(result);

  refreshSitePages(siteId);
  revalidatePath(pagePath(LIST_PAGES_ROUTE));
  return { status: "saved" };
};
