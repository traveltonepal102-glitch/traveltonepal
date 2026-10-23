"use client";

import { useState } from "react";

import { finishPhotoUpload } from "../actions/finishPhotoUpload";
import { startPhotoUpload } from "../actions/startPhotoUpload";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_BYTES } from "../constants";
import { putFile } from "../lib/putFile";
import type { Photo } from "../types";

export type UploadItem = {
  id: string;
  fileName: string;
  /** 0–1 while sending; 1 while the server processes it. */
  progress: number;
  error?: string;
};

type UsePhotoUploadsOptions<Target> = {
  regionId: string | null;
  onUploaded: (photo: Photo, target: Target) => void;
};

/** A quick check before sending; the server checks the real file again. */
const checkFile = (file: File) => {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return "Use a JPEG, PNG or WebP photo.";
  if (file.size > MAX_PHOTO_BYTES) return "This photo is over 20 MB.";
  return undefined;
};

/**
 * Uploads photos one after another: link from the server → file straight to storage (with progress) →
 * the server processes it into the library. Failed files stay in the list with their reason.
 */
export const usePhotoUploads = <Target>({ regionId, onUploaded }: UsePhotoUploadsOptions<Target>) => {
  const [items, setItems] = useState<UploadItem[]>([]);

  const update = (id: string, change: Partial<UploadItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const uploadOne = async (file: File, target: Target) => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { id, fileName: file.name, progress: 0, error: checkFile(file) }]);
    if (checkFile(file)) return;

    try {
      const started = await startPhotoUpload({ contentType: file.type, byteSize: file.size });
      if (!started.ok) return update(id, { error: started.message });

      await putFile(started.uploadUrl, file, (progress) => update(id, { progress }));
      const finished = await finishPhotoUpload({ uploadKey: started.uploadKey, regionId, originalName: file.name });
      if (!finished.ok) return update(id, { error: finished.message });

      dismiss(id);
      onUploaded(finished.photo, target);
    } catch {
      update(id, { error: "The upload stopped. Check your connection and try again." });
    }
  };

  const upload = async (files: File[], target: Target) => {
    for (const file of files) await uploadOne(file, target);
  };

  return { items, upload, dismiss, isUploading: items.some((item) => !item.error) };
};
