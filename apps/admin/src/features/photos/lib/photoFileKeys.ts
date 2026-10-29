import { SHARE_IMAGE_FILE } from "@ttn/ui/lib/photos";

/** A size's file in the public area: <photo id>/<width>.webp. */
export const variantKey = (photoId: string, width: number) => `${photoId}/${width}.webp`;

/** The share picture's file in the public area: <photo id>/share.jpg. */
export const shareKey = (photoId: string) => `${photoId}/${SHARE_IMAGE_FILE}`;

/** Every file a photo has in the public area (to delete them together). */
export const publicPhotoKeys = (photoId: string, variantWidths: readonly number[]) => [
  ...variantWidths.map((width) => variantKey(photoId, width)),
  shareKey(photoId),
];
