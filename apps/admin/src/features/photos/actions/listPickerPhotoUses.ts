"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { photoUseLabel } from "../lib/photoUseLinks";
import { listPhotoUses } from "../services/photoLibraryRepository";

/** Where a photo is used, worded for the window's large preview ("Mardi Himal Trek · Day 3"). */
export const listPickerPhotoUses = async (photoId: string) => {
  await requireAdmin();
  const uses = await listPhotoUses(z.uuid().parse(photoId));
  return uses.map(photoUseLabel);
};
