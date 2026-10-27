import "server-only";

import { env } from "@/env";

import type { PhotoStorage } from "./photoStorage";
import { createS3PhotoStorage } from "./s3PhotoStorage";
import { createSupabasePhotoStorage } from "./supabasePhotoStorage";

/** S3 when its settings are filled in (production), else Supabase Storage (development). */
export const createPhotoStorage = async (): Promise<PhotoStorage> =>
  env.s3 ? createS3PhotoStorage(env.s3) : createSupabasePhotoStorage();
