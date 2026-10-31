"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { RemoveState } from "@/components/editor/types";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { VIDEOS_PATH } from "../constants";
import { deleteUnusedVideo, VideoInUseError } from "../services/videosRepository";

/**
 * Deletes a library video nothing uses (nothing is on YouTube's side to remove). Super admins only: checked here for
 * the message, and enforced by the database. videoId comes from the browser, so it is checked.
 */
export const deleteVideo = async (videoId: string): Promise<RemoveState> => {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") return { error: "Only a Super admin can delete a video." };
  if (!z.uuid().safeParse(videoId).success) return { error: "This video no longer exists." };

  try {
    await deleteUnusedVideo(videoId);
  } catch (error) {
    if (error instanceof VideoInUseError) return { error: "This video is still used. Take it off what uses it first." };
    console.error(error);
    return { error: "The video couldn't be deleted. Try again in a moment." };
  }

  revalidatePath(VIDEOS_PATH);
  return { error: null };
};
