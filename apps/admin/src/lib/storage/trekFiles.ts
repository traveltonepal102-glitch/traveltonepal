import "server-only";

import { env } from "@/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** The public bucket for trek files (supabase/migrations/20261024220000_trek_page_fields.sql). */
const BUCKET = "trek-files";

/** A printable map's place in the bucket: pdf-maps/<uuid>.pdf. */
export const PDF_MAP_PATH = /^pdf-maps\/[0-9a-f-]{36}\.pdf$/;

/** Where visitors (and the editor's "Open" link) download a trek file. */
export const trekFileUrl = (path: string) => `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

/**
 * Trek files in Supabase Storage, as the signed-in admin (storage policies allow admins only). Files are public
 * once uploaded: a printable map has nothing private in it. Production storage comes with the photos' (S3).
 */
export const createTrekFileStorage = async () => {
  const bucket = (await createSupabaseServerClient()).storage.from(BUCKET);
  return {
    createUploadUrl: async (path: string) => {
      const { data, error } = await bucket.createSignedUploadUrl(path);
      if (error) throw new Error(`Could not create an upload link: ${error.message}`);
      return data.signedUrl;
    },
    download: async (path: string) => {
      const { data, error } = await bucket.download(path);
      if (error) throw new Error(`Could not read ${path}: ${error.message}`);
      return Buffer.from(await data.arrayBuffer());
    },
    remove: async (path: string) => {
      const { error } = await bucket.remove([path]);
      if (error) throw new Error(`Could not delete ${path}: ${error.message}`);
    },
  };
};

/**
 * Deletes a file nothing uses any more (e.g. the printable map a save replaced). It is public, so it should go,
 * but a failure only leaves an unused file behind: it is logged, never shown to the admin.
 */
export const removeUnusedTrekFile = async (path: string) => {
  try {
    await (await createTrekFileStorage()).remove(path);
  } catch (error) {
    console.error("removeUnusedTrekFile failed:", error);
  }
};
