"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { createPhotoStorage } from "@/lib/storage/createPhotoStorage";

import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_BYTES } from "../constants";

const inputSchema = z.object({
  contentType: z.string().refine((type) => ACCEPTED_PHOTO_TYPES.includes(type)),
  byteSize: z.number().int().positive().max(MAX_PHOTO_BYTES),
});

export type StartPhotoUploadInput = z.input<typeof inputSchema>;

export type StartPhotoUploadResult = { ok: true; uploadKey: string; uploadUrl: string } | { ok: false; message: string };

/**
 * Step 1 of an upload: a one-time link for the browser to send the file straight to storage (large files
 * never pass through this server). Step 2 is finishPhotoUpload.
 */
export const startPhotoUpload = async (input: StartPhotoUploadInput): Promise<StartPhotoUploadResult> => {
  await requireAdmin();
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Use a JPEG, PNG or WebP photo of up to 20 MB." };
  }

  const uploadKey = `uploads/${crypto.randomUUID()}`;
  try {
    const storage = await createPhotoStorage();
    // With S3 the link takes only this type and size, so the checks above hold for what arrives.
    return { ok: true, uploadKey, uploadUrl: await storage.createUploadUrl(uploadKey, parsed.data) };
  } catch (error) {
    console.error("startPhotoUpload failed:", error);
    return { ok: false, message: "Photo uploads aren't working right now. Try again in a moment." };
  }
};
