import type { Photo } from "../types";

/**
 * The image text screen readers and Google read, made from what the admin already filled in (there is no
 * separate description to write): "Kyanjin Gompa, Langtang region", or "Langtang region" without a place.
 */
export const photoAltText = (photo: Pick<Photo, "place">, subject: string) => {
  const place = photo.place.trim();
  return place ? `${place}, ${subject}` : subject;
};
