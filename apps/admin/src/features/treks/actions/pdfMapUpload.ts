"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { PDF_MAP_PATH, createTrekFileStorage, trekFileUrl } from "@/lib/storage/trekFiles";

/** The bucket's own limit (15 MB). */
const MAX_PDF_BYTES = 15 * 1024 * 1024;

export type PdfUploadStart = { ok: true; path: string; uploadUrl: string } | { ok: false; message: string };
export type PdfUploadFinish = { ok: true; path: string; url: string } | { ok: false; message: string };

/** Step 1: a one-time link for the browser to send the PDF straight to storage. Step 2 is finishPdfMapUpload. */
export const startPdfMapUpload = async (byteSize: number): Promise<PdfUploadStart> => {
  await requireAdmin();
  if (!z.number().int().positive().max(MAX_PDF_BYTES).safeParse(byteSize).success) return { ok: false, message: "Use a PDF of up to 15 MB." };

  const path = `pdf-maps/${crypto.randomUUID()}.pdf`;
  try {
    return { ok: true, path, uploadUrl: await (await createTrekFileStorage()).createUploadUrl(path, byteSize) };
  } catch (error) {
    console.error("startPdfMapUpload failed:", error);
    return { ok: false, message: "Uploads aren't working right now. Try again in a moment." };
  }
};

/**
 * Step 2: checks the uploaded file really is a PDF (its first bytes, not just its name), or removes it.
 * Only paths step 1 hands out are accepted. The trek keeps the map once the trek is saved.
 */
export const finishPdfMapUpload = async (path: string): Promise<PdfUploadFinish> => {
  await requireAdmin();
  if (!PDF_MAP_PATH.test(path)) return { ok: false, message: "This upload can't be used. Try adding the PDF again." };

  try {
    const storage = await createTrekFileStorage();
    const file = await storage.download(path);
    if (file.length > MAX_PDF_BYTES || !file.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      await storage.remove(path);
      return { ok: false, message: "That file isn't a PDF. Save the map as a PDF and try again." };
    }
    return { ok: true, path, url: trekFileUrl(path) };
  } catch (error) {
    console.error("finishPdfMapUpload failed:", error);
    return { ok: false, message: "The PDF couldn't be saved. Try again in a moment." };
  }
};
