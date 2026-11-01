import { MAX_GALLERY_PHOTOS } from "../constants";
import type { Photo } from "../types";

/**
 * The gallery as chosen in the photo library window, in its order: never the cover (a photo is in one place at a
 * time), each photo once, at most MAX_GALLERY_PHOTOS.
 */
export const replaceGallery = <Item extends Photo>({ cover }: { cover: Item | null }, photos: readonly Item[]) => {
  const used = new Set(cover ? [cover.id] : []);
  const gallery: Item[] = [];
  for (const photo of photos) {
    if (used.has(photo.id) || gallery.length >= MAX_GALLERY_PHOTOS) continue;
    used.add(photo.id);
    gallery.push(photo);
  }
  return { cover, gallery };
};
