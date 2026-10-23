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
