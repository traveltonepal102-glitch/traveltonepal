"use client";

import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { PickerPhoto } from "../../types";
import { PickerTile } from "./PickerTile";

type PickerGridProps = {
  /** null until the first answer. */
  photos: PickerPhoto[] | null;
  isSearching: boolean;
  hasFailed: boolean;
  hasMore: boolean;
  more: "idle" | "loading" | "failed";
  /** Words typed or a filter chosen: an empty answer says "nothing found", not "empty library". */
  isFiltered: boolean;
  selectedIds: string[];
  isFull: boolean;
  onPick: (photo: PickerPhoto) => void;
  onPreview: (photo: PickerPhoto) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

const note = "m-0 text-body-sm text-muted-foreground";

/** The photos found, newest first, with "Load more" while there are more. */
export const PickerGrid = ({ photos, isSearching, hasFailed, hasMore, more, isFiltered, selectedIds, isFull, onPick, onPreview, onLoadMore, onRetry }: PickerGridProps) => {
  if (hasFailed) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="m-0 text-body-sm text-danger">The photo library couldn’t be loaded. Check your connection, or upload a new photo above.</p>
        <button type="button" onClick={onRetry} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
          Try again
        </button>
      </div>
    );
  }
  if (!photos) return <p className={note}>Loading photos…</p>;
  if (!photos.length && !isSearching) {
    return <p className={note}>{isFiltered ? "No photos match. Try other words or another filter, or upload a new photo above." : "The library has no photos yet. Upload one above."}</p>;
  }

  return (
    <div aria-busy={isSearching} className={cn("flex flex-col gap-4 transition-opacity", isSearching && "opacity-50")}>
      <div className="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2">
        {photos.map((photo) => {
          const isSelected = selectedIds.includes(photo.id);
          return (
            <PickerTile key={photo.id} photo={photo} isSelected={isSelected} isDisabled={isFull && !isSelected} onPick={() => onPick(photo)} onPreview={() => onPreview(photo)} />
          );
        })}
      </div>
      {hasMore && (
        <button type="button" onClick={onLoadMore} disabled={more === "loading"} className={cn(secondaryButton, "min-h-9 self-center px-4 text-caption")}>
          {more === "loading" ? "Loading…" : more === "failed" ? "Couldn’t load more. Try again" : "Load more photos"}
        </button>
      )}
    </div>
  );
};
