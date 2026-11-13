import "server-only";

import { env } from "@/env";
import type { S3Settings } from "@/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { photosPublicBaseUrl } from "./photoOrigins";
import { s3Bucket } from "./s3Bucket";
import { isGpxFile, isPdfFile } from "./trekFileChecks";

/** The public bucket for trek files (supabase/migrations/20261024220000_trek_page_fields.sql). */
const BUCKET = "trek-files";
/** With S3, trek files sit in this public folder of the bucket (served by CloudFront like the photos). */
const S3_FOLDER = "trek-files/";

/** The bucket's own limit (15 MB). */
export const MAX_TREK_FILE_BYTES = 15 * 1024 * 1024;

const PDF_TYPE = "application/pdf";

export type TrekFileKind = "pdfMap" | "gpxTrack";

type TrekFileSpec = {
  /** Where the kind's files sit in the bucket, and the path shape the database accepts. */
  folder: string;
  extension: string;
  path: RegExp;
  contentType: string;
  /** Whether these bytes really are a file of this kind (its content, not its name; trekFileChecks.ts). */
  isValid: (file: Buffer) => boolean;
};

/** The files a trek can offer: the printable map and the GPS track (each kept at <folder>/<uuid>.<extension>). */
export const TREK_FILE_KINDS: Record<TrekFileKind, TrekFileSpec> = {
  pdfMap: {
    folder: "pdf-maps",
    extension: "pdf",
    path: /^pdf-maps\/[0-9a-f-]{36}\.pdf$/,
    contentType: PDF_TYPE,
    isValid: isPdfFile,
  },
  gpxTrack: {
    folder: "gpx-tracks",
    extension: "gpx",
    path: /^gpx-tracks\/[0-9a-f-]{36}\.gpx$/,
    contentType: "application/gpx+xml",
    isValid: isGpxFile,
  },
};

/** A new file's place in the bucket. */
export const newTrekFilePath = (kind: TrekFileKind) => `${TREK_FILE_KINDS[kind].folder}/${crypto.randomUUID()}.${TREK_FILE_KINDS[kind].extension}`;

type TrekFileStorage = {
  /** A one-time link the browser PUTs the file to, for this type and size only. Never exposes keys. */
  createUploadUrl: (path: string, byteSize: number, contentType: string) => Promise<string>;
  download: (path: string) => Promise<Buffer>;
  remove: (path: string) => Promise<void>;
};

/** Where trek files are downloaded from: <base>/<path>. */
export const trekFilesBaseUrl = env.s3 ? `${photosPublicBaseUrl}/${S3_FOLDER.slice(0, -1)}` : `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

/** Where visitors (and the editor's "Open" link) download a trek file. */
export const trekFileUrl = (path: string) => `${trekFilesBaseUrl}/${path}`;

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

/** S3: the bucket's trek-files/ folder; the upload link takes only the type and size asked for. */
const createS3TrekFiles = (settings: S3Settings): TrekFileStorage => {
  const bucket = s3Bucket(settings);
  return {
    createUploadUrl: (path, byteSize, contentType) => bucket.createUploadUrl(`${S3_FOLDER}${path}`, { contentType, byteSize }),
    download: (path) => bucket.download(`${S3_FOLDER}${path}`),
    remove: (path) => bucket.remove([`${S3_FOLDER}${path}`]),
  };
};

/**
 * Trek files (printable maps, GPS tracks, blogs' PDFs): S3 in production, Supabase Storage in development. Files
 * are public once uploaded: a map or a route has nothing private in it.
 */
export const createTrekFileStorage = async (): Promise<TrekFileStorage> => (env.s3 ? createS3TrekFiles(env.s3) : createSupabaseTrekFiles());

/**
 * Keeps an uploaded file only when it really is one of this kind (its content, not its name) within the limit,
 * else removes it. Returns its size in bytes, or null when it was removed.
 */
export const keepIfTrekFile = async (kind: TrekFileKind, path: string): Promise<number | null> => {
  const storage = await createTrekFileStorage();
  const file = await storage.download(path);
  if (file.length <= MAX_TREK_FILE_BYTES && TREK_FILE_KINDS[kind].isValid(file)) return file.length;
  await storage.remove(path);
  return null;
};

/** As keepIfTrekFile for a PDF (a blog's "File to download" too). */
export const keepIfPdf = (path: string) => keepIfTrekFile("pdfMap", path);

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
