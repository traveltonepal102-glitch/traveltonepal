import type { NamedPhoto } from "../types";

/** File names compared as people see them: spaces around and letter case don't count ("IMG_1.JPG" = "img_1.jpg"). */
export const fileNameKey = (name: string) => name.trim().toLowerCase();

/** The newest library photo uploaded from a file with this name, if any (`photos` newest first). */
export const findSameName = (fileName: string, photos: readonly NamedPhoto[]) =>
  photos.find((photo) => fileNameKey(photo.originalName) === fileNameKey(fileName)) ?? null;
