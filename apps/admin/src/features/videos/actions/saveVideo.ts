"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { EditorSaveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import type { FieldErrors } from "@/lib/forms/fieldErrors";
import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { VIDEOS_PATH, videosSavedPath } from "../constants";
import { newVideoSchema, readVideoForm, videoTitleSchema } from "../schemas/videoSchema";
import { saveVideo as saveVideoToDatabase } from "../services/videosRepository";

const failure = (message: string, fieldErrors: FieldErrors = {}): EditorSaveState => ({ status: "error", message, fieldErrors });

const FAILURE_MESSAGES = {
  taken: "This video is already in the library.",
  not_found: "This video no longer exists. Close the panel and open it again.",
  forbidden: "Your account can't make this change.",
  failed: "The video couldn't be saved. Nothing was lost in the form: try Save again in a moment.",
} as const;

/**
 * Saves the video panel (videoId null adds one: link and title; otherwise only the title changes), then closes it.
 * videoId comes from the browser (bound argument), so it is checked here; access is enforced by RLS. The website
 * doesn't show library videos yet, so there is no website cache to refresh.
 */
export const saveVideo = async (videoId: string | null, _previous: EditorSaveState, formData: FormData): Promise<EditorSaveState> => {
  await requireAdmin();
  if (videoId !== null && !z.uuid().safeParse(videoId).success) return failure(FAILURE_MESSAGES.not_found);

  const form = readVideoForm(formData);
  const parsed = videoId === null ? newVideoSchema.safeParse(form) : videoTitleSchema.safeParse(form);
  if (!parsed.success) {
    const fieldErrors = toFieldErrors(parsed.error);
    const count = Object.keys(fieldErrors).length;
    return failure(`${count} field${count === 1 ? " needs" : "s need"} fixing before saving.`, fieldErrors);
  }

  const result = await saveVideoToDatabase(parsed.data, videoId);
  if (!result.ok) return failure(FAILURE_MESSAGES[result.reason], result.reason === "taken" ? { youtubeId: FAILURE_MESSAGES.taken } : {});

  revalidatePath(VIDEOS_PATH);
  redirect(videosSavedPath(videoId === null ? "added" : "changed"));
};
