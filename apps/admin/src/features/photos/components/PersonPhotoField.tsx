"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { PhotoUploadButton } from "@/features/photos/components/PhotoUploadButton";
import { UploadProgressList } from "@/features/photos/components/UploadProgressList";
import { usePhotoUploads } from "@/features/photos/hooks/usePhotoUploads";
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
};

/**
 * A person's photo (a trekking guide, an author). Uploads go to the photo library right away (location data
 * removed); which photo the person uses is sent with Save as photoId.
 */
export const PersonPhotoField = ({ initial, name, hint, onEdit, onChange }: PersonPhotoFieldProps) => {
  const [photo, setPhoto] = useState(initial);
  const choose = (next: Photo | null) => {
    setPhoto(next);
    onChange?.(next);
    onEdit();
  };
  const uploads = usePhotoUploads<"portrait">({ regionId: null, onUploaded: (uploaded) => choose(uploaded) });

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
            <PhotoUploadButton label={photo ? "Replace photo" : "Upload photo"} isDisabled={uploads.isUploading} onFiles={(files) => uploads.upload(files.slice(0, 1), "portrait")} />
            {photo && (
              <button type="button" onClick={() => choose(null)} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
                <Icon name="delete" size={16} />
                Remove
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
      </div>
      <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} />
      <input type="hidden" name="photoId" value={photo?.id ?? ""} />
    </div>
  );
};
