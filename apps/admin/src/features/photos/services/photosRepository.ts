import "server-only";

import { photosPublicBaseUrl } from "@/lib/storage/photoOrigins";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Photo, PhotoText } from "../types";

type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

/** The columns a Photo needs (for embedding in other queries too). */
export const PHOTO_COLUMNS = "id, width, height, variant_widths, file_name, placeholder, place, alt_text, description";

/** A row with PHOTO_COLUMNS, as a query embedding them returns it. */
export type PhotoColumnsRow = Pick<PhotoRow, "id" | "width" | "height" | "variant_widths" | "file_name" | "placeholder" | "place" | "alt_text" | "description">;

export const toPhoto = (row: PhotoColumnsRow): Photo => ({
  id: row.id,
  width: row.width,
  height: row.height,
  baseUrl: `${photosPublicBaseUrl}/${row.id}`,
  variantWidths: row.variant_widths,
  fileName: row.file_name,
  placeholder: row.placeholder,
  place: row.place,
  altText: row.alt_text,
  caption: row.description,
});

type NewPhoto = {
  id: string;
  regionId: string | null;
  masterKey: string;
  variantWidths: number[];
  fileName: string;
  width: number;
  height: number;
  placeholder: string;
  originalName: string;
  byteSize: number;
  createdBy: string;
};

/** Adds a processed photo to the library (RLS: admins only). Throws when the database refuses. */
export const insertPhoto = async (photo: NewPhoto): Promise<Photo> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("photos")
    .insert({
      id: photo.id,
      region_id: photo.regionId,
      master_key: photo.masterKey,
      variant_widths: photo.variantWidths,
      file_name: photo.fileName,
      width: photo.width,
      height: photo.height,
      placeholder: photo.placeholder,
      original_name: photo.originalName,
      byte_size: photo.byteSize,
      created_by: photo.createdBy,
    })
    .select(PHOTO_COLUMNS)
    .single();
  if (error) throw new Error(`Could not add photo ${photo.id}: ${error.code} ${error.message}`);
  return toPhoto(data);
};

/** The region's slug, for naming a photo whose file name says nothing (photoFileNameFrom); null without a region. */
export const findRegionSlug = async (regionId: string | null) => {
  if (!regionId) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("regions").select("slug").eq("id", regionId).maybeSingle();
  if (error) throw new Error(`Could not read region ${regionId}: ${error.message}`);
  return data?.slug ?? null;
};

/** Saves what is typed about a photo (alt text, caption, place). False when no such photo (or RLS refused). */
export const updatePhotoText = async (photoId: string, values: PhotoText): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("photos")
    .update({ alt_text: values.altText, description: values.caption, place: values.place, updated_at: new Date().toISOString() })
    .eq("id", photoId)
    .select("id");
  if (error) throw new Error(`Could not save the text of photo ${photoId}: ${error.code} ${error.message}`);
  return data.length > 0;
};
