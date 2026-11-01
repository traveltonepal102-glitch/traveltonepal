import type { Photo } from "../types";

/**
 * The next page added after the photos shown. A photo uploaded meanwhile moves the pages by one, so a photo can
 * come again: it is shown once.
 */
export const appendPage = <Item extends Photo>(shown: readonly Item[], next: readonly Item[]) => {
  const ids = new Set(shown.map((photo) => photo.id));
  return [...shown, ...next.filter((photo) => !ids.has(photo.id))];
};

/** A photo just uploaded in the window goes first (once). */
export const prependPhoto = <Item extends Photo>(shown: readonly Item[], photo: Item) => [photo, ...shown.filter((other) => other.id !== photo.id)];
