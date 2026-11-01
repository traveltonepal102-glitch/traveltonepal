"use client";

import { Icon } from "@ttn/ui/icon";

import { usageLabel } from "../../lib/pickerSearch";
import type { PickerPhoto } from "../../types";
import { PhotoImage } from "../PhotoImage";

type PickerTileProps = {
  photo: PickerPhoto;
  isSelected: boolean;
  /** A gallery's window is full: only chosen photos can be clicked (to take them away). */
  isDisabled: boolean;
  onPick: () => void;
  onPreview: () => void;
};

const photoName = (photo: PickerPhoto) => photo.place || photo.originalName || "No place given";

/** One library photo in the window: click to choose it; the corner button shows it large first. */
export const PickerTile = ({ photo, isSelected, isDisabled, onPick, onPreview }: PickerTileProps) => (
  <div className="relative">
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={isDisabled}
      onClick={onPick}
      className="m-0 block w-full cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 text-left aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
    >
      <PhotoImage photo={photo} alt="" sizes="180px" className="block aspect-4/3 h-auto w-full object-cover" />
      <span className="flex flex-col gap-0.5 bg-surface px-2 py-1">
        <span className="truncate text-[11px] font-semibold text-text">{photoName(photo)}</span>
        {photo.useCount !== null && (
          <span className={photo.useCount ? "text-[10px] text-muted-foreground" : "text-[10px] font-bold text-brand"}>{usageLabel(photo.useCount)}</span>
        )}
      </span>
      {isSelected && (
        <span className="absolute top-1.5 left-1.5 inline-flex rounded-full bg-surface text-brand">
          <Icon name="check_circle" size={22} />
        </span>
      )}
    </button>
    <button
      type="button"
      onClick={onPreview}
      aria-label={`Show ${photoName(photo)} large`}
      title="Show large"
      className="absolute top-1.5 right-1.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-sm border-0 bg-surface/90 text-ink hover:text-brand focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Icon name="zoom_in" size={18} />
    </button>
  </div>
);
