import { PHOTO_FILE_NAME_MAX_LENGTH } from "@ttn/ui/lib/photos";

import { slugify } from "@/utils/slugify";

/** Words cameras and phones put in file names ("IMG_2345.jpg", "WhatsApp Image 2026-…"): they say nothing about the photo. */
const CAMERA_WORDS = new Set(["img", "image", "images", "dsc", "dscn", "dscf", "pxl", "mvimg", "gopr", "dji", "photo", "photos", "pic", "pics", "picture", "screenshot", "screen", "shot", "whatsapp", "untitled", "unnamed", "download", "copy", "edited", "scaled", "final", "jpeg", "jpg"]);

/** A word that tells what the photo shows: three or more letters only ("images3" is a counter), not a camera's word. */
const isDescriptive = (word: string) => /^[a-z]{3,}$/.test(word) && !CAMERA_WORDS.has(word);

/**
 * The file name a new photo gets, for its web address (Google reads it as a light hint of what the photo shows):
 * the uploaded file's name as a slug ("Tilicho Lake (Annapurna).JPG" → "tilicho-lake-annapurna"). A camera name like
 * "IMG_2345.jpg" says nothing, so `fallback` is used instead (the region's slug, else "nepal").
 */
export const photoFileNameFrom = (originalName: string, fallback: string) => {
  const name = slugify(originalName.replace(/\.[a-z0-9]{2,5}$/i, ""))
    .slice(0, PHOTO_FILE_NAME_MAX_LENGTH)
    .replace(/-+$/, "");
  return name.split("-").some(isDescriptive) ? name : fallback;
};
