"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Icon } from "@ttn/ui/icon";
import { startTransition, useActionState } from "react";

import { dangerButton, dangerSolidButton, secondaryButton } from "@/components/ui/buttonStyles";

import { RemoveBlockerList } from "./RemoveBlockerList";
import type { RemoveBlockerGroup, RemoveState } from "./types";

const WORDS = {
  remove: { label: "Remove", blocked: "can't be removed yet", confirm: "Yes, remove", pending: "Removing…" },
  delete: { label: "Delete", blocked: "can't be deleted yet", confirm: "Yes, delete", pending: "Deleting…" },
} as const;

type ConfirmRemoveButtonProps = {
  /** What is removed, e.g. the guide's name. */
  name: string;
  /** What else happens, e.g. "They also leave the 2 treks they are on." */
  consequence?: string;
  /** The remove Server Action, bound to the item's id. */
  action: (state: RemoveState) => Promise<RemoveState>;
  /** "delete" for something with its own page (a region); "remove" for someone on a list. */
  verb?: keyof typeof WORDS;
  /** What still uses it. While there is any, the window lists it instead of offering to remove. */
  blockers?: readonly RemoveBlockerGroup[];
};

/**
 * "Remove" (or "Delete"), then a confirm window: it can't be undone. When something still uses the item, the window
 * says what, with links to fix it, and has no remove button. Not a form button: it never saves the form.
 */
export const ConfirmRemoveButton = ({ name, consequence, action, verb = "remove", blockers = [] }: ConfirmRemoveButtonProps) => {
  const [state, remove, isRemoving] = useActionState(action, { error: null });
  const words = WORDS[verb];
  const isBlocked = blockers.length > 0;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className={dangerButton}>
        <Icon name="delete" size={18} />
        {words.label}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-100 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100vh-24px)] w-[min(480px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-xl bg-surface p-5 shadow-popover outline-none transition-opacity duration-200 starting:opacity-0">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-full bg-danger-tint text-danger">
              <Icon name={isBlocked ? "warning" : "delete"} size={22} />
            </span>
            <div className="min-w-0">
              <AlertDialog.Title className="m-0 font-display text-h4 text-ink">
                {isBlocked ? `${name} ${words.blocked}` : `${words.label} ${name}?`}
              </AlertDialog.Title>
              <AlertDialog.Description className="m-0 mt-1 text-caption text-text">
                {isBlocked
                  ? `It is still used by what's listed below. Take it off each one, then ${words.label.toLowerCase()} it again.`
                  : `This can't be undone.${consequence ? ` ${consequence}` : ""}`}
              </AlertDialog.Description>
            </div>
          </div>

          {isBlocked && <RemoveBlockerList groups={blockers} />}
          {state.error && (
            <p role="alert" className="m-0 rounded-md bg-danger-tint px-3 py-2 text-caption font-bold text-danger">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialog.Close disabled={isRemoving} className={secondaryButton}>
              {isBlocked ? "Close" : "Cancel"}
            </AlertDialog.Close>
            {!isBlocked && (
              <button type="button" disabled={isRemoving} onClick={() => startTransition(() => remove())} className={dangerSolidButton}>
                {isRemoving ? words.pending : words.confirm}
              </button>
            )}
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
