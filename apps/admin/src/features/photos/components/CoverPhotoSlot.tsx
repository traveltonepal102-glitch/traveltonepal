"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { Photo } from "../types";
import { photoAltText } from "../lib/altText";
import { PhotoPlaceField } from "./PhotoPlaceField";
import { PhotoImage } from "./PhotoImage";
import { PhotoUploadButton } from "./PhotoUploadButton";

type CoverPhotoSlotProps = {
  cover: Photo | null;
  /** What the photos show, e.g. "Langtang region": the base of the image text. */
  subject: string;
  isUploading: boolean;
  isGalleryFull: boolean;
  onUpload: (files: File[]) => void;
  onMoveToGallery: () => void;
  onRemove: () => void;
  onChangePlace: (place: string) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** The one cover photo: region card and page header. Empty, it invites an upload. */
export const CoverPhotoSlot = ({
  cover,
  subject,
  isUploading,
  isGalleryFull,
  onUpload,
  onMoveToGallery,
  onRemove,
  onChangePlace,
}: CoverPhotoSlotProps) => {
  if (!cover) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line-strong bg-page px-6 py-10 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-tint text-brand">
          <Icon name="image" size={26} />
        </span>
        <p className="m-0 max-w-105 text-caption text-muted-foreground">
          No cover photo yet. A wide landscape photo works best: it fills the region card and the top of the region page.
        </p>
        <PhotoUploadButton label="Upload a cover photo" isDisabled={isUploading} onFiles={(files) => onUpload(files.slice(0, 1))} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 tablet:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-xl bg-navy">
        <PhotoImage
          // A new cover gets a fresh image (blurred preview first) instead of showing the old one while loading.
          key={cover.id}
          photo={cover}
          alt={photoAltText(cover, subject)}
          sizes="(min-width: 1101px) 520px, 100vw"
          className="block aspect-video h-auto w-full object-cover"
        />
        <span className="absolute top-2 left-2 rounded-sm bg-saffron px-2 py-0.5 text-[11px] font-extrabold text-navy">Cover</span>
      </div>
      <div className="flex flex-col gap-3">
        <PhotoPlaceField photo={cover} onChange={onChangePlace} />
        <div className="mt-auto flex flex-wrap gap-2">
          <PhotoUploadButton label="Replace" isDisabled={isUploading} onFiles={(files) => onUpload(files.slice(0, 1))} />
          <button type="button" onClick={onMoveToGallery} disabled={isGalleryFull} className={smallButton}>
            <Icon name="photo_library" size={16} />
            Move to gallery
          </button>
          <button type="button" onClick={onRemove} className={smallButton}>
            <Icon name="delete" size={16} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
