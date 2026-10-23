import "server-only";
import sharp from "sharp";

import { MASTER_MAX_SIDE, MAX_PHOTO_PIXELS, MIN_PHOTO_WIDTH } from "../constants";
import { pickVariantWidths } from "../lib/variants";

export type ProcessedPhoto = {
  width: number;
  height: number;
  /** Cleaned full-size JPEG, kept privately. */
  master: Buffer;
  variants: { width: number; body: Buffer }[];
  placeholder: string;
};

export class PhotoRejectedError extends Error {}

const READABLE_FORMATS = new Set(["jpeg", "png", "webp"]);

/**
 * Turns an upload into what the site serves: upright (EXIF orientation applied), without any metadata
 * (GPS location, camera, owner: sharp writes none unless asked), as a JPEG master plus WebP sizes and a
 * tiny blurred preview. The file's real format is checked, not the name or type the browser sent.
 */
export const processPhoto = async (upload: Buffer): Promise<ProcessedPhoto> => {
  const options = { failOn: "error" as const, limitInputPixels: MAX_PHOTO_PIXELS };

  let format: string | undefined;
  try {
    ({ format } = await sharp(upload, options).metadata());
  } catch {
    throw new PhotoRejectedError("This file isn't a photo we can read. Use a JPEG, PNG or WebP photo.");
  }
  if (!format || !READABLE_FORMATS.has(format)) {
    throw new PhotoRejectedError("This file type isn't supported. Use a JPEG, PNG or WebP photo.");
  }

  const master = await sharp(upload, options)
    .rotate()
    .resize({ width: MASTER_MAX_SIDE, height: MASTER_MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });

  const { width, height } = master.info;
  if (width < MIN_PHOTO_WIDTH) {
    throw new PhotoRejectedError(`This photo is too small (${width} px wide). Use one at least ${MIN_PHOTO_WIDTH} px wide.`);
  }

  const variants = await Promise.all(
    pickVariantWidths(width).map(async (variantWidth) => ({
      width: variantWidth,
      body: await sharp(master.data).resize({ width: variantWidth }).webp({ quality: 78 }).toBuffer(),
    })),
  );
  const tiny = await sharp(master.data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();

  return { width, height, master: master.data, variants, placeholder: `data:image/webp;base64,${tiny.toString("base64")}` };
};
