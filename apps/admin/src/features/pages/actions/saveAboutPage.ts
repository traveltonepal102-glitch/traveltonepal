"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { pagePath } from "../constants";
import { aboutContentOf } from "../lib/pageContent";
import { aboutPageSchema, readAboutForm } from "../schemas/aboutPageSchema";
import { saveSitePage } from "../services/pagesRepository";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › About. Any admin may (checked here and by Row Level Security). */
export const saveAboutPage = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();

  const parsed = aboutPageSchema.safeParse(readAboutForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const values = parsed.data;
  const result = await saveSitePage("about", { ...values, content: aboutContentOf(values) });
  if (!result.ok) return failedPageSave(result);

  // The About page, and the founder and promises on every trek page.
  refreshWebsite([WEBSITE_CACHE_TAGS.pages]);
  revalidatePath(pagePath("about"));
  return { status: "saved" };
};
