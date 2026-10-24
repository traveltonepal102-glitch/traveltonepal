import { VARIANT_WIDTHS } from "../constants";

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

// Picking the file for a width is shared with the website.
export { pickVariant, photoUrl } from "@ttn/ui/lib/photos";
