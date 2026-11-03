"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { sitesSavedPath } from "../constants";
import { newSiteSchema, readNewSiteForm } from "../schemas/newSiteSchema";
import type { AddSiteFailure } from "../services/sitesRepository";
import { addSite as addSiteToDatabase } from "../services/sitesRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURES: Record<AddSiteFailure, { message: string; field?: string }> = {
  id_taken: { message: "Another site already has this site id.", field: "id" },
  region_taken: { message: "This region already has a website.", field: "regionId" },
  url_taken: { message: "Another site already uses this address.", field: "url" },
  missing_region: { message: "This region no longer exists. Pick another one.", field: "regionId" },
  forbidden: { message: "Only a Super admin can add a site." },
  not_set_up: { message: "Sites aren't set up in the database yet. Apply the sites migration (supabase db push), then add the site again." },
  failed: { message: "The site couldn't be added. Nothing was lost in the form: try again in a moment." },
};

/** Adds a region site from the "Add a site" form (Super admins only; RLS checks the same), then opens Sites. */
export const addSite = async (_previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return failure(FAILURES.forbidden.message);

  const parsed = newSiteSchema.safeParse(readNewSiteForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before adding the site.`, fieldErrors);
  }

  const result = await addSiteToDatabase(parsed.data);
  if (!result.ok) {
    const { message, field } = FAILURES[result.reason];
    return failure(message, field ? { [field]: message } : {});
  }

  // The switcher in every screen's sidebar lists the new site.
  revalidatePath("/", "layout");
  redirect(sitesSavedPath("added"));
};
