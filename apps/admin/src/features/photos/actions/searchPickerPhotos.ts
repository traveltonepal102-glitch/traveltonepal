"use server";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { getCurrentSite } from "@/features/sites/lib/currentSite";

import { pickerSearchSchema } from "../lib/pickerSearch";
import type { PickerSearch } from "../lib/pickerSearch";
import { searchLibraryPhotos } from "../services/photoPickerRepository";

/**
 * A page of library photos for the "Choose a photo" window: search words, a filter, "Load more". Only the photos of the
 * website "Working on" shows: another website's photos can't be picked.
 */
export const searchPickerPhotos = async (input: PickerSearch) => {
  await requireAdmin();
  const search = pickerSearchSchema.parse(input);
  const site = await getCurrentSite();
  if (!site) return { photos: [], hasMore: false };
  return searchLibraryPhotos(site.id, search);
};
