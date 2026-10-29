/** A photo from the library, as the admin screens show it. */
export type Photo = {
  id: string;
  width: number;
  height: number;
  /** Sized files are at `${baseUrl}/${width}.webp`, one per variant width. */
  baseUrl: string;
  variantWidths: number[];
  /** Tiny blurred preview (data URL) shown while loading; "" if none. */
  placeholder: string;
  /** Optional "taken at", e.g. "Kyanjin Gompa". Also used in the image text (photoAltText). */
  place: string;
};

/** What an editor saves about a photo it uses (the place belongs to the photo itself). */
export type PhotoDetails = { id: string; place: string };

/** A photo on the Photos screen, with what identifies the file. */
export type LibraryPhoto = Photo & { originalName: string; byteSize: number; createdAt: string };

/** What a photo can be used by (public.photo_uses). */
export const PHOTO_USE_KINDS = ["trek", "region", "guide", "page", "adventure", "author", "trekking_guide", "review", "settings"] as const;
export type PhotoUseKind = (typeof PHOTO_USE_KINDS)[number];

/** One place a photo is used, e.g. the trek "Mardi Himal Trek", "Day 3". */
export type PhotoUse = { photoId: string; kind: PhotoUseKind; itemId: string; itemLabel: string; detail: string };
