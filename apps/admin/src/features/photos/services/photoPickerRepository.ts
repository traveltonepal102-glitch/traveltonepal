import "server-only";

import { z } from "zod";

import { REGION_LOCALE } from "@/features/regions/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PICKER_PAGE_SIZE, toPage } from "../lib/pickerSearch";
import type { PickerSearch } from "../lib/pickerSearch";
import type { NamedPhoto, Photo, PickerPhoto } from "../types";
import { PHOTO_COLUMNS, toPhoto } from "./photosRepository";

/** One page of the "Choose a photo" window: the website's photos only (public.search_library_photos). Throws when the database can't be read. */
export const searchLibraryPhotos = async (siteId: string, { query, filter, offset }: PickerSearch): Promise<{ photos: PickerPhoto[]; hasMore: boolean }> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_library_photos", {
    p_site_id: siteId,
    p_query: query,
    ...(filter.kind === "region" && { p_region_id: filter.id }),
    ...(filter.kind === "trek" && { p_trek_id: filter.id }),
    p_limit: PICKER_PAGE_SIZE + 1,
    p_offset: offset,
  });
  if (error) throw new Error(`Could not search the photo library: ${error.message}`);
  const page = toPage(data);
  return {
    photos: page.rows.map((row) => ({ ...toPhoto(row), originalName: row.original_name, useCount: row.use_count })),
    hasMore: page.hasMore,
  };
};

/** The website's photos uploaded from a file with one of these names (public.photos_named), newest first. */
export const listPhotosNamed = async (siteId: string, names: string[]): Promise<NamedPhoto[]> => {
  if (!names.length) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("photos_named", { p_names: names, p_site_id: siteId });
  if (error) throw new Error(`Could not look for photos with the same name: ${error.message}`);
  return data.map((row) => ({ ...toPhoto(row), originalName: row.original_name }));
};

/** These library photos (an editor's chosen ones), in no particular order; anything that isn't a photo id is skipped. */
export const listPhotosByIds = async (ids: string[]): Promise<Photo[]> => {
  const photoIds = [...new Set(ids.filter((id) => z.uuid().safeParse(id).success))];
  if (!photoIds.length) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("photos").select(PHOTO_COLUMNS).in("id", photoIds);
  if (error) throw new Error(`Could not load photos: ${error.message}`);
  return data.map(toPhoto);
};

/** Every region A–Z, for the window's filter. */
export const listPhotoRegions = async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("regions").select("id, region_translations!inner(name)").eq("region_translations.locale", REGION_LOCALE);
  if (error) throw new Error(`Could not load regions: ${error.message}`);
  return data.map((region) => ({ id: region.id, name: region.region_translations[0]?.name ?? "" })).sort((a, b) => a.name.localeCompare(b.name));
};
