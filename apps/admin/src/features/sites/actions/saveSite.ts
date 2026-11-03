"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { sitesSavedPath } from "../constants";
import { editSiteSchema, readEditSiteForm } from "../schemas/editSiteSchema";
import type { SaveSiteFailure } from "../services/sitesRepository";
import { listSites, saveSite as saveSiteToDatabase } from "../services/sitesRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURES: Record<SaveSiteFailure, { message: string; field?: string }> = {
  url_taken: { message: "Another site already uses this address.", field: "url" },
  needs_url: { message: "Add the website's address before switching it live.", field: "url" },
  not_found: { message: "This site no longer exists." },
  forbidden: { message: "Only a Super admin can change a site." },
  failed: { message: "The site couldn't be saved. Nothing was lost in the form: try Save again in a moment." },
};

/** Saves a site's edit form (Super admins only; RLS checks the same), then opens Sites. siteId comes from the browser. */
export const saveSite = async (siteId: string, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return failure(FAILURES.forbidden.message);
  if (!(await listSites()).some((site) => site.id === siteId)) return failure(FAILURES.not_found.message);

  const parsed = editSiteSchema.safeParse(readEditSiteForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveSiteToDatabase(siteId, parsed.data);
  if (!result.ok) {
    const { message, field } = FAILURES[result.reason];
    return failure(message, field ? { [field]: message } : {});
  }

  revalidatePath("/", "layout");
  redirect(sitesSavedPath("changed"));
};
