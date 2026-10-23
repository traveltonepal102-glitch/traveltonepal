"use client";

import { useState } from "react";

import { MAX_GALLERY_PHOTOS } from "../constants";
import type { Photo } from "../types";

export type PhotoSelection = { cover: Photo | null; gallery: Photo[] };

const withoutPhoto = (gallery: Photo[], id: string) => gallery.filter((photo) => photo.id !== id);

/**
 * The cover slot and the gallery. A photo is in one place at a time; a replaced cover goes back to the
 * gallery instead of being lost. Updates are functional so uploads finishing later never use stale state.
 */
export const usePhotoSelection = (initial: PhotoSelection, onEdit: () => void) => {
  const [selection, setSelection] = useState(initial);

  const change = (update: (current: PhotoSelection) => PhotoSelection) => {
    setSelection(update);
    onEdit();
  };

  /** A new photo for the cover slot; the old cover moves to the start of the gallery (if there's room). */
  const setCover = (photo: Photo) =>
    change(({ cover, gallery }) => ({
      cover: photo,
      gallery: cover && gallery.length < MAX_GALLERY_PHOTOS ? [cover, ...gallery] : gallery,
    }));

  /** A gallery photo becomes the cover; the old cover takes its place in the gallery. */
  const makeCover = (id: string) =>
    change(({ cover, gallery }) => ({
      cover: gallery.find((photo) => photo.id === id) ?? cover,
      gallery: gallery.flatMap((photo) => (photo.id !== id ? [photo] : cover ? [cover] : [])),
    }));

  const moveCoverToGallery = () =>
    change(({ cover, gallery }) => ({ cover: null, gallery: cover ? [cover, ...gallery] : gallery }));

  const removeCover = () => change(({ gallery }) => ({ cover: null, gallery }));

  const addToGallery = (photo: Photo) =>
    change(({ cover, gallery }) => ({
      cover,
      gallery: gallery.length < MAX_GALLERY_PHOTOS ? [...gallery, photo] : gallery,
    }));

  const removeFromGallery = (id: string) => change(({ cover, gallery }) => ({ cover, gallery: withoutPhoto(gallery, id) }));

  const moveInGallery = (from: number, to: number) =>
    change(({ cover, gallery }) => {
      if (to < 0 || to >= gallery.length) return { cover, gallery };
      const next = [...gallery];
      const [photo] = next.splice(from, 1);
      next.splice(to, 0, photo);
      return { cover, gallery: next };
    });

  const updatePlace = (id: string, place: string) =>
    change(({ cover, gallery }) => ({
      cover: cover?.id === id ? { ...cover, place } : cover,
      gallery: gallery.map((photo) => (photo.id === id ? { ...photo, place } : photo)),
    }));

  return {
    ...selection,
    isGalleryFull: selection.gallery.length >= MAX_GALLERY_PHOTOS,
    setCover,
    makeCover,
    moveCoverToGallery,
    removeCover,
    addToGallery,
    removeFromGallery,
    moveInGallery,
    updatePlace,
  };
};
