"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import type { Photo } from "@/features/photos/types";

type LibraryPhotoPickerProps = {
  label: string;
  /** The picked photos, in order. */
  picked: Photo[];
  /** 1 for a single photo (a pick replaces it). */
  max: number;
  /** New uploads are tagged with the guide's website region (null: none). */
  regionId: string | null;
  onChange: (photoIds: string[]) => void;
  /** Keeps each chosen photo for the section's preview. */
  onChosen: (photo: Photo) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption self-start");

/** A section's photo(s), chosen in the photo library window (or uploaded there, location data removed). */
export const LibraryPhotoPicker = ({ label, picked, max, regionId, onChange, onChosen }: LibraryPhotoPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const keep = (photos: Photo[]) => {
    photos.forEach(onChosen);
    onChange(photos.map((photo) => photo.id));
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={smallButton}>
        <Icon name="photo_library" size={16} />
        {label}
      </button>
      {isOpen && (
        <LibraryPhotoDialog
          title={max === 1 ? "Choose a photo" : `Choose up to ${max} photos`}
          selected={picked}
          pick={max === 1 ? { kind: "one", onChoose: (photo) => keep([photo]) } : { kind: "many", max, onDone: keep }}
          regionId={regionId}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
