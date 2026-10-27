/**
 * Where photo files live. The admin talks to storage only through this, so development (Supabase Storage)
 * and production (S3 + CloudFront) differ only in configuration.
 *
 * - "private": raw uploads (uploads/…, may still carry GPS data) and cleaned masters (masters/…).
 * - "public": the sized WebP files (<photo id>/<width>.webp), served to visitors.
 */
export type StorageArea = "private" | "public";

/** The file the browser is about to upload, as already checked by the server. */
export type UploadFile = { contentType: string; byteSize: number };

export type PhotoStorage = {
  /** A one-time link the browser PUTs this one file to, in the private area. Never exposes keys. */
  createUploadUrl: (key: string, file: UploadFile) => Promise<string>;
  download: (area: StorageArea, key: string) => Promise<Buffer>;
  upload: (area: StorageArea, key: string, body: Buffer, contentType: string) => Promise<void>;
  remove: (area: StorageArea, keys: string[]) => Promise<void>;
};
