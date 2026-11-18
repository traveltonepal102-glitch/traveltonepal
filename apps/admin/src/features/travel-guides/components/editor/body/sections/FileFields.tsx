"use client";

import { GUIDE_FILE_FORMATS, GUIDE_FILE_KINDS_TEXT, MAX_GUIDE_FILE_BYTES, fileSizeLabel, guideFileFormatOf } from "@ttn/config/guideFiles";
import { Icon } from "@ttn/ui/icon";
import { FILE_ICONS } from "@ttn/ui/lib/fileIcons";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { acceptAttribute, useFileUpload } from "@/hooks/useFileUpload";
import type { FileAccept } from "@/hooks/useFileUpload";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { finishGuideFileUpload, startGuideFileUpload } from "../../../../actions/guideFileUpload";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type FileFieldsProps = {
  /** The uploaded file's address ("" until one is added) and its size in bytes. */
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

/** Every format a guide may offer (@ttn/config/guideFiles), each sent to storage as its own type. */
const GUIDE_FILE_UPLOAD: FileAccept = {
  types: GUIDE_FILE_FORMATS.map((format) => ({ extension: `.${format.extension}`, contentType: format.contentType })),
  wrongTypeMessage: `This kind of file can't be added. Use ${GUIDE_FILE_KINDS_TEXT}.`,
};
const MAX_SIZE = fileSizeLabel(MAX_GUIDE_FILE_BYTES);

/** "guide-files/<id>/langtang-packing-list.pdf" → "langtang-packing-list.pdf". */
const fileNameOf = (path: string) => path.split("/").pop() ?? path;

/** "langtang-packing-list.pdf" → "Langtang packing list", a first title to change. */
const titleFromFileName = (fileName: string) => {
  const words = fileName.replace(/\.[a-z0-9]+$/, "").replaceAll("-", " ");
  return words === "download" ? "" : words.charAt(0).toUpperCase() + words.slice(1);
};

/** "File to download": a file (PDF, Word, Excel, photo, audio, archive…) uploaded straight to storage and checked to really be what its ending says, with its title for visitors. */
export const FileFields = ({ path, byteSize, title, description, filesBaseUrl, field, errors, onChange }: FileFieldsProps) => {
  const id = useId();
  const { upload, isUploading, progress, message } = useFileUpload({
    accept: GUIDE_FILE_UPLOAD,
    start: (chosen) => startGuideFileUpload(chosen.name, chosen.size),
    finish: finishGuideFileUpload,
    onUploaded: (uploaded) => onChange({ path: uploaded.path, byteSize: uploaded.byteSize, title: title.trim() ? title : titleFromFileName(fileNameOf(uploaded.path)) }),
  });
  const fileError = message || errors[`${field}.path`] || errors[`${field}.byteSize`];
  const format = path ? guideFileFormatOf(path) : undefined;

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg border border-solid border-border bg-page p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex size-10 flex-none items-center justify-center rounded-md bg-surface", format?.category === "pdf" || !format ? "text-danger" : "text-brand")}>
            <Icon name={FILE_ICONS[format?.category ?? "pdf"]} size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-bold text-ink">{path ? fileNameOf(path) : "No file yet"}</span>
            <span className="block text-xs text-muted-foreground">{path ? `${format?.label ?? "File"} · ${fileSizeLabel(byteSize)}` : `Add a file of up to ${MAX_SIZE}: ${GUIDE_FILE_KINDS_TEXT}. Visitors open or download it from the guide.`}</span>
          </span>
          {path && (
            <a href={`${filesBaseUrl}/${path}`} target="_blank" rel="noopener noreferrer" className={smallButton}>
              <Icon name="open_in_new" size={16} />
              Open
            </a>
          )}
          <label htmlFor={`${id}-file`} className={cn(smallButton, isUploading && "pointer-events-none opacity-60")}>
            <Icon name="upload" size={16} />
            {progress !== null ? `Uploading ${Math.round(progress * 100)}%` : path ? "Replace" : "Add file"}
          </label>
          <input id={`${id}-file`} type="file" accept={acceptAttribute(GUIDE_FILE_UPLOAD)} onChange={upload} disabled={isUploading} className="sr-only" />
        </div>
        <FieldError id={`${id}-error`} message={fileError} />
      </div>
      <TextField
        name="sectionFileTitle"
        label="Title"
        hint="The file's name for visitors. Adding a file fills it in when empty."
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
