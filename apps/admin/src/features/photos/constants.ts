/** What the admin accepts (checked in the browser for a quick message, and again on the server). */
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_PHOTO_BYTES = 20 * 1024 * 1024;
/** Smaller photos look blurry in a region gallery or page header. */
export const MIN_PHOTO_WIDTH = 600;
/** Guards the server against "decompression bomb" files (tiny file, gigantic image). */
export const MAX_PHOTO_PIXELS = 100_000_000;

/** The cleaned full-size copy kept privately, to make new sizes later. */
export const MASTER_MAX_SIDE = 3000;

/** Widths made for every photo; the website picks the one it needs (srcset). */
export { VARIANT_WIDTHS } from "@ttn/ui/lib/photos";

/** A region's gallery (the cover is separate). */
export const MAX_GALLERY_PHOTOS = 30;

export const PHOTO_LIMITS = { place: 80, originalName: 200 } as const;
