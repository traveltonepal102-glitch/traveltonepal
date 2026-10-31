"use server";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { listVideos } from "../services/videosRepository";
import type { LibraryVideo } from "../types";

/** The library videos for a "Choose a video" window (loaded when it opens). */
export const listPickerVideos = async (): Promise<LibraryVideo[]> => {
  await requireAdmin();
  return listVideos();
};
