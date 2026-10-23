"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";
import type { ChangeEvent } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";

import { ACCEPTED_PHOTO_TYPES } from "../constants";

type PhotoUploadButtonProps = {
  label: string;
  isMultiple?: boolean;
  isDisabled?: boolean;
  onFiles: (files: File[]) => void;
  className?: string;
};

/**
 * Opens the file picker. The input has no name, so the chosen files are never sent with the form itself:
 * they go straight to storage through usePhotoUploads.
 */
export const PhotoUploadButton = ({ label, isMultiple = false, isDisabled = false, onFiles, className }: PhotoUploadButtonProps) => {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = ""; // so picking the same file again still triggers a change
    if (files.length) onFiles(files);
  };

  return (
    <>
      <input
        id={id}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        multiple={isMultiple}
        disabled={isDisabled}
        onChange={handleChange}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        aria-disabled={isDisabled || undefined}
        className={cn(
          secondaryButton,
          "min-h-8 px-3 text-caption peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          className,
        )}
      >
        <Icon name="add_photo_alternate" size={16} />
        {label}
      </label>
    </>
  );
};
