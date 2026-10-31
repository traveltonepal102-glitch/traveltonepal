"use client";

import { useEffect, useState } from "react";

import { listPickerVideos } from "../actions/listPickerVideos";
import type { LibraryVideo } from "../types";

/** The library videos for a "Choose a video" window, loaded when it opens; `add` puts a new one first. */
export const usePickerVideos = () => {
  const [videos, setVideos] = useState<LibraryVideo[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    listPickerVideos()
      .then((loaded) => isCurrent && setVideos(loaded))
      .catch(() => isCurrent && setLoadError(true));
    return () => {
      isCurrent = false;
    };
  }, []);

  const add = (video: LibraryVideo) => setVideos((current) => [video, ...(current ?? []).filter((item) => item.id !== video.id)]);

  return { videos, loadError, add };
};
