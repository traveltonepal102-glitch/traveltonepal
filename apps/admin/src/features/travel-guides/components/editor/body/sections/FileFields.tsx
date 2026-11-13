"use client";

import { fileSizeLabel } from "@ttn/config/guideFiles";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { PDF_ACCEPT, useFileUpload } from "@/hooks/useFileUpload";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { finishGuideFileUpload, startGuideFileUpload } from "../../../../actions/guideFileUpload";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type FileFieldsProps = {
  /** The uploaded PDF's address ("" until one is added) and its size in bytes. */
  path: string;
  byteSize: number;
  title: string;
  description: string;
  /** Where uploaded files are opened from (the "Open" link). */
  filesBaseUrl: string;
  /** e.g. "sections.9" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { path?: string; byteSize?: number; title?: string; description?: string }) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** "guide-files/<id>/langtang-packing-list.pdf" → "langtang-packing-list.pdf". */
const fileNameOf = (path: string) => path.split("/").pop() ?? path;

/** "langtang-packing-list.pdf" → "Langtang packing list", a first title to change. */
const titleFromFileName = (fileName: string) => {
  const words = fileName.replace(/\.pdf$/, "").replaceAll("-", " ");
  return words === "download" ? "" : words.charAt(0).toUpperCase() + words.slice(1);
};

/** "File to download": a PDF uploaded straight to storage and checked to really be a PDF, with its title for visitors. */
export const FileFields = ({ path, byteSize, title, description, filesBaseUrl, field, errors, onChange }: FileFieldsProps) => {
  const id = useId();
  const { upload, isUploading, progress, message } = useFileUpload({
    accept: PDF_ACCEPT,
    start: (chosen) => startGuideFileUpload(chosen.name, chosen.size),
    finish: finishGuideFileUpload,
    onUploaded: (uploaded) => onChange({ path: uploaded.path, byteSize: uploaded.byteSize, title: title.trim() ? title : titleFromFileName(fileNameOf(uploaded.path)) }),
  });
  const fileError = message || errors[`${field}.path`] || errors[`${field}.byteSize`];

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex size-10 flex-none items-center justify-center rounded-md bg-surface text-danger">
            <Icon name="picture_as_pdf" size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-ink">{path ? fileNameOf(path) : "No PDF yet"}</span>
            <span className="block text-xs text-muted-foreground">{path ? `PDF · ${fileSizeLabel(byteSize)}` : "Add a PDF of up to 15 MB. Visitors open or download it from the guide."}</span>
          </span>
          {path && (
            <a href={`${filesBaseUrl}/${path}`} target="_blank" rel="noopener noreferrer" className={smallButton}>
              <Icon name="open_in_new" size={16} />
              Open
            </a>
          )}
          <label htmlFor={`${id}-file`} className={cn(smallButton, isUploading && "pointer-events-none opacity-60")}>
            <Icon name="upload" size={16} />
            {progress !== null ? `Uploading ${Math.round(progress * 100)}%` : path ? "Replace" : "Add PDF"}
          </label>
          <input id={`${id}-file`} type="file" accept="application/pdf" onChange={upload} disabled={isUploading} className="sr-only" />
        </div>
        <FieldError id={`${id}-error`} message={fileError} />
      </div>
      <TextField
        name="sectionFileTitle"
        label="Title"
        hint="The file's name for visitors. Adding a PDF fills it in when empty."
        value={title}
        onValueChange={(next) => onChange({ title: next })}
        placeholder="Langtang packing list"
        maxLength={LIMIT.fileTitle}
        error={errors[`${field}.title`]}
      />
      <TextField
        name="sectionFileDescription"
        label="Description"
        labelNote="(optional)"
        value={description}
        onValueChange={(next) => onChange({ description: next })}
        placeholder="Everything we pack for a 10-day teahouse trek, on one printable page."
        maxLength={LIMIT.fileDescription}
        error={errors[`${field}.description`]}
      />
    </>
  );
};
