import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { PhotoStorage, StorageArea } from "./photoStorage";

/** Buckets made by supabase/migrations/20261023160000_photos.sql. */
const BUCKETS: Record<StorageArea, string> = { private: "photo-files", public: "photos" };

/** Sized files never change (a new photo gets a new id), so browsers and CDNs may keep them a year. */
const ONE_YEAR_SECONDS = "31536000";

/**
 * Development storage: Supabase Storage, as the signed-in admin (storage policies allow admins only).
 * No secret key is involved.
 */
export const createSupabasePhotoStorage = async (): Promise<PhotoStorage> => {
  const supabase = await createSupabaseServerClient();
  const bucket = (area: StorageArea) => supabase.storage.from(BUCKETS[area]);

  return {
    createUploadUrl: async (key) => {
      const { data, error } = await bucket("private").createSignedUploadUrl(key);
      if (error) throw new Error(`Could not create an upload link: ${error.message}`);
      return data.signedUrl;
    },
    download: async (area, key) => {
      const { data, error } = await bucket(area).download(key);
      if (error) throw new Error(`Could not read ${key}: ${error.message}`);
      return Buffer.from(await data.arrayBuffer());
    },
    upload: async (area, key, body, contentType) => {
      const { error } = await bucket(area).upload(key, body, { contentType, cacheControl: ONE_YEAR_SECONDS, upsert: false });
      if (error) throw new Error(`Could not save ${key}: ${error.message}`);
    },
    remove: async (area, keys) => {
      if (!keys.length) return;
      const { error } = await bucket(area).remove(keys);
      if (error) throw new Error(`Could not delete ${keys.join(", ")}: ${error.message}`);
    },
  };
};
