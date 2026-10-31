"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { VIDEOS_PATH } from "../constants";
import { newVideoSchema } from "../schemas/videoSchema";
import { getVideoByYoutubeId, saveVideo } from "../services/videosRepository";
import type { LibraryVideo, NewVideoValues } from "../types";

export type AddVideoResult = { ok: true; video: LibraryVideo } | { ok: false; message: string; fieldErrors: FieldErrors };

/**
 * Adds a video to the library from a "Choose a video" window (an editor's form is still open, so this isn't a form
 * submit) and returns it to be chosen. A link already in the library returns that video. Checked here; RLS applies.
 */
export const addVideo = async (input: NewVideoValues): Promise<AddVideoResult> => {
  await requireAdmin();
  const parsed = newVideoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Check the link and the title.", fieldErrors: toFieldErrors(parsed.error) };

  try {
    const result = await saveVideo(parsed.data, null);
    if (!result.ok && result.reason !== "taken") {
      return { ok: false, message: result.reason === "forbidden" ? "Your account can't add videos." : "The video couldn't be added. Try again in a moment.", fieldErrors: {} };
    }
    const video = await getVideoByYoutubeId(parsed.data.youtubeId);
    if (!video) return { ok: false, message: "The video couldn't be added. Try again in a moment.", fieldErrors: {} };
    revalidatePath(VIDEOS_PATH);
    return { ok: true, video };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "The video couldn't be added. Try again in a moment.", fieldErrors: {} };
  }
};
