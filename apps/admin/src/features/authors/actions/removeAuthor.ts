"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

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
    if (!(await removeAuthorFromDatabase(authorId))) return { error: "This author no longer exists, or your account can't remove them." };
  } catch (error) {
    console.error(error);
    return { error: "The author couldn't be removed. Try again in a moment." };
  }

  revalidatePath(AUTHORS_PATH);
  redirect(AUTHORS_PATH);
};
