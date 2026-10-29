"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { STRUCTURED_DATA_PATH, pageSchemasPath } from "../constants";
import { toPageRef } from "../lib/pageRef";
import { pageSchemasSchema, readPageSchemasForm } from "../schemas/pageSchemasSchema";
import { savePageSchemas as savePageSchemasToDatabase } from "../services/structuredDataRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  forbidden: "Only a Super admin can change structured data.",
  not_found: "This page no longer exists. Go back to Structured data and open it again.",
  failed: "The structured data couldn't be saved. Nothing was lost on this page: try Save again in a moment.",
} as const;

/**
 * Saves one page's JSON-LD blocks. The page (kind, key) comes from the browser (bound arguments), so it is checked
 * here. Only a Super admin may save (checked here and by Row Level Security).
 */
export const savePageSchemas = async (kind: string, key: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return failure(FAILURE_MESSAGES.forbidden);
  const page = toPageRef(kind, key);
  if (!page) return failure(FAILURE_MESSAGES.not_found);

  const parsed = pageSchemasSchema.safeParse(readPageSchemasForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} schema field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await savePageSchemasToDatabase(page, parsed.data.schemas);
  if (!result.ok) return failure(FAILURE_MESSAGES[result.reason]);

  refreshWebsite([WEBSITE_CACHE_TAGS.structuredData]);
  revalidatePath(STRUCTURED_DATA_PATH);
  revalidatePath(pageSchemasPath(page));
  return { status: "saved" };
};
