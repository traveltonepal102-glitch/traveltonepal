"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { LIST_PAGES_ROUTE, pagePath } from "../constants";
import { listPagesSchema, readListPagesForm } from "../schemas/listPagesSchema";
import { saveListPages as saveListPagesToDatabase } from "../services/pagesRepository";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › List pages (Home, Treks, Regions, Travel guides) together. Any admin may (and Row Level Security). */
export const saveListPages = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();

  const parsed = listPagesSchema.safeParse(readListPagesForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const result = await saveListPagesToDatabase(parsed.data);
  if (!result.ok) return failedPageSave(result);

  refreshWebsite([WEBSITE_CACHE_TAGS.pages]);
  revalidatePath(pagePath(LIST_PAGES_ROUTE));
  return { status: "saved" };
};
