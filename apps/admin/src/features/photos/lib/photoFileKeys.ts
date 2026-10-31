import { SHARE_IMAGE_FILE, photoVariantFile } from "@ttn/ui/lib/photos";

/** A size's file in the public area: <photo id>/<file name>-<width>.webp (<photo id>/<width>.webp without a name). */
export const variantKey = (photoId: string, fileName: string | null, width: number) => `${photoId}/${photoVariantFile(fileName, width)}`;

/** The share picture's file in the public area: <photo id>/share.jpg. */
export const shareKey = (photoId: string) => `${photoId}/${SHARE_IMAGE_FILE}`;

/**
 * Every file a photo may have in the public area (to delete them together): its sizes, the share picture and, for
 * a photo named after it was uploaded (scripts/name-photo-files.mjs), the unnamed sizes it started with.
 */
export const publicPhotoKeys = (photoId: string, fileName: string | null, variantWidths: readonly number[]) => [
  ...variantWidths.map((width) => variantKey(photoId, fileName, width)),
  ...(fileName ? variantWidths.map((width) => variantKey(photoId, null, width)) : []),
  shareKey(photoId),
];
