"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import { useActionState } from "react";

import type { EditorSaveState } from "@/components/editor/types";
import { iconButton, primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";

import { savePhotoText } from "../actions/savePhotoText";
import { PHOTO_LIMITS as LIMIT } from "../constants";
import { photoTextSchema, readPhotoTextForm } from "../schemas/photoTextSchema";
import type { Photo, PhotoText } from "../types";
import { PhotoImage } from "./PhotoImage";

type PhotoTextDialogProps = {
  photo: Photo;
  onClose: () => void;
  /** After a save, with what was saved (the picker shows it without loading again). */
  onSaved?: (text: PhotoText) => void;
};

const IDLE: EditorSaveState = { status: "idle" };

/**
 * "Alt text and caption" for one library photo, in a window: what it shows (alt text), the caption shown when it is
 * opened full size, and where it was taken. They belong to the photo, so every page that uses it shows them.
 */
export const PhotoTextDialog = ({ photo, onClose, onSaved }: PhotoTextDialogProps) => {
  const [state, save, isSaving] = useActionState(async (previous: EditorSaveState, formData: FormData) => {
    const next = await savePhotoText(photo.id, previous, formData);
    if (next.status === "saved") {
      onSaved?.(photoTextSchema.parse(readPhotoTextForm(formData)));
      onClose();
    }
    return next;
  }, IDLE);
  const errors = state.status === "error" ? state.fieldErrors : {};

  return (
    <Dialog.Root open onOpenChange={(isOpen) => !isOpen && !isSaving && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-100 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100vh-24px)] w-[min(560px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-surface shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
          <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="m-0 font-display text-h4 text-ink">Alt text and caption</Dialog.Title>
              <Dialog.Description className="m-0 text-caption text-muted-foreground">Saved with the photo: every page that uses it shows them.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" disabled={isSaving} className={iconButton}>
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>

          {/* Not part of an editor's form: its typing and saving stay here (React events bubble through portals). */}
          <form action={save} noValidate onChange={(event) => event.stopPropagation()} onSubmit={(event) => event.stopPropagation()} className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
              {state.status === "error" && <FormAlert message={state.message} />}
              <PhotoImage photo={photo} alt="" sizes="520px" className="block max-h-56 w-full rounded-lg bg-navy object-contain" />
              <TextField
                name="altText"
                label="Alt text"
                labelNote="recommended"
                defaultValue={photo.altText}
                placeholder="Trekkers crossing Larkya La pass at sunrise"
                hint="What the photo shows, in one plain sentence. Read out to blind visitors and used by Google Images. Left empty, the website uses the place and the page’s name."
                maxLength={LIMIT.altText}
                showCount
                error={errors.altText}
              />
              <TextField
                name="caption"
                label="Caption"
                labelNote="optional"
                multiline
                rows={3}
                defaultValue={photo.caption}
                placeholder="The pass is usually crossed before 9 am, when the wind is calm."
                hint="Shown under the photo when a visitor opens it full size."
                maxLength={LIMIT.caption}
                showCount
                error={errors.caption}
              />
              <TextField
                name="place"
                label="Taken at"
                labelNote="optional"
                defaultValue={photo.place}
                placeholder="Kyanjin Gompa"
                maxLength={LIMIT.place}
                error={errors.place}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-solid border-border px-5 py-3">
              <Dialog.Close type="button" disabled={isSaving} className={secondaryButton}>
                Cancel
              </Dialog.Close>
              <button type="submit" disabled={isSaving} className={primaryButton}>
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
