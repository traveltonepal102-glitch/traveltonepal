import "server-only";

import { photosPublicBaseUrl } from "@/lib/storage/photoOrigins";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Photo } from "../types";

type PhotoRow = Database["public"]["Tables"]["photos"]["Row"];

/** The columns a Photo needs (for embedding in other queries too). */
export const PHOTO_COLUMNS = "id, width, height, variant_widths, placeholder, place";

export const toPhoto = (row: Pick<PhotoRow, "id" | "width" | "height" | "variant_widths" | "placeholder" | "place">): Photo => ({
  id: row.id,
  width: row.width,
  height: row.height,
  baseUrl: `${photosPublicBaseUrl}/${row.id}`,
  variantWidths: row.variant_widths,
  placeholder: row.placeholder,
  place: row.place,
});

type NewPhoto = {
  id: string;
  regionId: string | null;
  masterKey: string;
  variantWidths: number[];
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
