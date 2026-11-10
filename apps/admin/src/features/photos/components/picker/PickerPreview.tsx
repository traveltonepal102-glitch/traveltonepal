"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useEffect, useState } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import { listPickerPhotoUses } from "../../actions/listPickerPhotoUses";
import type { PhotoText, PickerPhoto } from "../../types";
import { EditPhotoTextButton } from "../EditPhotoTextButton";
import { PhotoImage } from "../PhotoImage";

type PickerPreviewProps = {
  photo: PickerPhoto;
  /** "Use this photo", "Add to the gallery" or "Take out of the gallery". */
  pickLabel: string;
  isPickDisabled: boolean;
  onPick: () => void;
  onBack: () => void;
  /** After its alt text, caption or place was saved here. */
  onTextSaved: (text: PhotoText) => void;
};

/** One photo large, with its file and where it is used, before choosing it. */
export const PickerPreview = ({ photo, pickLabel, isPickDisabled, onPick, onBack, onTextSaved }: PickerPreviewProps) => {
  const [uses, setUses] = useState<{ photoId: string; labels: string[] | null } | null>(null);

  useEffect(() => {
    let isCurrent = true;
    listPickerPhotoUses(photo.id)
      .then((labels) => isCurrent && setUses({ photoId: photo.id, labels }))
      .catch(() => isCurrent && setUses({ photoId: photo.id, labels: null }));
    return () => {
      isCurrent = false;
    };
  }, [photo.id]);
  const shown = uses?.photoId === photo.id ? uses : null;

  return (
    <div className="flex flex-col gap-4">
      <PhotoImage photo={photo} alt="" sizes="(min-width: 800px) 720px, 100vw" className="block max-h-[min(420px,50vh)] w-full rounded-lg bg-navy object-contain" />
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-caption">
        <dt className="font-semibold text-ink">Alt text</dt>
        <dd className={cn("m-0", photo.altText ? "text-text" : "font-semibold text-saffron-ink")}>{photo.altText || "Not written yet"}</dd>
        <dt className="font-semibold text-ink">Caption</dt>
        <dd className="m-0 text-text">{photo.caption || "None"}</dd>
        <dt className="font-semibold text-ink">Taken at</dt>
        <dd className="m-0 text-text">{photo.place || "No place given"}</dd>
        <dt className="font-semibold text-ink">File</dt>
        <dd className="m-0 break-all text-text">{photo.originalName || "Not known"}</dd>
        <dt className="font-semibold text-ink">Size</dt>
        <dd className="m-0 text-text">
          {photo.width} × {photo.height} px
        </dd>
        <dt className="font-semibold text-ink">Used in</dt>
        <dd className="m-0 text-text">
          {!shown ? "Loading…" : !shown.labels ? "Couldn’t be loaded." : shown.labels.length ? (
            <ul className="m-0 list-none p-0">
              {shown.labels.map((label, index) => (
                <li key={`${index}-${label}`}>{label}</li>
              ))}
            </ul>
          ) : (
            "Not used yet"
          )}
        </dd>
      </dl>
      <div className="flex flex-wrap justify-between gap-2">
        <span className="flex flex-wrap gap-2">
          <button type="button" onClick={onBack} className={cn(secondaryButton, "min-h-9 px-4 text-caption")}>
            <Icon name="arrow_back" size={16} />
            Back to the photos
          </button>
          <EditPhotoTextButton photo={photo} onSaved={onTextSaved} />
        </span>
        <button type="button" onClick={onPick} disabled={isPickDisabled} className={cn(primaryButton, "min-h-9 px-4 text-caption disabled:cursor-not-allowed disabled:opacity-50")}>
          {pickLabel}
        </button>
      </div>
    </div>
  );
};
