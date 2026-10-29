"use client";

import { useState } from "react";

import { listPickerPhotos } from "../actions/listPickerPhotos";
import type { Photo } from "../types";

/**
 * The library photos for a "Choose a photo" window: `given` when the page already has them, else loaded the first
 * time `load` is called (when the window opens), so an editor doesn't fetch the whole library up front.
 */
export const usePickerPhotos = (given?: Photo[]) => {
  const [loaded, setLoaded] = useState<Photo[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    if (given || loaded) return;
    setLoadError(false);
    listPickerPhotos()
      .then(setLoaded)
      .catch(() => setLoadError(true));
  };

  return { photos: given ?? loaded, loadError, load };
};
