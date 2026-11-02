"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import { putFile } from "@/features/photos/lib/putFile";

type Failure = { ok: false; message: string };

type PdfUploadSteps<Result> = {
  /** Server Action: a one-time upload link for this file (checks its size). */
  start: (file: File) => Promise<{ ok: true; path: string; uploadUrl: string } | Failure>;
  /** Server Action: checks the uploaded file really is a PDF, or removes it. */
  finish: (path: string) => Promise<({ ok: true } & Result) | Failure>;
  onUploaded: (result: Result) => void;
};

/**
 * A PDF chosen in a file input, sent straight to storage: the server's link, the browser's upload (with progress
 * 0–1, null when idle), then the server's check. `message` says what went wrong, for the field's error.
 */
export const usePdfUpload = <Result extends object>({ start, finish, onUploaded }: PdfUploadSteps<Result>) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return;
    if (chosen.type !== "application/pdf") return setMessage("Choose a PDF file.");
    setMessage("");
    setProgress(0);
    try {
      const started = await start(chosen);
      if (!started.ok) return setMessage(started.message);
      await putFile(started.uploadUrl, chosen, setProgress);
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
