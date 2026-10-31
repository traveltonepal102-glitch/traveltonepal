"use client";

import { useState } from "react";

import { finishPhotoUpload } from "../actions/finishPhotoUpload";
import { startPhotoUpload } from "../actions/startPhotoUpload";
import { putFile } from "../lib/putFile";
import { checkPhotoFile } from "../lib/uploadErrors";
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

/** When a step throws instead of answering (the server or the connection), what the editor reads for it. */
const STEP_FAILED = {
  start: "The admin server couldn't be reached. Check your internet connection and try again.",
  // The server may still have finished: the photo can already be in the library.
  finish: "The photo was sent, but the connection dropped while it was being prepared. Reload the page: if the photo isn't in the library, add it again.",
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
    const fileError = checkPhotoFile(file);
    setItems((current) => [...current, { id, fileName: file.name, progress: 0, error: fileError }]);
    if (fileError) return;

    const started = await startPhotoUpload({ contentType: file.type, byteSize: file.size }).catch(() => ({ ok: false as const, message: STEP_FAILED.start }));
    if (!started.ok) return update(id, { error: started.message });

    try {
      await putFile(started.uploadUrl, file, (progress) => update(id, { progress }));
    } catch (error) {
      return update(id, { error: error instanceof Error ? error.message : String(error) });
    }

    const finished = await finishPhotoUpload({ uploadKey: started.uploadKey, regionId, originalName: file.name }).catch(() => ({
      ok: false as const,
      message: STEP_FAILED.finish,
    }));
    if (!finished.ok) return update(id, { error: finished.message });

    dismiss(id);
    onUploaded(finished.photo, target);
  };

  const upload = async (files: File[], target: Target) => {
    for (const file of files) await uploadOne(file, target);
  };

  return { items, upload, dismiss, isUploading: items.some((item) => !item.error) };
};
