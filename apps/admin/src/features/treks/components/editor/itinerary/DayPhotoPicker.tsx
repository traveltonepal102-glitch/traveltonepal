"use client";

import { Popover } from "@base-ui/react/popover";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { labelClass } from "@/components/ui/formStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

type DayPhotoPickerProps = {
  photo: Photo | null;
  /** The trek's saved photos (cover and gallery) to choose from. */
  choices: Photo[];
  onChange: (photo: Photo | null) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** A day's optional photo, picked from the trek's own photos. Sent as dayPhotoId. */
export const DayPhotoPicker = ({ photo, choices, onChange }: DayPhotoPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const choose = (next: Photo | null) => {
    onChange(next);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>Photo</span>
      <div className="flex items-center gap-3">
        <span className="flex h-16 w-24 flex-none items-center justify-center overflow-hidden rounded-md bg-navy text-white/40">
          {photo ? <PhotoImage key={photo.id} photo={photo} alt="" sizes="96px" className="h-full w-full object-cover" /> : <Icon name="image" />}
        </span>
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger className={smallButton} disabled={!choices.length}>
            <Icon name="photo_library" size={16} />
            {photo ? "Change" : "Choose a photo"}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-100">
              <Popover.Popup className="flex max-h-[min(420px,var(--available-height))] w-96 max-w-[calc(100vw-24px)] flex-col gap-2 overflow-y-auto rounded-lg border border-solid border-border bg-surface p-3 shadow-popover outline-none">
                <Popover.Title className="m-0 font-display text-h4 text-ink">Photo for this day</Popover.Title>
                <div className="grid grid-cols-3 gap-2">
                  {choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => choose(choice)}
                      aria-pressed={choice.id === photo?.id}
                      aria-label={choice.place ? `Photo taken at ${choice.place}` : "Photo"}
                      className="m-0 cursor-pointer overflow-hidden rounded-md border-2 border-solid border-transparent bg-navy p-0 aria-pressed:border-brand focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <PhotoImage photo={choice} alt="" sizes="120px" className="block aspect-4/3 h-auto w-full object-cover" />
                    </button>
                  ))}
                </div>
                {photo && (
                  <button type="button" onClick={() => choose(null)} className={cn(smallButton, "self-start")}>
                    <Icon name="close" size={16} />
                    No photo
                  </button>
                )}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
      {!choices.length && <p className="m-0 text-xs text-muted-foreground">Add photos in the Photos section and save first; then pick one here.</p>}
      <input type="hidden" name="dayPhotoId" value={photo?.id ?? ""} />
    </div>
  );
};
