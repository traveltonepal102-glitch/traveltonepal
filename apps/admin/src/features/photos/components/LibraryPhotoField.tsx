"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { Photo } from "../types";
import { LibraryPhotoDialog } from "./LibraryPhotoDialog";
import { PhotoImage } from "./PhotoImage";

type LibraryPhotoFieldProps = {
  /** The form field it is sent as (the photo's id, or "" for none). */
  name: string;
  label: string;
  hint?: string;
  initial: Photo | null;
  /** The library photos to choose from. */
  photos: Photo[];
  /** Said while no photo is chosen. */
  emptyText?: string;
  onEdit: () => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** A photo from the library (or a new upload) for one place on a page: a preview, Choose/Change and Remove. */
export const LibraryPhotoField = ({ name, label, hint, initial, photos, emptyText = "No photo: the page uses its own default.", onEdit }: LibraryPhotoFieldProps) => {
  const [photo, setPhoto] = useState(initial);
  const [isOpen, setIsOpen] = useState(false);
  const choose = (next: Photo | null) => {
    setPhoto(next);
    onEdit();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">{label}</span>
      <div className="flex items-center gap-3 rounded-lg border border-solid border-border bg-surface p-2">
        <span className="flex aspect-4/3 w-28 flex-none items-center justify-center overflow-hidden rounded-md bg-page text-subtle">
          {photo ? <PhotoImage key={photo.id} photo={photo} alt="" sizes="112px" className="block h-full w-full object-cover" /> : <Icon name="add_photo_alternate" size={28} />}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-caption text-text">{photo ? photo.place || "Photo from the library" : emptyText}</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsOpen(true)} className={smallButton}>
              <Icon name="image" size={16} />
              {photo ? "Change" : "Choose photo"}
            </button>
            {photo && (
              <button type="button" onClick={() => choose(null)} className={smallButton}>
                <Icon name="delete" size={16} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input type="hidden" name={name} value={photo?.id ?? ""} />
      {isOpen && <LibraryPhotoDialog title={label} photos={photos} selectedId={photo?.id ?? null} onChoose={choose} onClose={() => setIsOpen(false)} />}
    </div>
  );
};
