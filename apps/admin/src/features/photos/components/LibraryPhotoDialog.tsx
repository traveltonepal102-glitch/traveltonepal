"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { iconButton } from "@/components/ui/buttonStyles";

import { useLibrarySearch } from "../hooks/useLibrarySearch";
import { usePhotoUploads } from "../hooks/usePhotoUploads";
import { addPick, togglePick } from "../lib/pickerDraft";
import type { PhotoSize } from "../lib/photoSizes";
import type { NamedPhoto, Photo, PickerPhoto } from "../types";
import { PickerFooter } from "./picker/PickerFooter";
import { PickerGrid } from "./picker/PickerGrid";
import { PickerPreview } from "./picker/PickerPreview";
import { PickerToolbar } from "./picker/PickerToolbar";
import { StopUploadDialog } from "./picker/StopUploadDialog";
import { PhotoSizeNote } from "./PhotoSizeNote";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { UploadProgressList } from "./UploadProgressList";

/** One photo (a click chooses it and closes), or several (clicks change a draft; Done keeps it, Cancel drops it). */
type Pick = { kind: "one"; onChoose: (photo: Photo) => void } | { kind: "many"; max: number; onDone: (photos: Photo[]) => void };

type LibraryPhotoDialogProps = {
  /** e.g. "Photo at the top of the About page". */
  title: string;
  /** The best size for where the photo goes, said beside "Upload". */
  size: PhotoSize;
  /** The photos chosen now: marked, and a gallery's window starts from them. */
  selected: Photo[];
  pick: Pick;
  /** New uploads are tagged with this region (null: none). */
  regionId?: string | null;
  /** The trek being edited: the filter offers its photos, shown first with `startWithTrekPhotos`. */
  trekId?: string | null;
  startWithTrekPhotos?: boolean;
  /** Photos that can't be chosen here (a gallery's window leaves out the cover). */
  excludedIds?: string[];
  onClose: () => void;
};

/**
 * "Choose a photo" in a window: the whole library first (search, filter, "Load more", a large preview), so a photo
 * uploaded once is picked again instead of uploaded again; a new upload goes to the library (location data removed)
 * and is chosen when done. Only the choice goes back to the form.
 */
export const LibraryPhotoDialog = (props: LibraryPhotoDialogProps) => {
  const { title, size, selected, pick, regionId = null, trekId = null, startWithTrekPhotos = false, excludedIds = [], onClose } = props;
  const search = useLibrarySearch(trekId && startWithTrekPhotos ? { kind: "trek", id: trekId } : { kind: "all" });
  const [draft, setDraft] = useState(selected);
  const [previewing, setPreviewing] = useState<PickerPhoto | null>(null);
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);
  const isMany = pick.kind === "many";
  const selectedIds = (isMany ? draft : selected).map((photo) => photo.id);
  const isFull = pick.kind === "many" && draft.length >= pick.max;
  const uploads = usePhotoUploads<"pick">({
    regionId,
    onUploaded: (photo: NamedPhoto) => {
      search.prepend({ ...photo, useCount: null });
      if (pick.kind === "one") {
        pick.onChoose(photo);
        return onClose();
      }
      setDraft((current) => addPick(current, photo, pick.max));
    },
  });

  /** Leaves the window (after `action`), asking first while photos upload: closing stops them. */
  const leave = (action: () => void = () => undefined) => {
    if (!uploads.isUploading) {
      action();
      return onClose();
    }
    setPendingLeave(() => action);
  };
  const choose = (photo: Photo) => {
    if (pick.kind === "one") return leave(() => pick.onChoose(photo));
    setDraft((current) => togglePick(current, photo, pick.max));
  };
  const photos = search.photos && search.photos.filter((photo) => !excludedIds.includes(photo.id));

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && leave()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-95 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Popup
          // The window sits in the editor's React tree: its search box mustn't mark the editor as changed.
          onChange={(event) => event.stopPropagation()}
          className="fixed top-1/2 left-1/2 z-95 flex max-h-[min(760px,calc(100vh-24px))] w-[min(820px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-popover outline-none transition-opacity duration-200 starting:opacity-0"
        >
          <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">Photo library</p>
              <Dialog.Title className="m-0 font-display text-h4 text-ink">{title}</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">
                {pick.kind === "many" ? `Click photos to add or take them away (up to ${pick.max}), or upload new ones.` : "Click a photo to use it, or upload a new one."}
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-2 border-b border-solid border-border bg-page px-5 py-3">
            <PickerToolbar query={search.query} filter={search.filter} trekId={trekId} onQueryChange={search.setQuery} onFilterChange={search.setFilter} />
            <PhotoUploadButton
              label={isMany ? "Upload new photos" : "Upload a new photo"}
              isMultiple={isMany}
              isDisabled={uploads.isUploading || isFull}
              onFiles={(files) => uploads.upload(pick.kind === "many" ? files.slice(0, pick.max - draft.length) : files.slice(0, 1), "pick")}
              className="self-start"
            />
            <PhotoSizeNote size={size} />
            <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} onAnswer={uploads.answer} canUseLibraryPhoto />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {previewing ? (
              <PickerPreview
                photo={previewing}
                pickLabel={!isMany ? "Use this photo" : selectedIds.includes(previewing.id) ? "Take it out" : "Choose it"}
                isPickDisabled={isFull && !selectedIds.includes(previewing.id)}
                onPick={() => {
                  choose(previewing);
                  setPreviewing(null);
                }}
                onBack={() => setPreviewing(null)}
                onTextSaved={(text) => {
                  search.updateText(previewing.id, text);
                  setPreviewing({ ...previewing, ...text });
                }}
              />
            ) : (
              <PickerGrid
                photos={photos}
                isSearching={search.isSearching}
                hasFailed={search.hasFailed}
                hasMore={search.hasMore}
                more={search.more}
                isFiltered={search.query.trim() !== "" || search.filter.kind !== "all"}
                selectedIds={selectedIds}
                isFull={isFull}
                onPick={choose}
                onPreview={setPreviewing}
                onLoadMore={search.loadMore}
                onRetry={search.retry}
              />
            )}
          </div>

          {pick.kind === "many" && <PickerFooter count={draft.length} max={pick.max} onCancel={() => leave()} onDone={() => leave(() => pick.onDone(draft))} />}

          {pendingLeave && (
            <StopUploadDialog
              onKeepUploading={() => setPendingLeave(null)}
              onStop={() => {
                uploads.stop();
                pendingLeave();
                onClose();
              }}
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
