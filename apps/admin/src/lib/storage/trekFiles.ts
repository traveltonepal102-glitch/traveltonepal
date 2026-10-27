import "server-only";

import { env } from "@/env";
import type { S3Settings } from "@/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { photosPublicBaseUrl } from "./photoOrigins";
import { s3Bucket } from "./s3Bucket";

/** The public bucket for trek files (supabase/migrations/20261024220000_trek_page_fields.sql). */
const BUCKET = "trek-files";
/** With S3, trek files sit in this public folder of the bucket (served by CloudFront like the photos). */
const S3_FOLDER = "trek-files/";

/** A printable map's place in the bucket: pdf-maps/<uuid>.pdf. */
export const PDF_MAP_PATH = /^pdf-maps\/[0-9a-f-]{36}\.pdf$/;

const PDF_TYPE = "application/pdf";

type TrekFileStorage = {
  /** A one-time link the browser PUTs the PDF to. Never exposes keys. */
  createUploadUrl: (path: string, byteSize: number) => Promise<string>;
  download: (path: string) => Promise<Buffer>;
  remove: (path: string) => Promise<void>;
};

/** Where visitors (and the editor's "Open" link) download a trek file. */
export const trekFileUrl = (path: string) =>
  env.s3 ? `${photosPublicBaseUrl}/${S3_FOLDER}${path}` : `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

/** Supabase Storage, as the signed-in admin (storage policies allow admins only). */
const createSupabaseTrekFiles = async (): Promise<TrekFileStorage> => {
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

/** S3: the bucket's trek-files/ folder; the upload link takes only a PDF of the size asked for. */
const createS3TrekFiles = (settings: S3Settings): TrekFileStorage => {
  const bucket = s3Bucket(settings);
  return {
    createUploadUrl: (path, byteSize) => bucket.createUploadUrl(`${S3_FOLDER}${path}`, { contentType: PDF_TYPE, byteSize }),
    download: (path) => bucket.download(`${S3_FOLDER}${path}`),
    remove: (path) => bucket.remove([`${S3_FOLDER}${path}`]),
  };
};

/**
 * Trek files (printable maps): S3 in production, Supabase Storage in development. Files are public once
 * uploaded: a printable map has nothing private in it.
 */
export const createTrekFileStorage = async (): Promise<TrekFileStorage> => (env.s3 ? createS3TrekFiles(env.s3) : createSupabaseTrekFiles());

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
