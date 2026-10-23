import { z } from "zod";

import { readList, readText, text } from "@/lib/forms/formFields";

import { MAX_GALLERY_PHOTOS, PHOTO_LIMITS } from "../constants";

const photoId = z.uuid("A photo couldn't be read. Reload the page and try again.");

/**
 * What CoverAndGallery sends with an editor's Save: cover, gallery order and each photo's optional place.
 * `owner` names the page in messages ("region", "trek"). Details are kept only for photos in use.
 */
export const photoSelectionSchema = (owner: string) =>
  z
    .object({
      coverPhotoId: z
        .string()
        .transform((value) => value || null)
        .pipe(photoId.nullable()),
      galleryPhotoIds: z.array(photoId).max(MAX_GALLERY_PHOTOS, `A ${owner} can have up to ${MAX_GALLERY_PHOTOS} gallery photos.`),
      details: z.array(z.object({ id: photoId, place: text(PHOTO_LIMITS.place) })),
    })
    .superRefine((photos, context) => {
      const used = [...photos.galleryPhotoIds, ...(photos.coverPhotoId ? [photos.coverPhotoId] : [])];
      if (new Set(used).size === used.length) return;
      context.addIssue({ code: "custom", path: ["galleryPhotoIds"], message: `A photo is in this ${owner} twice. Reload the page.` });
    })
    .transform((photos) => {
      const used = new Set([...photos.galleryPhotoIds, photos.coverPhotoId]);
      return { ...photos, details: photos.details.filter((detail) => used.has(detail.id)) };
    });

const PLACE_PREFIX = "photoPlace.";

/** The photo fields of an editor's FormData (coverPhotoId, galleryPhotoId…, photoPlace.<id>). */
export const readPhotoSelection = (formData: FormData) => ({
  coverPhotoId: readText(formData, "coverPhotoId"),
  galleryPhotoIds: readList(formData, "galleryPhotoId"),
  details: [...formData.keys()]
    .filter((key) => key.startsWith(PLACE_PREFIX))
    .map((key) => ({ id: key.slice(PLACE_PREFIX.length), place: readText(formData, key) })),
});
