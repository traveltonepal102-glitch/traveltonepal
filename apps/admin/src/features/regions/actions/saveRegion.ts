"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { REGIONS_PATH, regionPath } from "../constants";
import { readRegionForm, regionSchema } from "../schemas/regionSchema";
import { saveRegion as saveRegionToDatabase } from "../services/regionsRepository";

export type SaveRegionState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; message: string; fieldErrors: FieldErrors };

const failure = (message: string, fieldErrors: FieldErrors = {}): SaveRegionState => ({
  status: "error",
  message,
  fieldErrors,
});

const FAILURE_MESSAGES = {
  not_found: "This region no longer exists. Go back to Regions and open it again.",
  photo_missing: "One of the photos no longer exists. Reload the page and try again.",
  forbidden: "Your account can't make this change. Only a Super admin can add a region.",
  failed: "The region couldn't be saved. Nothing was lost on this page: try Save again in a moment.",
} as const;

/**
 * Saves the region editor. regionId null adds a region and opens it; otherwise updates it.
 * regionId comes from the browser (bound argument), so it is checked here and access is enforced by RLS.
 */
export const saveRegion = async (
  regionId: string | null,
  _previous: SaveRegionState,
  formData: FormData,
): Promise<SaveRegionState> => {
  const admin = await requireAdmin();
  if (regionId === null && admin.role !== "super_admin") return failure(FAILURE_MESSAGES.forbidden);
  if (regionId !== null && !z.uuid().safeParse(regionId).success) return failure(FAILURE_MESSAGES.not_found);

  const parsed = regionSchema.safeParse(readRegionForm(formData));
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveRegionToDatabase(parsed.data, regionId);
  if (!result.ok) {
    if (result.reason === "slug_taken") {
      return failure("That web address is already used.", { slug: "Another region uses this web address. Pick another." });
    }
    return failure(FAILURE_MESSAGES[result.reason]);
  }

  revalidatePath(REGIONS_PATH);
  revalidatePath(regionPath(result.regionId));
  if (regionId === null) redirect(`${regionPath(result.regionId)}?added=1`);

  return { status: "saved" };
};
