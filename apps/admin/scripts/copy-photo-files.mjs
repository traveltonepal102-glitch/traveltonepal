// Gives each photo copy its own files: when photos became per website (supabase/migrations/20261111110000_photos_per_site.sql),
// a photo Travel To Nepal and a region website both used got a copy for the region website, a new library entry whose
// files are still missing. For each row of photo_file_copies this copies the source photo's sizes, share picture and
// master to the copy's addresses (<copy id>/<file name>-<width>.webp, <copy id>/share.jpg, private/masters/<copy id>.jpg),
// then removes the row. Safe to run again: only copies still listed are done.
//
// From apps/admin, with the environment whose storage to fill (S3 when the four S3_ variables are set, else
// Supabase Storage, as in src/lib/storage/createPhotoStorage.ts); --dry-run only lists them:
//   node --env-file=.env scripts/copy-photo-files.mjs --dry-run
//   node --env-file=.env scripts/copy-photo-files.mjs
import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";

const env = process.env;
const isDryRun = process.argv.includes("--dry-run");

/** As photoVariantFile in packages/ui/src/lib/photos.ts and SHARE_IMAGE_FILE. */
const variantFile = (fileName, width) => (fileName ? `${fileName}-${width}.webp` : `${width}.webp`);
const SHARE_FILE = "share.jpg";

/** The same files and places as src/lib/storage (s3PhotoStorage.ts: private/ in the one bucket; supabasePhotoStorage.ts). */
const s3Storage = () => {
  const s3 = new S3Client({
    region: env.S3_REGION,
    credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
  const Bucket = env.S3_BUCKET;
  const folder = { public: "", private: "private/" };
  return {
    name: `S3 bucket ${Bucket}`,
    // Keeps the file's type and its "cache a year" header.
    copy: (area, from, to) =>
      s3.send(new CopyObjectCommand({ Bucket, CopySource: `${Bucket}/${folder[area]}${from}`, Key: `${folder[area]}${to}`, MetadataDirective: "COPY" })),
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

const supabaseStorage = () => {
  const buckets = { public: "photos", private: "photo-files" };
  return {
    name: "Supabase Storage",
    copy: async (area, from, to) =>
      ok(
        await supabaseFetch("/storage/v1/object/copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bucketId: buckets[area], sourceKey: from, destinationKey: to }),
        }),
        `copy ${from}`,
      ),
  };
};

const storage = env.S3_BUCKET ? s3Storage() : supabaseStorage();

const copies = await (
  await ok(
    await supabaseFetch(
      "/rest/v1/photo_file_copies?select=photo_id,copy:photos!photo_file_copies_photo_id_fkey(master_key,file_name,variant_widths),source:photos!photo_file_copies_source_id_fkey(id,master_key,file_name)&order=created_at",
    ),
    "list the photo copies",
  )
).json();
console.log(`${copies.length} photo copies without their files, storage: ${storage.name}${isDryRun ? " (dry run: nothing changes)" : ""}`);

let done = 0;
const failed = [];
for (const { photo_id: copyId, copy, source } of copies) {
  if (isDryRun) {
    console.log(`${source.id} → ${copyId}  (${copy.variant_widths.length} sizes, share picture, master)`);
    continue;
  }
  try {
    for (const width of copy.variant_widths) {
      await storage.copy("public", `${source.id}/${variantFile(source.file_name, width)}`, `${copyId}/${variantFile(copy.file_name, width)}`);
    }
    await storage.copy("private", source.master_key, copy.master_key);
    // Photos from before share pictures may lack one (scripts/make-share-files.mjs makes it): not a reason to stop.
    await storage.copy("public", `${source.id}/${SHARE_FILE}`, `${copyId}/${SHARE_FILE}`).catch((cause) => console.warn(`${copyId}: no share picture copied (${cause?.message ?? cause})`));
    // Only once every file is copied: until then the copy stays listed, and running again finishes it.
    await ok(await supabaseFetch(`/rest/v1/photo_file_copies?photo_id=eq.${copyId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } }), `mark ${copyId} done`);
    done += 1;
  } catch (cause) {
    failed.push(copyId);
    console.error(`${copyId}: ${cause?.message ?? cause}`);
  }
}

if (!isDryRun) console.log(`Copied the files of ${done} photos; ${failed.length} failed.`);
if (failed.length) process.exitCode = 1;
