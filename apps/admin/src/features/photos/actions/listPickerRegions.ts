"use server";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { listPhotoRegions } from "../services/photoPickerRepository";

/** The regions the "Choose a photo" window can filter by. */
export const listPickerRegions = async () => {
  await requireAdmin();
  return listPhotoRegions();
};
