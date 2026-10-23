import "server-only";

import { env } from "@/env";

/** Base URL of the public sized photos: <base>/<photo id>/<width>.webp. */
export const photosPublicBaseUrl = env.PHOTOS_PUBLIC_URL ?? `${env.SUPABASE_URL}/storage/v1/object/public/photos`;

/**
 * Other sites the admin page itself must reach, for the Content-Security-Policy: photos are shown from the
 * public photo address, and the browser uploads straight to storage (Supabase now, the S3 bucket later).
 */
export const PHOTO_ORIGINS = {
  images: [new URL(photosPublicBaseUrl).origin],
  uploads: [new URL(env.SUPABASE_URL).origin],
};
