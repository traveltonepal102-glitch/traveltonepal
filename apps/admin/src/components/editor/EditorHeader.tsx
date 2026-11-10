"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useRef } from "react";
import type { ReactNode } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import { leaveSaveChoice } from "./leaveGuard";
import type { EditorSaveState } from "./types";
import { UnsavedChangesDialog } from "./UnsavedChangesDialog";
import type { SaveStatusTone } from "./useEditorForm";
import { useLeaveGuard } from "./useLeaveGuard";

type EditorHeaderProps = {
  /** The list this item belongs to, e.g. { href: "/treks", label: "Treks" }. */
  back: { href: string; label: string };
  title: string;
  status: string;
  statusTone: SaveStatusTone;
  saveLabel: string;
  isSaving: boolean;
  /** Unsaved changes: leaving the editor asks to save first (useLeaveGuard). */
  isDirty: boolean;
  /** The last save result (useEditorForm's `state`), to leave once the dialog's Save has worked. */
  saveState: EditorSaveState;
  /** Extra controls before Save, e.g. the status picker. */
  children?: ReactNode;
};

/** The dot before the save status (also on screens with their own heading, e.g. Site settings). */
export const SAVE_STATUS_DOT: Record<SaveStatusTone, string> = {
  saved: "bg-whatsapp",
  unsaved: "bg-saffron",
  neutral: "bg-subtle",
};

/** The value of the form's Status picker (`status`), or null for an editor without one. */
const statusOf = (form: HTMLFormElement | null | undefined) => {
  const field = form?.elements.namedItem("status");
  return field instanceof HTMLSelectElement ? field.value : null;
};

/**
 * Sticky bar under the top bar: back to the list, the item's name and save state, and Save. On phones, extra
 * controls and Save move to a second line, so nothing runs off the screen. With unsaved changes, leaving through a
 * link or the browser's Back first asks to save (as a draft for a draft).
 */
export const EditorHeader = ({ back, title, status, statusTone, saveLabel, isSaving, isDirty, saveState, children }: EditorHeaderProps) => {
  const saveButton = useRef<HTMLButtonElement>(null);
  const leave = useLeaveGuard({ isDirty, saveState, readStatus: () => statusOf(saveButton.current?.form) });
  return (
    <div className="sticky top-16.25 z-30 -mx-8 -mt-7 flex flex-wrap items-center gap-3 border-b border-solid border-border bg-surface px-8 py-3 max-tablet:top-15.25 max-tablet:-mx-4 max-tablet:-mt-4 max-tablet:gap-2.5 max-tablet:px-4">
      <Link href={back.href} aria-label={`Back to ${back.label.toLowerCase()}`} className={cn(secondaryButton, "min-h-8 px-2.5 text-caption")}>
        <Icon name="arrow_back" size={18} />
        <span className="max-tablet:hidden">{back.label}</span>
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="m-0 truncate font-display text-h4 text-ink">{title}</h1>
        <p role="status" className="m-0 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden="true" className={cn("size-2 flex-none rounded-full", SAVE_STATUS_DOT[statusTone])} />
          {status}
        </p>
      </div>
      <div className={cn("flex items-center gap-3", children && "max-tablet:w-full max-tablet:gap-2.5")}>
        {children}
        <button ref={saveButton} type="submit" disabled={isSaving} className={cn(primaryButton, "flex-none disabled:cursor-wait disabled:opacity-70")}>
          {isSaving ? "Saving…" : saveLabel}
        </button>
      </div>
      {leave.isAsking && (
        <UnsavedChangesDialog
          choice={leaveSaveChoice(leave.status, saveLabel)}
          isSaving={leave.isSavingToLeave}
          onStay={leave.stay}
          onDiscard={leave.discard}
          onSave={() => leave.saveThenLeave(() => saveButton.current?.click())}
        />
      )}
    </div>
  );
};
