import "server-only";

import { createPhotoStorage } from "@/lib/storage/createPhotoStorage";

import { publicPhotoKeys, shareKey, variantKey } from "../lib/photoFileKeys";
import type { Photo } from "../types";
import { insertPhoto } from "./photosRepository";
import { processPhoto } from "./processPhoto";

type ImportPhotoInput = {
  /** uploads/<uuid>, where the browser put the file. */
  uploadKey: string;
  regionId: string | null;
  originalName: string;
  createdBy: string;
};

/**
 * Turns a finished browser upload into a library photo: process it (strip location data, make sizes),
 * store the master privately and the sizes and share picture publicly, then add the row. Whatever happens,
 * the raw upload is deleted; if saving fails halfway, the files already written are removed again.
 */
export const importPhoto = async ({ uploadKey, regionId, originalName, createdBy }: ImportPhotoInput): Promise<Photo> => {
  const storage = await createPhotoStorage();

  try {
    const upload = await storage.download("private", uploadKey);
    const processed = await processPhoto(upload);

    const id = crypto.randomUUID();
    const masterKey = `masters/${id}.jpg`;
    const variantWidths = processed.variants.map((variant) => variant.width);

    try {
      await storage.upload("private", masterKey, processed.master, "image/jpeg");
      await Promise.all([
        ...processed.variants.map((variant) => storage.upload("public", variantKey(id, variant.width), variant.body, "image/webp")),
        storage.upload("public", shareKey(id), processed.share, "image/jpeg"),
      ]);
      return await insertPhoto({
        id,
        regionId,
        masterKey,
        variantWidths,
        width: processed.width,
        height: processed.height,
        placeholder: processed.placeholder,
        originalName,
        byteSize: upload.length,
        createdBy,
      });
    } catch (error) {
      await Promise.allSettled([storage.remove("private", [masterKey]), storage.remove("public", publicPhotoKeys(id, variantWidths))]);
      throw error;
    }
  } finally {
    // The raw upload may still contain GPS data: never keep it.
    await storage.remove("private", [uploadKey]).catch((error: unknown) => console.error(`Could not delete ${uploadKey}:`, error));
  }
};
