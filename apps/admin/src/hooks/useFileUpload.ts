"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import { putFile } from "@/features/photos/lib/putFile";

type Failure = { ok: false; message: string };

/** What the input may take: the type sent to storage (browsers don't know every type, e.g. GPX), and the file ending. */
export type FileAccept = { contentType: string; extension: string; label: string };

export const PDF_ACCEPT: FileAccept = { contentType: "application/pdf", extension: ".pdf", label: "PDF" };
export const GPX_ACCEPT: FileAccept = { contentType: "application/gpx+xml", extension: ".gpx", label: "GPX" };

type FileUploadSteps<Result> = {
  accept: FileAccept;
  /** Server Action: a one-time upload link for this file (checks its size). */
  start: (file: File) => Promise<{ ok: true; path: string; uploadUrl: string } | Failure>;
  /** Server Action: checks the uploaded file really is what it says, or removes it. */
  finish: (path: string) => Promise<({ ok: true } & Result) | Failure>;
  onUploaded: (result: Result) => void;
};

/**
 * A file chosen in a file input, sent straight to storage: the server's link, the browser's upload (with progress
 * 0–1, null when idle), then the server's check. `message` says what went wrong, for the field's error.
 */
export const useFileUpload = <Result extends object>({ accept, start, finish, onUploaded }: FileUploadSteps<Result>) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return;
    if (!chosen.name.toLowerCase().endsWith(accept.extension)) return setMessage(`Choose a ${accept.label} file.`);
    setMessage("");
    setProgress(0);
    try {
      const started = await start(chosen);
      if (!started.ok) return setMessage(started.message);
      await putFile(started.uploadUrl, chosen, setProgress, undefined, accept.contentType);
      const finished = await finish(started.path);
      if (!finished.ok) return setMessage(finished.message);
      onUploaded(finished);
    } catch {
      setMessage("The upload stopped. Check your connection and try again.");
    } finally {
      setProgress(null);
    }
  };

  return { upload, progress, isUploading: progress !== null, message };
};
