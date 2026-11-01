"use client";

import { useEffect, useRef, useState } from "react";

import { findSameNamePhotos } from "../actions/findSameNamePhotos";
import { finishPhotoUpload } from "../actions/finishPhotoUpload";
import { startPhotoUpload } from "../actions/startPhotoUpload";
import { putFile, UploadStoppedError } from "../lib/putFile";
import { findSameName } from "../lib/sameFileName";
import { sameNameBatches } from "../lib/sameNameBatches";
import { checkPhotoFile } from "../lib/uploadErrors";
import type { NamedPhoto } from "../types";
import { useSameNameQuestions } from "./useSameNameQuestions";

export type UploadItem = {
  id: string;
  fileName: string;
  /** 0–1 while sending; 1 while the server processes it. */
  progress: number;
  error?: string;
  /** A library photo uploaded from a file with the same name: the upload waits for the editor's answer. */
  sameName?: NamedPhoto;
};

type UsePhotoUploadsOptions<Target> = {
  regionId: string | null;
  /** A photo is ready: a new upload, or the library photo the editor chose instead of uploading the same file again. */
  onUploaded: (photo: NamedPhoto, target: Target) => void;
};

/** When a step throws instead of answering (the server or the connection), what the editor reads for it. */
const STEP_FAILED = {
  start: "The admin server couldn't be reached. Check your internet connection and try again.",
  // The server may still have finished: the photo can already be in the library.
  finish: "The photo was sent, but the connection dropped while it was being prepared. Reload the page: if the photo isn't in the library, add it again.",
};

/** The library photos named like these files. Only a warning, so a failed look-up never stops the upload. */
const lookUpSameNames = async (files: File[]) => {
  const batches = sameNameBatches(files.map((file) => file.name));
  const found = await Promise.all(batches.map((names) => findSameNamePhotos(names).catch(() => [])));
  return found.flat();
};

/**
 * Uploads photos one after another: same-name check (asks first) → link from the server → file straight to
 * storage (with progress) → the server processes it into the library. Failed files stay in the list with their
 * reason. `stop` (or leaving) cancels the upload: a file still being sent is dropped; one the server is already
 * preparing still reaches the library but isn't chosen.
 */
export const usePhotoUploads = <Target>({ regionId, onUploaded }: UsePhotoUploadsOptions<Target>) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const questions = useSameNameQuestions();
  const runs = useRef(new Set<AbortController>());
  // Uploads finish one after another, after the form has re-rendered: each must be handed to the latest
  // onUploaded (with the photos chosen so far), not the one from when the upload started.
  const onUploadedRef = useRef(onUploaded);
  useEffect(() => {
    onUploadedRef.current = onUploaded;
  });
  useEffect(() => {
    const running = runs.current;
    return () => running.forEach((run) => run.abort());
  }, []);

  const update = (id: string, change: Partial<UploadItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const uploadOne = async (file: File, target: Target, sameName: NamedPhoto | null, signal: AbortSignal) => {
    const id = crypto.randomUUID();
    const fileError = checkPhotoFile(file);
    setItems((current) => [...current, { id, fileName: file.name, progress: 0, error: fileError, sameName: (!fileError && sameName) || undefined }]);
    if (fileError) return;

    if (sameName) {
      const answer = await questions.ask(id, signal);
      if (answer !== "upload") dismiss(id);
      if (answer === "useLibraryPhoto") onUploadedRef.current(sameName, target);
      if (answer !== "upload") return;
      update(id, { sameName: undefined });
    }

    const started = await startPhotoUpload({ contentType: file.type, byteSize: file.size }).catch(() => ({ ok: false as const, message: STEP_FAILED.start }));
    if (signal.aborted) return dismiss(id);
    if (!started.ok) return update(id, { error: started.message });

    try {
      await putFile(started.uploadUrl, file, (progress) => update(id, { progress }), signal);
    } catch (error) {
      if (error instanceof UploadStoppedError) return dismiss(id);
      return update(id, { error: error instanceof Error ? error.message : String(error) });
    }

    const finished = await finishPhotoUpload({ uploadKey: started.uploadKey, regionId, originalName: file.name }).catch(() => ({
      ok: false as const,
      message: STEP_FAILED.finish,
    }));
    if (signal.aborted) return dismiss(id);
    if (!finished.ok) return update(id, { error: finished.message });

    dismiss(id);
    onUploadedRef.current({ ...finished.photo, originalName: file.name }, target);
  };

  const upload = async (files: File[], target: Target) => {
    const run = new AbortController();
    runs.current.add(run);
    const sameNames = await lookUpSameNames(files);
    for (const file of files) {
      if (run.signal.aborted) break;
      await uploadOne(file, target, findSameName(file.name, sameNames), run.signal);
    }
    runs.current.delete(run);
  };

  const stop = () => {
    runs.current.forEach((run) => run.abort());
    runs.current.clear();
    setItems([]);
  };

  return {
    items,
    upload,
    dismiss,
    stop,
    answer: questions.answer,
    isUploading: items.some((item) => !item.error),
  };
};
