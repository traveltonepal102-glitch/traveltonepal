/**
 * Widths made for every library photo (admin). Both apps' next.config use them as next/image's widths, so a srcset
 * names each file at its real width and the browser picks the one it needs.
 */
export const VARIANT_WIDTHS = [400, 800, 1200, 1600, 2400];

/**
 * A library photo's prepared files, one per variant width (admin and website): `${baseUrl}/${fileName}-${width}.webp`,
 * e.g. ".../<photo id>/tilicho-lake-1200.webp", or `${baseUrl}/${width}.webp` for a photo without a file name.
 */
export type PhotoFiles = { baseUrl: string; variantWidths: readonly number[]; fileName?: string | null };

/**
 * A photo's file name (the words in its address, for Google): lowercase letters and numbers joined by single dashes,
 * at most PHOTO_FILE_NAME_MAX_LENGTH long (the database checks the same).
 */
export const PHOTO_FILE_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const PHOTO_FILE_NAME_MAX_LENGTH = 60;

/** One size's file inside the photo's folder: "tilicho-lake-1200.webp", or "1200.webp" for a photo without a name. */
export const photoVariantFile = (fileName: string | null | undefined, width: number) => (fileName ? `${fileName}-${width}.webp` : `${width}.webp`);

/** The smallest variant at least `wanted` px wide (or the largest there is). */
export const pickVariant = (variantWidths: readonly number[], wanted: number) =>
  [...variantWidths].sort((a, b) => a - b).find((width) => width >= wanted) ?? Math.max(...variantWidths);

export const photoUrl = (photo: PhotoFiles, wanted: number) =>
  `${photo.baseUrl}/${photoVariantFile(photo.fileName, pickVariant(photo.variantWidths, wanted))}`;

/**
 * Every library photo also has `${baseUrl}/share.jpg`: cut to the size WhatsApp, Facebook, LinkedIn and X show
 * for a shared link, as a JPEG (not every app reads WebP there).
 */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const SHARE_IMAGE_FILE = "share.jpg";

export const photoShareUrl = (baseUrl: string) => `${baseUrl}/${SHARE_IMAGE_FILE}`;

/**
 * The image text screen readers and Google read, made from what the admin already filled in (there is no
 * separate description to write): "Kyanjin Gompa, Langtang region", or "Langtang region" without a place.
 */
export const photoAltText = (photo: { place: string }, subject: string) => {
  const place = photo.place.trim();
  return place ? `${place}, ${subject}` : subject;
};
