"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { pagePath } from "../constants";
import { contactContentOf } from "../lib/pageContent";
import { contactPageSchema, readContactForm } from "../schemas/contactPageSchema";
import { saveSitePage } from "../services/pagesRepository";
import { failedPageSave, invalidPageForm } from "./pageSaveResult";

/** Saves Pages › Contact. Any admin may (checked here and by Row Level Security). */
export const saveContactPage = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();

  const parsed = contactPageSchema.safeParse(readContactForm(formData));
  if (!parsed.success) return invalidPageForm(parsed.error);

  const values = parsed.data;
  const result = await saveSitePage("contact", { ...values, content: contactContentOf(values) });
  if (!result.ok) return failedPageSave(result);

  refreshWebsite([WEBSITE_CACHE_TAGS.pages]);
  revalidatePath(pagePath("contact"));
  return { status: "saved" };
};
