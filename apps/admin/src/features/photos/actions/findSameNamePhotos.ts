"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

import { PHOTO_LIMITS, SAME_NAME_BATCH } from "../constants";
import { listPhotosNamed } from "../services/photoPickerRepository";

const namesSchema = z.array(z.string().trim().min(1).max(PHOTO_LIMITS.originalName)).max(SAME_NAME_BATCH);

/** Before an upload: the website's photos uploaded from files with the same names, so the editor can ask first. */
export const findSameNamePhotos = async (fileNames: string[]) => {
  await requireAdmin();
  const names = namesSchema.parse(fileNames);
  const site = await getCurrentSite();
  return site ? listPhotosNamed(site.id, names) : [];
};
