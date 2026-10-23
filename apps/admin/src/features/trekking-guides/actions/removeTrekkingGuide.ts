"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { TREKKING_GUIDES_PATH } from "../constants";
import { removeTrekkingGuide as removeGuideFromDatabase } from "../services/guidesRepository";

export type RemoveGuideState = { error: string | null };

/**
 * Removes a guide for good (it also leaves every trek it was on), then closes the panel. Super admins only:
 * checked here for the message, and enforced by RLS. guideId comes from the browser, so it is checked.
 */
export const removeTrekkingGuide = async (guideId: string): Promise<RemoveGuideState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove a guide." };
  if (!z.uuid().safeParse(guideId).success) return { error: "This guide no longer exists." };

  try {
    if (!(await removeGuideFromDatabase(guideId))) return { error: "This guide no longer exists, or your account can't remove it." };
  } catch (error) {
    console.error(error);
    return { error: "The guide couldn't be removed. Try again in a moment." };
  }

  revalidatePath(TREKKING_GUIDES_PATH);
  redirect(TREKKING_GUIDES_PATH);
};
