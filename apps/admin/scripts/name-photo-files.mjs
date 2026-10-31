// One-time: gives library photos uploaded before photos had a file name their named files, for Google
// (<photo id>/<width>.webp → <photo id>/<file name>-<width>.webp, the name made from the uploaded file's name), and
// saves the name in photos.file_name, so the website and the admin use the new addresses. The old files stay:
// pages built before, and photos put into texts before, still point at them (deleting the photo removes both).
// Photos that already have a name are skipped, so it is safe to run again.
//
// From apps/admin, with the environment whose storage to fill (S3 when the four S3_ variables are set, else
// Supabase Storage, as in src/lib/storage/createPhotoStorage.ts); --dry-run only lists the names:
//   node --env-file=.env scripts/name-photo-files.mjs --dry-run
//   node --env-file=.env scripts/name-photo-files.mjs
import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";

const env = process.env;
const isDryRun = process.argv.includes("--dry-run");

/** As photoFileNameFrom in src/features/photos/lib/photoFileName.ts (and slugify in src/utils/slugify.ts). */
const CAMERA_WORDS = new Set(["img", "image", "images", "dsc", "dscn", "dscf", "pxl", "mvimg", "gopr", "dji", "photo", "photos", "pic", "pics", "picture", "screenshot", "screen", "shot", "whatsapp", "untitled", "unnamed", "download", "copy", "edited", "scaled", "final", "jpeg", "jpg"]);
const fileNameFrom = (originalName, fallback) => {
  const name = originalName
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
  return name.split("-").some((word) => /^[a-z]{3,}$/.test(word) && !CAMERA_WORDS.has(word)) ? name : fallback;
};

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
    // Keeps the file's type and its "cache a year" header.
    copyPublic: (from, to) => s3.send(new CopyObjectCommand({ Bucket, CopySource: `${Bucket}/${from}`, Key: to, MetadataDirective: "COPY" })),
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
  copyPublic: async (from, to) =>
    ok(
      await supabaseFetch("/storage/v1/object/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucketId: "photos", sourceKey: from, destinationKey: to }),
      }),
      `copy ${from}`,
    ),
});

const storage = env.S3_BUCKET ? s3Storage() : supabaseStorage();

const photos = await (
  await ok(await supabaseFetch("/rest/v1/photos?select=id,original_name,variant_widths,region:regions!photos_region_id_fkey(slug)&file_name=is.null&order=created_at"), "list photos")
).json();
console.log(`${photos.length} photos without a file name, storage: ${storage.name}${isDryRun ? " (dry run: nothing changes)" : ""}`);

let named = 0;
const failed = [];
for (const photo of photos) {
  const fileName = fileNameFrom(photo.original_name, photo.region?.slug ?? "nepal");
  if (isDryRun) {
    console.log(`${photo.id}  ${photo.original_name || "(no name)"} → ${fileName}`);
    continue;
  }
  try {
    for (const width of photo.variant_widths) await storage.copyPublic(`${photo.id}/${width}.webp`, `${photo.id}/${fileName}-${width}.webp`);
    // Only once every size is copied: until then the photo keeps its old addresses.
    await ok(
      await supabaseFetch(`/rest/v1/photos?id=eq.${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ file_name: fileName }),
      }),
      `save the name of ${photo.id}`,
    );
    named += 1;
  } catch (cause) {
    failed.push(photo.id);
    console.error(`${photo.id}: ${cause?.message ?? cause}`);
  }
}

if (!isDryRun) console.log(`Named ${named} photos; ${failed.length} failed.`);
if (failed.length) process.exitCode = 1;
