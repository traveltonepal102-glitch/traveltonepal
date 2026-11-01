"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { PHOTO_LIMITS, SAME_NAME_BATCH } from "../constants";
import { listPhotosNamed } from "../services/photoPickerRepository";

const namesSchema = z.array(z.string().trim().min(1).max(PHOTO_LIMITS.originalName)).max(SAME_NAME_BATCH);

/** Before an upload: the library photos uploaded from files with the same names, so the editor can ask first. */
export const findSameNamePhotos = async (fileNames: string[]) => {
  await requireAdmin();
  return listPhotosNamed(namesSchema.parse(fileNames));
};
