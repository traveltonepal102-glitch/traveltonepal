"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { GPX_ACCEPT, PDF_ACCEPT, useFileUpload } from "@/hooks/useFileUpload";
import type { FileAccept } from "@/hooks/useFileUpload";
import type { TrekFileKind } from "@/lib/storage/trekFiles";

import { finishTrekFileUpload, startTrekFileUpload } from "../../../actions/trekFileUpload";

type TrekFileFieldProps = {
  kind: TrekFileKind;
  /** The saved file, if any. */
  path: string | null;
  url: string | null;
  error?: string;
  onEdit: () => void;
};

type Words = { field: string; title: string; icon: IconName; iconClass: string; accept: FileAccept; withFile: string; withoutFile: string; add: string };

const WORDS: Record<TrekFileKind, Words> = {
  pdfMap: {
    field: "pdfMapPath",
    title: "Printable map (PDF)",
    icon: "picture_as_pdf",
    iconClass: "text-danger",
    accept: PDF_ACCEPT,
    withFile: "Visitors can download it from the route map.",
    withoutFile: "Not added yet. The “Download PDF map” button stays hidden until you add one.",
    add: "Add PDF",
  },
  gpxTrack: {
    field: "gpxTrackPath",
    title: "GPS track (GPX)",
    icon: "route",
    iconClass: "text-brand",
    accept: GPX_ACCEPT,
    withFile: "Visitors can download it from the route map and open it in Gaia, Komoot or a Garmin.",
    withoutFile: "Not added yet. Export the route as a GPX file (from Google My Maps, Gaia or a GPS watch) to add it.",
    add: "Add GPX",
  },
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/**
 * A file the trek offers (the printable map, the GPS track): uploaded straight to storage, then checked to really
 * be what it says. The trek keeps it once saved (sent as its path field); without one, the page hides its link.
 */
export const TrekFileField = ({ kind, path: savedPath, url: savedUrl, error, onEdit }: TrekFileFieldProps) => {
  const words = WORDS[kind];
  const id = useId();
  const [file, setFile] = useState(savedPath && savedUrl ? { path: savedPath, url: savedUrl } : null);
  const { upload, progress, message } = useFileUpload({
    accept: words.accept,
    start: (chosen) => startTrekFileUpload(kind, chosen.size),
    finish: (path) => finishTrekFileUpload(kind, path),
    onUploaded: (uploaded) => {
      setFile({ path: uploaded.path, url: uploaded.url });
      onEdit();
    },
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-3">
      <input type="hidden" name={words.field} value={file?.path ?? ""} />
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn("inline-flex size-10 flex-none items-center justify-center rounded-md bg-surface", words.iconClass)}>
          <Icon name={words.icon} size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">{words.title}</span>
          <span className="block text-xs text-muted-foreground">{file ? words.withFile : words.withoutFile}</span>
        </span>
        {file && (
          <a href={file.url} target="_blank" rel="noopener noreferrer" className={smallButton}>
            <Icon name="open_in_new" size={16} />
            Open
          </a>
        )}
        <label htmlFor={`${id}-file`} className={cn(smallButton, progress !== null && "pointer-events-none opacity-60")}>
          <Icon name="upload" size={16} />
          {progress !== null ? `Uploading ${Math.round(progress * 100)}%` : file ? "Replace" : words.add}
        </label>
        <input id={`${id}-file`} type="file" accept={words.accept.extension} onChange={upload} disabled={progress !== null} className="sr-only" />
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
