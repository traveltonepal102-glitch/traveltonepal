"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { Photo, PhotoText } from "../types";
import { PhotoTextDialog } from "./PhotoTextDialog";

type EditPhotoTextButtonProps = {
  photo: Photo;
  /** After a save, with what was saved, so the page can show it. */
  onSaved?: (text: PhotoText) => void;
  /** "icon": a small square button for photo tiles; the default shows its label. */
  variant?: "label" | "icon";
  className?: string;
};

const LABEL = "Alt text and caption";

/**
 * Opens the "Alt text and caption" window for a library photo, anywhere a photo is shown. It remembers what it
 * saved, so opening it again shows the new text even where the page still holds the photo as it was loaded.
 */
export const EditPhotoTextButton = ({ photo, onSaved, variant = "label", className }: EditPhotoTextButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState<{ photoId: string; text: PhotoText } | null>(null);
  const current = saved?.photoId === photo.id ? { ...photo, ...saved.text } : photo;
  const handleSaved = (text: PhotoText) => {
    setSaved({ photoId: photo.id, text });
    onSaved?.(text);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={LABEL}
          title={LABEL}
          className={cn(secondaryButton, "size-8 min-h-8 flex-none rounded-sm p-0", className)}
        >
          <Icon name="edit" size={16} />
        </button>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} className={cn(secondaryButton, "min-h-9 px-3 text-caption", className)}>
          <Icon name="edit" size={16} />
          {LABEL}
        </button>
      )}
      {isOpen && <PhotoTextDialog photo={current} onSaved={handleSaved} onClose={() => setIsOpen(false)} />}
    </>
  );
};
