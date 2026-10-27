import "server-only";

import type { S3Settings } from "@/env";

import type { PhotoStorage, StorageArea } from "./photoStorage";
import { s3Bucket } from "./s3Bucket";

/**
 * Where each area lives in the one bucket. CloudFront serves the bucket at PHOTOS_PUBLIC_URL, so the sized
 * photos sit at its root (<photo id>/<width>.webp); the bucket policy denies CloudFront the private/ folder
 * (raw uploads, which may still carry GPS data, and masters), and a lifecycle rule empties private/uploads/
 * after a day.
 */
const FOLDERS: Record<StorageArea, string> = { private: "private/", public: "" };

export const createS3PhotoStorage = (settings: S3Settings): PhotoStorage => {
  const bucket = s3Bucket(settings);
  const inArea = (area: StorageArea, key: string) => `${FOLDERS[area]}${key}`;

  return {
    createUploadUrl: (key, file) => bucket.createUploadUrl(inArea("private", key), file),
    download: (area, key) => bucket.download(inArea(area, key)),
    upload: (area, key, body, contentType) => bucket.upload(inArea(area, key), body, contentType),
    remove: (area, keys) => bucket.remove(keys.map((key) => inArea(area, key))),
  };
};
