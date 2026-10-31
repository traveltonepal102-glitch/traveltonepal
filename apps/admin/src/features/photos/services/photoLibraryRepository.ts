import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { publicPhotoKeys } from "../lib/photoFileKeys";
import { PHOTO_USE_KINDS } from "../types";
import type { LibraryPhoto, PhotoUse, PhotoUseKind } from "../types";
import { PHOTO_COLUMNS, toPhoto } from "./photosRepository";

const isUseKind = (value: string): value is PhotoUseKind => (PHOTO_USE_KINDS as readonly string[]).includes(value);

/** Every library photo with its sizes ready, newest first (RLS: admins only). Throws when the database can't be read. */
export const listAllPhotos = async (): Promise<LibraryPhoto[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("photos")
    .select(`${PHOTO_COLUMNS}, original_name, byte_size, created_at`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load the photo library: ${error.message}`);
  return data
    .filter((row) => row.variant_widths.length > 0)
    .map((row) => ({ ...toPhoto(row), originalName: row.original_name, byteSize: row.byte_size, createdAt: row.created_at }));
};

/** Where photos are used (public.photo_uses): every photo's, or one photo's. Throws when the database can't be read. */
export const listPhotoUses = async (photoId?: string): Promise<PhotoUse[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("photo_uses", photoId ? { p_photo_id: photoId } : {});
  if (error) throw new Error(`Could not find where photos are used: ${error.message}`);
  return data.flatMap((row) =>
    isUseKind(row.kind) ? [{ photoId: row.photo_id, kind: row.kind, itemId: row.item_id, itemLabel: row.item_label, detail: row.detail }] : [],
  );
};

export class PhotoInUseError extends Error {}

/**
 * Deletes the photo's row if nothing uses it (public.delete_unused_photo: Super admins only) and returns its
 * files to remove from storage; null when it was already gone. Throws PhotoInUseError while it is used.
 */
export const deleteUnusedPhotoRow = async (photoId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("delete_unused_photo", { p_photo_id: photoId });
  if (error?.hint === "photo_in_use" || error?.code === "23503") throw new PhotoInUseError("This photo is still used.");
  if (error) throw new Error(`Could not delete photo ${photoId}: ${error.code} ${error.message}`);
  const [row] = data;
  return row ? { masterKey: row.master_key, publicKeys: publicPhotoKeys(photoId, row.file_name, row.variant_widths) } : null;
};
