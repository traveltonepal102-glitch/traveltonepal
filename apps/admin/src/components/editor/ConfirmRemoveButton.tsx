"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { startTransition, useActionState, useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { RemoveState } from "./types";

type ConfirmRemoveButtonProps = {
  /** What is removed, e.g. the guide's name. */
  name: string;
  /** What else happens, e.g. "They also leave the 2 treks they are on." */
  consequence?: string;
  /** The remove Server Action, bound to the item's id. */
  action: (state: RemoveState) => Promise<RemoveState>;
};

const dangerButton = cn(secondaryButton, "border-[#fecaca] text-danger hover:border-danger hover:text-danger");

/** "Remove", then a second press to confirm (it can't be undone). Not a form button: it never saves the form. */
export const ConfirmRemoveButton = ({ name, consequence, action }: ConfirmRemoveButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [state, remove, isRemoving] = useActionState(action, { error: null });

  if (!isConfirming) {
    return (
      <button type="button" onClick={() => setIsConfirming(true)} className={dangerButton}>
        <Icon name="delete" size={18} />
        Remove
      </button>
    );
  }

  return (
    <div role="alert" className="flex basis-full flex-col gap-2 rounded-md border border-solid border-[#fecaca] bg-danger-tint p-3">
      <p className="m-0 text-caption text-[#991b1b]">
        Remove <strong>{name}</strong> for good?{consequence && ` ${consequence}`}
      </p>
      {state.error && <p className="m-0 text-caption font-bold text-danger">{state.error}</p>}
      <div className="flex gap-2">
        <button type="button" disabled={isRemoving} onClick={() => startTransition(() => remove())} className={dangerButton}>
          {isRemoving ? "Removing…" : "Yes, remove"}
        </button>
        <button type="button" onClick={() => setIsConfirming(false)} className={secondaryButton}>
          Keep
        </button>
      </div>
    </div>
  );
};
