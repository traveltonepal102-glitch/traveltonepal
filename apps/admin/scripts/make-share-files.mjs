// One-time: makes the share picture (<photo id>/share.jpg, 1200×630) for library photos uploaded before uploads
// made one. Photos that already have it are skipped, so it is safe to run again.
//
// From apps/admin, with the environment whose storage to fill (S3 when the four S3_ variables are set, else
// Supabase Storage, as in src/lib/storage/createPhotoStorage.ts):
//   node --env-file=.env scripts/make-share-files.mjs
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

const env = process.env;

/** As makeShareImage in src/features/photos/services/processPhoto.ts. */
const makeShareImage = (master) =>
  sharp(master).resize({ width: 1200, height: 630, fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

/** The same files and places as src/lib/storage (s3PhotoStorage.ts, supabasePhotoStorage.ts). */
const s3Storage = () => {
  const s3 = new S3Client({
    region: env.S3_REGION,
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
  const Bucket = env.S3_BUCKET;
  return {
    name: `S3 bucket ${Bucket}`,
    hasPublic: (key) =>
      s3.send(new HeadObjectCommand({ Bucket, Key: key })).then(
        () => true,
        // Without permission to list the bucket, S3 answers 403 (not 404) for a missing file.
        (error) => ([403, 404].includes(error?.$metadata?.httpStatusCode) ? false : Promise.reject(error)),
      ),
    readPrivate: async (key) => Buffer.from(await (await s3.send(new GetObjectCommand({ Bucket, Key: `private/${key}` }))).Body.transformToByteArray()),
    writePublic: (key, body) =>
      s3.send(new PutObjectCommand({ Bucket, Key: key, Body: body, ContentType: "image/jpeg", CacheControl: "public, max-age=31536000, immutable", IfNoneMatch: "*" })),
  };
};

/** Supabase's REST endpoints with the secret key (on Node 20, supabase-js wants a WebSocket it doesn't have). */
const supabaseFetch = async (path, init = {}) => {
  const key = env.SUPABASE_SECRET_KEY;
  return fetch(`${env.SUPABASE_URL}${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, ...init.headers } });
};

const ok = async (response, what) => {
  if (!response.ok) throw new Error(`${what}: ${response.status} ${await response.text()}`);
  return response;
};

const supabaseStorage = () => ({
  name: "Supabase Storage",
  // A missing file answers 400 (not 404).
  hasPublic: async (key) => (await supabaseFetch(`/storage/v1/object/photos/${key}`, { method: "HEAD" })).ok,
  readPrivate: async (key) => Buffer.from(await (await ok(await supabaseFetch(`/storage/v1/object/photo-files/${key}`), `read ${key}`)).arrayBuffer()),
  writePublic: async (key, body) =>
    ok(
      await supabaseFetch(`/storage/v1/object/photos/${key}`, {
        method: "POST",
        body,
        headers: { "Content-Type": "image/jpeg", "Cache-Control": "max-age=31536000", "x-upsert": "false" },
      }),
      `save ${key}`,
    ),
});

const storage = env.S3_BUCKET ? s3Storage() : supabaseStorage();

const photos = await (await ok(await supabaseFetch("/rest/v1/photos?select=id,master_key&order=created_at"), "list photos")).json();
console.log(`${photos.length} photos in the library, storage: ${storage.name}`);

let made = 0;
const failed = [];
for (const photo of photos) {
  const key = `${photo.id}/share.jpg`;
  try {
    if (await storage.hasPublic(key)) continue;
    await storage.writePublic(key, await makeShareImage(await storage.readPrivate(photo.master_key)));
    made += 1;
  } catch (cause) {
    failed.push(photo.id);
    console.error(`${photo.id}: ${cause?.message ?? cause}`);
  }
}

console.log(`Made ${made} share pictures; ${photos.length - made - failed.length} already had one; ${failed.length} failed.`);
if (failed.length) process.exitCode = 1;
