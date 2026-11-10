"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { EditPhotoTextButton } from "@/features/photos/components/EditPhotoTextButton";
import { LibraryPhotoDialog } from "@/features/photos/components/LibraryPhotoDialog";
import { PhotoSizeNote } from "@/features/photos/components/PhotoSizeNote";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { Photo } from "@/features/photos/types";

type HomeHeroPhotoFieldProps = {
  photo: Photo | null;
  /** New uploads are tagged with the website's region. */
  regionId: string | null;
  error?: string;
  onChange: (photo: Photo | null) => void;
};

const smallButton = cn(secondaryButton, "min-h-8 px-3 text-caption");

/** The big photo at the top of the Home page, wide as on the website; sent with Publish as photoId. */
export const HomeHeroPhotoField = ({ photo, regionId, error, onChange }: HomeHeroPhotoFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="photoId" value={photo?.id ?? ""} />
      <div className={cn("relative aspect-21/8 overflow-hidden rounded-xl bg-navy max-tablet:aspect-16/9", error && "outline-2 outline-danger")}>
        {photo ? (
          <PhotoImage photo={photo} alt="" sizes="(min-width: 1200px) 860px, 100vw" className="h-full w-full object-cover opacity-85" />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-1 text-white/60">
            <Icon name="add_photo_alternate" size={40} />
            <span className="text-caption font-semibold">The photo behind the title</span>
          </span>
        )}
        <span className="absolute top-3 right-3 flex gap-2">
          <button type="button" onClick={() => setIsOpen(true)} className={smallButton}>
            <Icon name={photo ? "image" : "add_photo_alternate"} size={16} />
            {photo ? "Change photo" : "Add photo"}
          </button>
          {photo && (
            <>
              <button type="button" onClick={() => onChange(null)} className={smallButton}>
                <Icon name="delete" size={16} />
                Remove
              </button>
              <EditPhotoTextButton photo={photo} variant="icon" />
            </>
          )}
        </span>
      </div>
      <PhotoSizeNote size="banner" />
      <FieldError id="home-photo-error" message={error} />
      {isOpen && (
        <LibraryPhotoDialog title="Photo at the top of the Home page" size="banner" selected={photo ? [photo] : []} pick={{ kind: "one", onChoose: onChange }} regionId={regionId} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
