"use client";

import { Popover } from "@base-ui/react/popover";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { PhotoUploadButton } from "@/features/photos/components/PhotoUploadButton";
import { UploadProgressList } from "@/features/photos/components/UploadProgressList";
import { usePhotoUploads } from "@/features/photos/hooks/usePhotoUploads";
import type { Photo } from "@/features/photos/types";

type LibraryPhotoPickerProps = {
  label: string;
  photos: Photo[];
  /** Picked photos, in order. */
  pickedIds: string[];
  /** 1 for a single photo (a pick replaces it). */
  max: number;
  /** New uploads are tagged with the guide's website region (null: none). */
  regionId: string | null;
  onChange: (photoIds: string[]) => void;
  onUploaded: (photo: Photo) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** "Choose from library", or upload a new photo (location data removed), for a section's photo(s). */
export const LibraryPhotoPicker = ({ label, photos, pickedIds, max, regionId, onChange, onUploaded }: LibraryPhotoPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSingle = max === 1;
  const pick = (id: string) => {
    if (isSingle) {
      onChange([id]);
      setIsOpen(false);
      return;
    }
    onChange(pickedIds.includes(id) ? pickedIds.filter((other) => other !== id) : [...pickedIds, id].slice(0, max));
  };
  const uploads = usePhotoUploads<"section">({
    regionId,
    onUploaded: (photo) => {
      onUploaded(photo);
      onChange(isSingle ? [photo.id] : [...pickedIds, photo.id].slice(0, max));
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger className={smallButton} disabled={!photos.length}>
            <Icon name="photo_library" size={16} />
            {label}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-100">
              <Popover.Popup className="flex max-h-[min(460px,var(--available-height))] w-110 max-w-[calc(100vw-24px)] flex-col gap-2 overflow-y-auto rounded-lg border border-solid border-border bg-surface p-3 shadow-popover outline-none">
                <Popover.Title className="m-0 font-display text-h4 text-ink">{isSingle ? "Choose a photo" : `Choose up to ${max} photos`}</Popover.Title>
                <div className="grid grid-cols-4 gap-2 max-tablet:grid-cols-3">
                  {photos.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => pick(photo.id)}
                      aria-pressed={pickedIds.includes(photo.id)}
                      aria-label={photo.place ? `Photo taken at ${photo.place}` : "Photo"}
                      className="m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <PhotoImage photo={photo} alt="" sizes="110px" className="block aspect-4/3 h-auto w-full object-cover" />
                    </button>
                  ))}
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <PhotoUploadButton label="Upload" isMultiple={!isSingle} isDisabled={uploads.isUploading} onFiles={(files) => uploads.upload(isSingle ? files.slice(0, 1) : files, "section")} />
      </div>
      <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} />
    </div>
  );
};
