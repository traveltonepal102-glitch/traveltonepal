"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";

import { iconButton } from "@/components/ui/buttonStyles";

import { usePhotoUploads } from "../hooks/usePhotoUploads";
import type { Photo } from "../types";
import { PhotoImage } from "./PhotoImage";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { UploadProgressList } from "./UploadProgressList";

type LibraryPhotoDialogProps = {
  /** e.g. "Photo at the top of the About page". */
  title: string;
  /** null while they load (a text editor loads them when the window opens). */
  photos: Photo[] | null;
  /** The photos couldn't be loaded. */
  loadError?: boolean;
  selectedId: string | null;
  onChoose: (photo: Photo) => void;
  onClose: () => void;
};

const TILE =
  "m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 text-left aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring";

/**
 * "Choose a photo" in a window: any photo from the library (newest first), or a new upload (it goes to the library,
 * location data removed, and is chosen when done). Only the choice goes back to the form.
 */
export const LibraryPhotoDialog = ({ title, photos, loadError = false, selectedId, onChoose, onClose }: LibraryPhotoDialogProps) => {
  const choose = (photo: Photo) => {
    onChoose(photo);
    onClose();
  };
  const uploads = usePhotoUploads<"pick">({ regionId: null, onUploaded: (photo) => choose(photo) });

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-95 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-95 flex max-h-[min(680px,calc(100vh-24px))] w-[min(760px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
          <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
            <div className="min-w-0">
              <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">Photo library</p>
              <Dialog.Title className="m-0 font-display text-h4 text-ink">{title}</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">Click a photo to use it, or upload a new one.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-2 border-b border-solid border-border bg-page px-5 py-3">
            <PhotoUploadButton label="Upload a new photo" isDisabled={uploads.isUploading} onFiles={(files) => uploads.upload(files.slice(0, 1), "pick")} className="self-start" />
            <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {loadError ? (
              <p className="m-0 text-body-sm text-danger">The photo library couldn’t be loaded. Close this window and try again, or upload a new photo above.</p>
            ) : !photos ? (
              <p className="m-0 text-body-sm text-muted-foreground">Loading photos…</p>
            ) : photos.length ? (
              <div className="grid grid-cols-4 gap-2.5 max-tablet:grid-cols-2">
                {photos.map((photo) => (
                  <button key={photo.id} type="button" aria-pressed={photo.id === selectedId} onClick={() => choose(photo)} className={TILE}>
                    <PhotoImage photo={photo} alt="" sizes="180px" className="block aspect-4/3 h-auto w-full object-cover" />
                    <span className="block truncate bg-surface px-2 py-1 text-[11px] font-semibold text-text">{photo.place || "No place given"}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="m-0 text-body-sm text-muted-foreground">The library has no photos yet. Upload one above.</p>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
