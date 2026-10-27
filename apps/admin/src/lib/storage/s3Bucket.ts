import "server-only";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type { S3Settings } from "@/env";

import type { UploadFile } from "./photoStorage";

/** As long as Supabase's signed upload links last. */
const UPLOAD_LINK_SECONDS = 2 * 60 * 60;

/** Stored files never change (a new upload gets a new key), so browsers and CloudFront may keep them a year. */
const CACHE_FOREVER = "public, max-age=31536000, immutable";

let client: S3Client | undefined;

/**
 * One client per server process. Checksums only when S3 requires one: by default the SDK puts the checksum of
 * an empty body into upload links, and every browser upload to them fails.
 */
const getClient = ({ region, credentials }: S3Settings) =>
  (client ??= new S3Client({ region, credentials, requestChecksumCalculation: "WHEN_REQUIRED" }));

/** The S3 bucket, with the four things the admin does with stored files (keys are full paths in it). */
export const s3Bucket = (settings: S3Settings) => {
  const s3 = getClient(settings);
  const { bucket } = settings;

  return {
    /**
     * A one-time PUT link for exactly this file: S3 refuses a different size or type, so the checks made when
     * the link was asked for hold.
     */
    createUploadUrl: (key: string, { contentType, byteSize }: UploadFile) =>
      getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ContentLength: byteSize }), {
        expiresIn: UPLOAD_LINK_SECONDS,
        signableHeaders: new Set(["content-type"]),
      }),
    download: async (key: string) => {
      const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      if (!Body) throw new Error(`Could not read ${key}: empty answer from S3`);
      return Buffer.from(await Body.transformToByteArray());
    },
    /** Never replaces a file (If-None-Match), like Supabase's upsert: false. */
    upload: async (key: string, body: Buffer, contentType: string) => {
      await s3.send(
        new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType, CacheControl: CACHE_FOREVER, IfNoneMatch: "*" }),
      );
    },
    remove: async (keys: string[]) => {
      await Promise.all(keys.map((key) => s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))));
    },
  };
};
