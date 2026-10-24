"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { TREKKING_GUIDES_PATH } from "../constants";
import { removeTrekkingGuide as removeGuideFromDatabase } from "../services/guidesRepository";

/**
 * Removes a guide for good (it also leaves every trek it was on), then closes the panel. Super admins only:
 * checked here for the message, and enforced by RLS. guideId comes from the browser, so it is checked.
 */
export const removeTrekkingGuide = async (guideId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove a guide." };
  if (!z.uuid().safeParse(guideId).success) return { error: "This guide no longer exists." };

  try {
    const result = await removeGuideFromDatabase(guideId);
    if (result === "in_use") return { error: "This guide is also an author, checks a travel guide, or is shown in one. Change that there first." };
    if (result === "not_removed") return { error: "This guide no longer exists, or your account can't remove it." };
  } catch (error) {
    console.error(error);
    return { error: "The guide couldn't be removed. Try again in a moment." };
  }

  revalidatePath(TREKKING_GUIDES_PATH);
  redirect(TREKKING_GUIDES_PATH);
};
