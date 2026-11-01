"use server";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

import { pickerSearchSchema } from "../lib/pickerSearch";
import type { PickerSearch } from "../lib/pickerSearch";
import { searchLibraryPhotos } from "../services/photoPickerRepository";

/** A page of library photos for the "Choose a photo" window: search words, a filter, "Load more". */
export const searchPickerPhotos = async (input: PickerSearch) => {
  await requireAdmin();
  return searchLibraryPhotos(pickerSearchSchema.parse(input));
};
