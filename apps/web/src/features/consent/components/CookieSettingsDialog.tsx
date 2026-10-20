"use client";

import { Icon } from "@ttn/ui/icon";
import { useEffect, useRef, useState } from "react";

import { ALL_ALLOWED, ONLY_NECESSARY } from "../consent";
import type { ConsentChoices } from "../consent";
import { ConsentButton } from "./ConsentButton";
import { ConsentOptions } from "./ConsentOptions";

type CookieSettingsDialogProps = {
  initial: ConsentChoices;
  onClose: () => void;
  onSave: (choices: ConsentChoices) => void;
};

/**
 * "Cookie settings" window, rendered only while open. A native modal <dialog> (showModal): it traps
 * focus, closes on Esc or the phone's back gesture, and returns focus to the button that opened it.
 */
export const CookieSettingsDialog = ({ initial, onClose, onSave }: CookieSettingsDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(initial);

  // Opening as a modal is a browser call, so it runs once the element exists.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cookie-settings-title"
      onClose={onClose}
      className="m-auto max-h-[calc(100%-2rem)] w-140 max-w-[calc(100%-2rem)] overflow-y-auto rounded-2xl bg-surface p-0 text-text shadow-popover backdrop:bg-[#071424]/60"
    >
      <div className="flex items-center justify-between gap-2.5 border-b border-line px-5.5 py-4.5">
        <h2 id="cookie-settings-title" className="inline-flex items-center gap-2.5 text-xl font-extrabold">
          <Icon name="tune" size={22} className="text-brand" />
          Cookie settings
        </h2>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close"
          className="inline-flex size-9.5 cursor-pointer items-center justify-center rounded-full border border-line text-text hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="flex flex-col gap-3.5 px-5.5 pt-3.5">
        <p className="text-body-sm text-text">Choose what we may load. You can change this later from the footer of any page.</p>
        <ConsentOptions choices={draft} onChange={setDraft} />
      </div>
      <div className="mt-3.5 grid gap-2 border-t border-line px-5.5 py-4.5 sm:grid-cols-3">
        <ConsentButton onClick={() => onSave(ONLY_NECESSARY)}>Reject all</ConsentButton>
        <ConsentButton onClick={() => onSave(draft)}>Save my choices</ConsentButton>
        <ConsentButton onClick={() => onSave(ALL_ALLOWED)} isPrimary>
          Accept all
        </ConsentButton>
      </div>
    </dialog>
  );
};
