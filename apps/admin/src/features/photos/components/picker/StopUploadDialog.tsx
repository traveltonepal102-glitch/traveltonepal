"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";

import { dangerSolidButton, secondaryButton } from "@/components/ui/buttonStyles";

type StopUploadDialogProps = {
  onKeepUploading: () => void;
  onStop: () => void;
};

/** Closing the window while photos upload: asked first; stopping means they aren't uploaded. */
export const StopUploadDialog = ({ onKeepUploading, onStop }: StopUploadDialogProps) => (
  <AlertDialog.Root open onOpenChange={(isOpen) => !isOpen && onKeepUploading()}>
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className="fixed inset-0 z-100 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
      <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-100 flex w-[min(440px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-surface p-5 shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
        <div>
          <AlertDialog.Title className="m-0 font-display text-h4 text-ink">Stop uploading?</AlertDialog.Title>
          <AlertDialog.Description className="m-0 mt-1 text-caption text-text">
            Photos are still uploading. If you close the window now, they won’t be uploaded. A photo already being prepared may still reach the library.
          </AlertDialog.Description>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <AlertDialog.Close className={secondaryButton}>Keep uploading</AlertDialog.Close>
          <button type="button" onClick={onStop} className={dangerSolidButton}>
            Stop and close
          </button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
