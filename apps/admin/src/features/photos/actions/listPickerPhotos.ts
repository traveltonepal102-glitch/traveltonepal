"use server";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { listLibraryPhotos } from "../services/photosRepository";
import type { Photo } from "../types";

/** The library photos for a "Choose a photo" window opened from a text editor (loaded when it opens). */
export const listPickerPhotos = async (): Promise<Photo[]> => {
  await requireAdmin();
  return listLibraryPhotos();
};
