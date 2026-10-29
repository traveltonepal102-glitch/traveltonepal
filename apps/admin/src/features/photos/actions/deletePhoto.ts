"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { createPhotoStorage } from "@/lib/storage/createPhotoStorage";

import { deleteUnusedPhotoRow, PhotoInUseError } from "../services/photoLibraryRepository";

/**
 * Deletes a library photo nothing uses, for good: its row, then its files (the sizes, the share picture and the private master).
 * Super admins only: checked here for the message, and enforced by the database. photoId comes from the browser.
 * Nothing on the website shows an unused photo, so there is no website cache to refresh.
 */
export const deletePhoto = async (photoId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can delete a photo." };
  if (!z.uuid().safeParse(photoId).success) return { error: "This photo no longer exists." };

  try {
    const files = await deleteUnusedPhotoRow(photoId);
    if (files) {
      const storage = await createPhotoStorage();
      // The row is gone, so the photo is deleted: a file left behind is only logged (nothing links to it).
      const removed = await Promise.allSettled([storage.remove("public", files.publicKeys), storage.remove("private", [files.masterKey])]);
      for (const result of removed) if (result.status === "rejected") console.error(`Photo ${photoId}: a file couldn't be deleted:`, result.reason);
    }
  } catch (error) {
    if (error instanceof PhotoInUseError) return { error: "This photo is still used. Take it off what uses it first." };
    console.error(error);
    return { error: "The photo couldn't be deleted. Try again in a moment." };
  }

  revalidatePath(ADMIN_SECTIONS.photos.href);
  return { error: null };
};
