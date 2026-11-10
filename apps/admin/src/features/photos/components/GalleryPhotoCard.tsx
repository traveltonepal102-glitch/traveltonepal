"use client";

import { Icon } from "@ttn/ui/icon";

import { ghostIconButton } from "@/components/ui/buttonStyles";

import { photoAltText } from "../lib/altText";
import type { Photo, PhotoText } from "../types";
import { EditPhotoTextButton } from "./EditPhotoTextButton";
import { PhotoImage } from "./PhotoImage";
import { PhotoTextSummary } from "./PhotoTextSummary";

type GalleryPhotoCardProps = {
  photo: Photo;
  /** 0-based position, shown as 1, 2, 3… */
  index: number;
  count: number;
  /** What the photos show, e.g. "Langtang region": the base of the image text. */
  subject: string;
  onMove: (to: number) => void;
  onMakeCover: () => void;
  onRemove: () => void;
  /** After its alt text, caption or place was saved in their window. */
  onTextSaved: (text: PhotoText) => void;
};

/** One gallery photo: its number, alt text, caption and place (edited in their window), and buttons to reorder, make cover or remove. */
export const GalleryPhotoCard = ({
  photo,
  index,
  count,
  subject,
  onMove,
  onMakeCover,
  onRemove,
  onTextSaved,
}: GalleryPhotoCardProps) => {
  const number = index + 1;
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-solid border-border bg-surface">
      <div className="relative bg-navy">
        <PhotoImage
          photo={photo}
          alt={photoAltText(photo, subject)}
          sizes="(min-width: 1101px) 280px, (min-width: 701px) 45vw, 100vw"
          className="block aspect-4/3 h-auto w-full object-cover"
        />
        <span className="absolute top-2 left-2 rounded-sm bg-navy/85 px-2 py-0.5 text-[11px] font-extrabold text-white">{number}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-2.5">
        <PhotoTextSummary text={photo} />
        <div className="mt-auto flex items-center gap-0.5">
          <button type="button" className={ghostIconButton} aria-label={`Move photo ${number} earlier`} disabled={index === 0} onClick={() => onMove(index - 1)}>
            <Icon name="arrow_back" size={18} />
          </button>
          <button
            type="button"
            className={ghostIconButton}
            aria-label={`Move photo ${number} later`}
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
          >
            <Icon name="arrow_forward" size={18} />
          </button>
          <span className="flex-1" />
          <EditPhotoTextButton photo={photo} onSaved={onTextSaved} variant="icon" />
          <button type="button" className={ghostIconButton} aria-label={`Make photo ${number} the cover`} title="Make cover" onClick={onMakeCover}>
            <Icon name="star" size={18} />
          </button>
          <button type="button" className={ghostIconButton} aria-label={`Remove photo ${number}`} title="Remove from this region" onClick={onRemove}>
            <Icon name="delete" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
