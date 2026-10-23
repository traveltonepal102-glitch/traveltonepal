"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { PHOTO_LIMITS } from "../constants";
import { importPhoto } from "../services/importPhoto";
import { PhotoRejectedError } from "../services/processPhoto";
import type { Photo } from "../types";

const inputSchema = z.object({
  // Only keys startPhotoUpload hands out: nothing else in storage can be imported or deleted from here.
  uploadKey: z.string().regex(/^uploads\/[0-9a-f-]{36}$/),
  regionId: z.uuid().nullable(),
  originalName: z.string().trim().max(PHOTO_LIMITS.originalName).catch(""),
});

export type FinishPhotoUploadInput = z.input<typeof inputSchema>;

export type FinishPhotoUploadResult = { ok: true; photo: Photo } | { ok: false; message: string };

/** Step 2 of an upload: process the file the browser sent and add it to the photo library. */
export const finishPhotoUpload = async (input: FinishPhotoUploadInput): Promise<FinishPhotoUploadResult> => {
  const admin = await requireAdmin();
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "This upload can't be used. Try adding the photo again." };

  try {
    return { ok: true, photo: await importPhoto({ ...parsed.data, createdBy: admin.id }) };
  } catch (error) {
    if (error instanceof PhotoRejectedError) return { ok: false, message: error.message };
    console.error("finishPhotoUpload failed:", error);
    return { ok: false, message: "The photo couldn't be saved. Try again in a moment." };
  }
};
