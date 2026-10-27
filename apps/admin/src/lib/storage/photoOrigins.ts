import "server-only";

import { env } from "@/env";

import { s3BucketOrigin } from "./s3BucketOrigin";

/** Base URL of the public sized photos: <base>/<photo id>/<width>.webp. */
export const photosPublicBaseUrl = env.PHOTOS_PUBLIC_URL ?? `${env.SUPABASE_URL}/storage/v1/object/public/photos`;

/**
 * Other sites the admin page itself must reach, for the Content-Security-Policy: photos are shown from the
 * public photo address, and the browser uploads straight to storage (Supabase Storage or the S3 bucket).
 */
export const PHOTO_ORIGINS = {
  images: [new URL(photosPublicBaseUrl).origin],
  uploads: [env.s3 ? s3BucketOrigin(env.s3.region, env.s3.bucket) : new URL(env.SUPABASE_URL).origin],
};
