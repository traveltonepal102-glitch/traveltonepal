"use server";

import { GUIDE_FILE_PATH, MAX_GUIDE_FILE_BYTES, guideFileFormatOf } from "@ttn/config/guideFiles";
import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { isGuideFileOf } from "@/lib/storage/guideFileChecks";
import { createTrekFileStorage, keepIfValid } from "@/lib/storage/trekFiles";

import { guideFilePath } from "../lib/guideFilePath";

export type GuideFileUploadStart = { ok: true; path: string; uploadUrl: string } | { ok: false; message: string };
export type GuideFileUploadFinish = { ok: true; path: string; byteSize: number } | { ok: false; message: string };

const WRONG_TYPE = "This kind of file can't be added. Use a PDF, Word, Excel, PowerPoint, text, photo, audio or ZIP/RAR/7Z file.";

/**
 * Step 1 of "File to download": a one-time link for the browser to send the file straight to storage, signed for
 * the type its ending stands for (@ttn/config/guideFiles), never one the browser names. Step 2 is finishGuideFileUpload.
 */
export const startGuideFileUpload = async (fileName: string, byteSize: number): Promise<GuideFileUploadStart> => {
  await requireAdmin();
  const name = z.string().catch("").parse(fileName);
  const format = guideFileFormatOf(name);
  if (!format) return { ok: false, message: WRONG_TYPE };
  if (!z.number().int().positive().max(MAX_GUIDE_FILE_BYTES).safeParse(byteSize).success) return { ok: false, message: "Use a file of up to 15 MB." };

  const path = guideFilePath(crypto.randomUUID(), name, format.extension);
  try {
    return { ok: true, path, uploadUrl: await (await createTrekFileStorage()).createUploadUrl(path, byteSize, format.contentType) };
  } catch (error) {
    console.error("startGuideFileUpload failed:", error);
    return { ok: false, message: "Uploads aren't working right now. Try again in a moment." };
  }
};

/**
 * Step 2: checks the uploaded file really is what its ending says (its content, not just its name; an SVG with
 * scripts is refused), or removes it. Only addresses step 1 hands out are accepted. The guide keeps the file once
 * it is saved.
 */
export const finishGuideFileUpload = async (path: string): Promise<GuideFileUploadFinish> => {
  await requireAdmin();
  const format = typeof path === "string" && GUIDE_FILE_PATH.test(path) ? guideFileFormatOf(path) : undefined;
  if (!format) return { ok: false, message: "This upload can't be used. Try adding the file again." };

  try {
    const byteSize = await keepIfValid(path, (file) => isGuideFileOf(format, file));
    if (byteSize === null) {
      const svgNote = format.extension === "svg" ? " An SVG must be a plain drawing, without scripts." : "";
      return { ok: false, message: `That file isn't a real ${format.label} file.${svgNote} Save it again in that format and try again.` };
    }
    return { ok: true, path, byteSize };
  } catch (error) {
    console.error("finishGuideFileUpload failed:", error);
    return { ok: false, message: "The file couldn't be saved. Try again in a moment." };
  }
};
