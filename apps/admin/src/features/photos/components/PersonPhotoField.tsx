"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { EditPhotoTextButton } from "@/features/photos/components/EditPhotoTextButton";
import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { PhotoSizeNote } from "@/features/photos/components/PhotoSizeNote";
import type { PhotoSize } from "@/features/photos/lib/photoSizes";
import type { Photo } from "@/features/photos/types";

type PersonPhotoFieldProps = {
  initial: Photo | null;
  /** The person's name, for the image text. */
  name: string;
  /** Under the buttons, e.g. "Square photo, face clearly visible." */
  hint: string;
  onEdit: () => void;
  /** The photo the guide uses now, for the card preview. */
  onChange?: (photo: Photo | null) => void;
  /** The form field it is sent as (default photoId). */
  fieldName?: string;
  /** The best size for where the photo goes (default a person's square photo). */
  size?: PhotoSize;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/**
 * A person's photo (a trekking guide, an author), chosen in the photo library window (an upload goes to the
 * library right away, location data removed); which photo the person uses is sent with Save as photoId.
 */
export const PersonPhotoField = ({ initial, name, hint, onEdit, onChange, fieldName = "photoId", size = "person" }: PersonPhotoFieldProps) => {
  const [photo, setPhoto] = useState(initial);
  const [isOpen, setIsOpen] = useState(false);
  const choose = (next: Photo | null) => {
    setPhoto(next);
    onChange?.(next);
    onEdit();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3.5">
        <span className="inline-flex size-21 flex-none items-center justify-center overflow-hidden rounded-xl bg-brand-tint text-brand">
          {photo ? (
            <PhotoImage key={photo.id} photo={photo} alt={name.trim() || "Photo"} sizes="84px" className="h-full w-full object-cover" />
          ) : (
            <Icon name="add_photo_alternate" size={34} />
          )}
        </span>
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsOpen(true)} className={smallButton}>
              <Icon name={photo ? "image" : "add_photo_alternate"} size={16} />
              {photo ? "Change photo" : "Choose photo"}
            </button>
            {photo && (
              <>
                <button type="button" onClick={() => choose(null)} className={smallButton}>
                  <Icon name="delete" size={16} />
                  Remove
                </button>
                <EditPhotoTextButton photo={photo} className="min-h-8" />
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </div>
      <PhotoSizeNote size={size} />
      <input type="hidden" name={fieldName} value={photo?.id ?? ""} />
      {isOpen && (
        <LibraryPhotoDialog
          title={name.trim() || "Photo"}
          size={size}
          selected={photo ? [photo] : []}
          pick={{ kind: "one", onChoose: choose }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
