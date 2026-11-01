"use client";

import { cn } from "@ttn/ui/lib/utils";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

type PickerFooterProps = {
  count: number;
  max: number;
  onCancel: () => void;
  onDone: () => void;
};

const button = "min-h-9 px-4 text-caption";

/** A gallery's window: how many are chosen, Cancel (drops the clicks) and Done (keeps them). */
export const PickerFooter = ({ count, max, onCancel, onDone }: PickerFooterProps) => (
  <div className="flex items-center justify-between gap-3 border-t border-solid border-border px-5 py-3">
    <span className="text-caption text-muted-foreground">
      {count} of {max} chosen
    </span>
    <span className="flex gap-2">
      <button type="button" onClick={onCancel} className={cn(secondaryButton, button)}>
        Cancel
      </button>
      <button type="button" onClick={onDone} className={cn(primaryButton, button)}>
        Done
      </button>
    </span>
  </div>
);
