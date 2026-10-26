"use server";

import { WEBSITE_CACHE_TAGS } from "@ttn/config/websiteCache";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { refreshWebsite } from "@/lib/website/refreshWebsite";

import { AUTHORS_PATH } from "../constants";
import { removeAuthor as removeAuthorFromDatabase } from "../services/authorsRepository";

/**
 * Removes an author for good, then closes the panel. Super admins only: checked here for the message, and
 * enforced by RLS. authorId comes from the browser, so it is checked.
 */
export const removeAuthor = async (authorId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can remove an author." };
  if (!z.uuid().safeParse(authorId).success) return { error: "This author no longer exists." };

  try {
    const result = await removeAuthorFromDatabase(authorId);
    if (result === "has_articles") return { error: "This author wrote travel guides. Pick another author on those guides first." };
    if (result === "not_removed") return { error: "This author no longer exists, or your account can't remove them." };
  } catch (error) {
    console.error(error);
    return { error: "The author couldn't be removed. Try again in a moment." };
  }

  // Authors show in travel guide bylines, and on the About page (team, founder) and trek pages (founder).
  refreshWebsite([WEBSITE_CACHE_TAGS.travelGuides, WEBSITE_CACHE_TAGS.pages]);
  revalidatePath(AUTHORS_PATH);
  redirect(AUTHORS_PATH);
};
