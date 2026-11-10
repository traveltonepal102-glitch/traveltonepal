"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { dangerButton, primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import type { LeaveSaveChoice } from "./leaveGuard";

type UnsavedChangesDialogProps = {
  /** The save button's words and what saving does on the website (leaveSaveChoice). */
  choice: LeaveSaveChoice;
  isSaving: boolean;
  onStay: () => void;
  onDiscard: () => void;
  onSave: () => void;
};

/** Leaving an editor with unsaved changes (useLeaveGuard): save first, leave without saving, or keep editing. */
export const UnsavedChangesDialog = ({ choice, isSaving, onStay, onDiscard, onSave }: UnsavedChangesDialogProps) => (
  <AlertDialog.Root open onOpenChange={(isOpen) => !isOpen && !isSaving && onStay()}>
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className="fixed inset-0 z-100 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
      <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-100 flex w-[min(480px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-surface p-5 shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
        <div>
          <AlertDialog.Title className="m-0 font-display text-h4 text-ink">Save your changes before leaving?</AlertDialog.Title>
          <AlertDialog.Description className="m-0 mt-1 text-caption text-text">
            You have changes that aren’t saved yet. If you leave without saving, they are lost.
          </AlertDialog.Description>
        </div>
        <p className="m-0 flex items-start gap-2.5 rounded-lg border border-solid border-saffron-line bg-saffron-tint px-3.5 py-3 text-caption text-saffron-ink">
          <Icon name="info" size={18} className="flex-none" />
          {choice.note}
        </p>
        <div className="flex flex-wrap justify-end gap-2 max-tablet:flex-col-reverse max-tablet:items-stretch">
          <AlertDialog.Close disabled={isSaving} className={secondaryButton}>
            Keep editing
          </AlertDialog.Close>
          <button type="button" onClick={onDiscard} disabled={isSaving} className={cn(dangerButton, "disabled:opacity-70")}>
            Leave without saving
          </button>
          <button type="button" onClick={onSave} disabled={isSaving} className={cn(primaryButton, "disabled:cursor-wait disabled:opacity-70")}>
            {isSaving ? "Saving…" : choice.label}
          </button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
