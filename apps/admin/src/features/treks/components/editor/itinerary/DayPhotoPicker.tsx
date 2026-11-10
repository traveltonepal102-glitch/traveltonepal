"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { labelClass } from "@/components/ui/formStyles";
import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

type DayPhotoPickerProps = {
  photo: Photo | null;
  /** The saved trek's id: the window shows this trek's photos first (null for a new trek: all photos). */
  trekId: string | null;
  onChange: (photo: Photo | null) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** A day's optional photo, from the photo library (this trek's photos first). Sent as dayPhotoId. */
export const DayPhotoPicker = ({ photo, trekId, onChange }: DayPhotoPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>Photo</span>
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg bg-navy text-white/40">
        {photo ? <PhotoImage key={photo.id} photo={photo} alt="" sizes="(min-width: 1200px) 220px, 50vw" className="h-full w-full object-cover" /> : <Icon name="image" size={32} />}
        <span className="absolute bottom-2 left-2 flex gap-2">
          <button type="button" onClick={() => setIsOpen(true)} className={smallButton}>
            {photo ? "Change" : "Choose a photo"}
          </button>
          {photo && (
            <button type="button" onClick={() => onChange(null)} className={smallButton}>
              <Icon name="close" size={16} />
              No photo
            </button>
          )}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">Optional. Its description comes from the photo library.</span>
      <input type="hidden" name="dayPhotoId" value={photo?.id ?? ""} />
      {isOpen && (
        <LibraryPhotoDialog
          title="Photo for this day"
          size="landscape"
          selected={photo ? [photo] : []}
          pick={{ kind: "one", onChoose: onChange }}
          trekId={trekId}
          startWithTrekPhotos
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
