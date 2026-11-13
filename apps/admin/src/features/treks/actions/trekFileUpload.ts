"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { MAX_TREK_FILE_BYTES, TREK_FILE_KINDS, createTrekFileStorage, keepIfTrekFile, newTrekFilePath, trekFileUrl } from "@/lib/storage/trekFiles";
import type { TrekFileKind } from "@/lib/storage/trekFiles";

export type TrekFileUploadStart = { ok: true; path: string; uploadUrl: string } | { ok: false; message: string };
export type TrekFileUploadFinish = { ok: true; path: string; url: string } | { ok: false; message: string };

const WORDS: Record<TrekFileKind, { name: string; again: string }> = {
  pdfMap: { name: "PDF", again: "Save the map as a PDF and try again." },
  gpxTrack: { name: "GPX file", again: "Export the route as GPX (from Gaia, Komoot, Garmin…) and try again." },
};

const kindSchema = z.enum(["pdfMap", "gpxTrack"]);
const sizeSchema = z.number().int().positive().max(MAX_TREK_FILE_BYTES);

/** Step 1: a one-time link for the browser to send the file straight to storage. Step 2 is finishTrekFileUpload. */
export const startTrekFileUpload = async (kind: TrekFileKind, byteSize: number): Promise<TrekFileUploadStart> => {
  await requireAdmin();
  if (!kindSchema.safeParse(kind).success) return { ok: false, message: "This upload can't be used." };
  if (!sizeSchema.safeParse(byteSize).success) return { ok: false, message: `Use a ${WORDS[kind].name} of up to 15 MB.` };

  const path = newTrekFilePath(kind);
  try {
    return { ok: true, path, uploadUrl: await (await createTrekFileStorage()).createUploadUrl(path, byteSize, TREK_FILE_KINDS[kind].contentType) };
  } catch (error) {
    console.error("startTrekFileUpload failed:", error);
    return { ok: false, message: "Uploads aren't working right now. Try again in a moment." };
  }
};

/**
 * Step 2: checks the uploaded file really is one of this kind (its content, not just its name), or removes it.
 * Only paths step 1 hands out are accepted. The trek keeps the file once the trek is saved.
 */
export const finishTrekFileUpload = async (kind: TrekFileKind, path: string): Promise<TrekFileUploadFinish> => {
  await requireAdmin();
  if (!kindSchema.safeParse(kind).success || !TREK_FILE_KINDS[kind].path.test(path)) return { ok: false, message: "This upload can't be used. Try adding the file again." };

  try {
    if ((await keepIfTrekFile(kind, path)) === null) return { ok: false, message: `That file isn't a ${WORDS[kind].name}. ${WORDS[kind].again}` };
    return { ok: true, path, url: trekFileUrl(path) };
  } catch (error) {
    console.error("finishTrekFileUpload failed:", error);
    return { ok: false, message: `The ${WORDS[kind].name} couldn't be saved. Try again in a moment.` };
  }
};
