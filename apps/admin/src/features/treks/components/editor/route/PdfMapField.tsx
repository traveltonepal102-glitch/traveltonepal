"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { putFile } from "@/features/photos/lib/putFile";

import { finishPdfMapUpload, startPdfMapUpload } from "../../../actions/pdfMapUpload";

type PdfMapFieldProps = {
  /** The saved map, if any. */
  path: string | null;
  url: string | null;
  error?: string;
  onEdit: () => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/**
 * "Printable map (PDF)": uploaded straight to storage, then checked to really be a PDF. The trek keeps it once
 * saved (sent as pdfMapPath); without one, the page hides its "Download PDF map" button.
 */
export const PdfMapField = ({ path: savedPath, url: savedUrl, error, onEdit }: PdfMapFieldProps) => {
  const id = useId();
  const [file, setFile] = useState(savedPath && savedUrl ? { path: savedPath, url: savedUrl } : null);
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
      const started = await startPdfMapUpload(chosen.size);
      if (!started.ok) return setMessage(started.message);
      await putFile(started.uploadUrl, chosen, setProgress);
      const finished = await finishPdfMapUpload(started.path);
      if (!finished.ok) return setMessage(finished.message);
      setFile({ path: finished.path, url: finished.url });
      onEdit();
    } catch {
      setMessage("The upload stopped. Check your connection and try again.");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-3">
      <input type="hidden" name="pdfMapPath" value={file?.path ?? ""} />
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex size-10 flex-none items-center justify-center rounded-md bg-surface text-danger">
          <Icon name="picture_as_pdf" size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">Printable map (PDF)</span>
          <span className="block text-xs text-muted-foreground">
            {file ? "Visitors can download it from the route map." : "Not added yet. The “Download PDF map” button stays hidden until you add one."}
          </span>
        </span>
        {file && (
          <a href={file.url} target="_blank" rel="noopener noreferrer" className={smallButton}>
            <Icon name="open_in_new" size={16} />
            Open
          </a>
        )}
        <label htmlFor={`${id}-file`} className={cn(smallButton, progress !== null && "pointer-events-none opacity-60")}>
          <Icon name="upload" size={16} />
          {progress !== null ? `Uploading ${Math.round(progress * 100)}%` : file ? "Replace" : "Add PDF"}
        </label>
        <input id={`${id}-file`} type="file" accept="application/pdf" onChange={upload} disabled={progress !== null} className="sr-only" />
        {file && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              onEdit();
            }}
            className={smallButton}
          >
            <Icon name="delete" size={16} />
            Remove
          </button>
        )}
      </div>
      <FieldError id={`${id}-error`} message={message || error} />
    </div>
  );
};
