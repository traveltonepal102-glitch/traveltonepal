import "server-only";

import { createPhotoStorage } from "@/lib/storage/createPhotoStorage";

import { photoFileNameFrom } from "../lib/photoFileName";
import { publicPhotoKeys, shareKey, variantKey } from "../lib/photoFileKeys";
import type { Photo } from "../types";
import { findRegionSlug, insertPhoto } from "./photosRepository";
import { PhotoRejectedError, processPhoto } from "./processPhoto";

type ImportPhotoInput = {
  /** uploads/<uuid>, where the browser put the file. */
  uploadKey: string;
  regionId: string | null;
  originalName: string;
  createdBy: string;
};

/** A step of an import failed for a reason other than the file itself; `message` is for the editor, `cause` for the log. */
export class PhotoImportError extends Error {}

/** Runs one step, turning anything it throws (except a rejected file) into a PhotoImportError with this message. */
const step = async <Result>(message: string, run: () => Promise<Result>) => {
  try {
    return await run();
  } catch (cause) {
    if (cause instanceof PhotoRejectedError) throw cause;
    throw new PhotoImportError(message, { cause });
  }
};

/**
 * Turns a finished browser upload into a library photo: process it (strip location data, make sizes),
 * store the master privately and the sizes (named after the uploaded file, photoFileNameFrom) and share picture
 * publicly, then add the row. Whatever happens, the raw upload is deleted; if saving fails halfway, the files
 * already written are removed again.
 */
export const importPhoto = async ({ uploadKey, regionId, originalName, createdBy }: ImportPhotoInput): Promise<Photo> => {
  const storage = await step("The photo storage can't be reached right now. Try again in a moment.", createPhotoStorage);

  try {
    const upload = await step("The photo you sent wasn't found in the storage. Add it again.", () => storage.download("private", uploadKey));
    const processed = await step("This photo couldn't be read: the file may be damaged. Open it, save it again as a JPEG and add it again.", () =>
      processPhoto(upload),
    );
    const fileName = photoFileNameFrom(originalName, (await findRegionSlug(regionId).catch(() => null)) ?? "nepal");

    const id = crypto.randomUUID();
    const masterKey = `masters/${id}.jpg`;
    const variantWidths = processed.variants.map((variant) => variant.width);

    try {
      await step("The photo couldn't be stored. Try again in a moment.", async () => {
        await storage.upload("private", masterKey, processed.master, "image/jpeg");
        await Promise.all([
          ...processed.variants.map((variant) => storage.upload("public", variantKey(id, fileName, variant.width), variant.body, "image/webp")),
          storage.upload("public", shareKey(id), processed.share, "image/jpeg"),
        ]);
      });
      return await step("The photo was prepared but couldn't be added to the library. Try again in a moment.", () =>
        insertPhoto({
          id,
          regionId,
          masterKey,
          variantWidths,
          fileName,
          width: processed.width,
          height: processed.height,
          placeholder: processed.placeholder,
          originalName,
          byteSize: upload.length,
          createdBy,
        }),
      );
    } catch (error) {
      await Promise.allSettled([storage.remove("private", [masterKey]), storage.remove("public", publicPhotoKeys(id, fileName, variantWidths))]);
      throw error;
    }
  } finally {
    // The raw upload may still contain GPS data: never keep it.
    await storage.remove("private", [uploadKey]).catch((error: unknown) => console.error(`Could not delete ${uploadKey}:`, error));
  }
};
