"use server";

import { GUIDE_FILE_PATH, MAX_GUIDE_FILE_BYTES } from "@ttn/config/guideFiles";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { createTrekFileStorage, keepIfPdf } from "@/lib/storage/trekFiles";

import { guideFilePath } from "../lib/guideFilePath";

export type GuideFileUploadStart = { ok: true; path: string; uploadUrl: string } | { ok: false; message: string };
export type GuideFileUploadFinish = { ok: true; path: string; byteSize: number } | { ok: false; message: string };

/** Step 1 of "File to download": a one-time link for the browser to send the PDF straight to storage. Step 2 is finishGuideFileUpload. */
export const startGuideFileUpload = async (fileName: string, byteSize: number): Promise<GuideFileUploadStart> => {
  await requireAdmin();
  if (!z.number().int().positive().max(MAX_GUIDE_FILE_BYTES).safeParse(byteSize).success) return { ok: false, message: "Use a PDF of up to 15 MB." };

  const path = guideFilePath(crypto.randomUUID(), z.string().catch("").parse(fileName));
  try {
    return { ok: true, path, uploadUrl: await (await createTrekFileStorage()).createUploadUrl(path, byteSize) };
  } catch (error) {
    console.error("startGuideFileUpload failed:", error);
    return { ok: false, message: "Uploads aren't working right now. Try again in a moment." };
  }
};

/**
 * Step 2: checks the uploaded file really is a PDF (its first bytes, not just its name), or removes it.
 * Only addresses step 1 hands out are accepted. The guide keeps the file once it is saved.
 */
export const finishGuideFileUpload = async (path: string): Promise<GuideFileUploadFinish> => {
  await requireAdmin();
  if (typeof path !== "string" || !GUIDE_FILE_PATH.test(path)) return { ok: false, message: "This upload can't be used. Try adding the PDF again." };

  try {
    const byteSize = await keepIfPdf(path);
    if (byteSize === null) return { ok: false, message: "That file isn't a PDF. Save it as a PDF and try again." };
    return { ok: true, path, byteSize };
  } catch (error) {
    console.error("finishGuideFileUpload failed:", error);
    return { ok: false, message: "The PDF couldn't be saved. Try again in a moment." };
  }
};
