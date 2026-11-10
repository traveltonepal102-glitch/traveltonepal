/** A photo from the library, as the admin screens show it. */
export type Photo = {
  id: string;
  width: number;
  height: number;
  /** Sized files are in this folder, one per variant width (PhotoFiles: `${baseUrl}/${fileName}-${width}.webp`). */
  baseUrl: string;
  variantWidths: number[];
  /** The words in the files' names, e.g. "tilicho-lake"; null for photos uploaded before photos had one. */
  fileName: string | null;
  /** Tiny blurred preview (data URL) shown while loading; "" if none. */
  placeholder: string;
  /** Optional "taken at", e.g. "Kyanjin Gompa". Also used in the image text while there is no alt text (photoAltText). */
  place: string;
  /** What the photo shows, for blind visitors and Google Images; "" until typed. */
  altText: string;
  /** Shown under the photo when a visitor opens it full size; "" for none. */
  caption: string;
};

/** What can be typed about a photo itself (Photos screen, "Choose a photo" window). */
export type PhotoText = Pick<Photo, "altText" | "caption" | "place">;

/** What an editor saves about a photo it uses (the place belongs to the photo itself). */
export type PhotoDetails = { id: string; place: string };

/** A photo on the Photos screen, with what identifies the file. */
export type LibraryPhoto = Photo & { originalName: string; byteSize: number; createdAt: string };

/** What a photo can be used by (public.photo_uses). */
export const PHOTO_USE_KINDS = ["trek", "region", "guide", "page", "adventure", "author", "trekking_guide", "review", "settings"] as const;
export type PhotoUseKind = (typeof PHOTO_USE_KINDS)[number];

/** One place a photo is used, e.g. the trek "Mardi Himal Trek", "Day 3". */
export type PhotoUse = { photoId: string; kind: PhotoUseKind; itemId: string; itemLabel: string; detail: string };

/** A library photo with the name of the file it was uploaded from (to spot the same file uploaded again). */
export type NamedPhoto = Photo & { originalName: string };

/** A photo in the "Choose a photo" window: how many places use it, for its badge (null: not known, no badge). */
export type PickerPhoto = NamedPhoto & { useCount: number | null };
