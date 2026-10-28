"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { ADVENTURES_PATH, adventuresSavedPath } from "../constants";
import { removeAdventure as removeAdventureFromDatabase } from "../services/adventuresRepository";

/**
 * Removes an adventure for good, then closes the panel (switching "Show on website" off hides it instead). Super
 * admins only: checked here for the message, and enforced by RLS. adventureId comes from the browser, so it is checked.
 */
export const removeAdventure = async (adventureId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove an adventure." };
  if (!z.uuid().safeParse(adventureId).success) return { error: "This adventure no longer exists." };

  try {
    if (!(await removeAdventureFromDatabase(adventureId))) return { error: "This adventure no longer exists, or your account can't remove it." };
  } catch (error) {
    console.error(error);
    return { error: "The adventure couldn't be removed. Try again in a moment." };
  }

  refreshWebsite([WEBSITE_CACHE_TAGS.adventures]);
  revalidatePath(ADVENTURES_PATH);
  redirect(adventuresSavedPath("removed"));
};
