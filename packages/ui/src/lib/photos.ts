/** A library photo's prepared files: `${baseUrl}/${width}.webp`, one per variant width (admin and website). */
export type PhotoFiles = { baseUrl: string; variantWidths: readonly number[] };

/** The smallest variant at least `wanted` px wide (or the largest there is). */
export const pickVariant = (variantWidths: readonly number[], wanted: number) =>
  [...variantWidths].sort((a, b) => a - b).find((width) => width >= wanted) ?? Math.max(...variantWidths);

export const photoUrl = (photo: PhotoFiles, wanted: number) => `${photo.baseUrl}/${pickVariant(photo.variantWidths, wanted)}.webp`;

/**
 * The image text screen readers and Google read, made from what the admin already filled in (there is no
 * separate description to write): "Kyanjin Gompa, Langtang region", or "Langtang region" without a place.
 */
export const photoAltText = (photo: { place: string }, subject: string) => {
  const place = photo.place.trim();
  return place ? `${place}, ${subject}` : subject;
};
