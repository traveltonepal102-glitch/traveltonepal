import { VARIANT_WIDTHS } from "../constants";
import type { Photo } from "../types";

/**
 * The widths to make for a photo this wide: the standard widths it covers, plus its own width when that is
 * in between (so a 1000 px photo gets 400, 800 and 1000, never an upscaled 1200).
 */
export const pickVariantWidths = (sourceWidth: number): number[] => {
  const widths = VARIANT_WIDTHS.filter((width) => width <= sourceWidth);
  const largest = VARIANT_WIDTHS.at(-1) ?? sourceWidth;
  if (sourceWidth < largest && !widths.includes(sourceWidth)) widths.push(sourceWidth);
  return widths;
};

/** The smallest variant at least `wanted` px wide (or the largest there is). */
export const pickVariant = (variantWidths: number[], wanted: number) =>
  [...variantWidths].sort((a, b) => a - b).find((width) => width >= wanted) ?? Math.max(...variantWidths);

export const photoUrl = (photo: Pick<Photo, "baseUrl" | "variantWidths">, wanted: number) =>
  `${photo.baseUrl}/${pickVariant(photo.variantWidths, wanted)}.webp`;
