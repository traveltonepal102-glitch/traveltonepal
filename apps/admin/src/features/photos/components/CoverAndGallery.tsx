"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";

import { MAX_GALLERY_PHOTOS } from "../constants";
import { usePhotoSelection } from "../hooks/usePhotoSelection";
import type { PhotoSelection } from "../hooks/usePhotoSelection";
import type { Photo } from "../types";
import { CoverPhotoSlot } from "./CoverPhotoSlot";
import { GalleryPhotoCard } from "./GalleryPhotoCard";
import { LibraryPhotoDialog } from "./LibraryPhotoDialog";

type CoverAndGalleryProps = {
  initial: PhotoSelection;
  /** New uploads are tagged with this region (null for a region that isn't saved yet; tagged on Save). */
  regionId: string | null;
  /** What the photos show, e.g. "Langtang region": with "taken at" it becomes their image text. */
  subject: string;
  /** The trek being edited (saved): the photo window offers "This trek's photos". */
  trekId?: string | null;
  onEdit: () => void;
  error?: string;
};

/**
 * Cover slot + ordered gallery for an editor form. Photos are chosen in the photo library window (uploads are
 * saved to the library right away); which photos the page uses, their order and "taken at" are sent with the
 * form's Save (coverPhotoId, galleryPhotoId, photoPlace.<id>).
 */
export const CoverAndGallery = ({ initial, regionId, subject, trekId = null, onEdit, error }: CoverAndGalleryProps) => {
  const selection = usePhotoSelection(initial, onEdit);
  const [openFor, setOpenFor] = useState<"cover" | "gallery" | null>(null);
  const { cover, gallery } = selection;
  // A photo is in one place at a time: a gallery photo chosen as the cover swaps places with the old cover.
  const chooseCover = (photo: Photo) =>
    gallery.some((other) => other.id === photo.id) ? selection.makeCover(photo.id) : selection.setCover(photo);

  return (
    <>
      <FormSection title="Cover photo" hint="Shown on the region card, at the top of the region page and when the page is shared.">
        <CoverPhotoSlot
          cover={cover}
          subject={subject}
          isGalleryFull={selection.isGalleryFull}
          onChoose={() => setOpenFor("cover")}
          onMoveToGallery={selection.moveCoverToGallery}
          onRemove={selection.removeCover}
          onChangePlace={(place) => cover && selection.updatePlace(cover.id, place)}
        />
      </FormSection>

      <FormSection
        title="Gallery"
        hint={`Up to ${MAX_GALLERY_PHOTOS} photos, shown in this order. Location data is removed on upload.`}
        aside={
          <button type="button" onClick={() => setOpenFor("gallery")} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
            <Icon name="add_photo_alternate" size={16} />
            Add photos
          </button>
        }
      >
        {gallery.length ? (
          <ul className="m-0 grid list-none gap-3 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
            {gallery.map((photo, index) => (
              <li key={photo.id}>
                <GalleryPhotoCard
                  photo={photo}
                  index={index}
                  count={gallery.length}
                  subject={subject}
                  onMove={(to) => selection.moveInGallery(index, to)}
                  onMakeCover={() => selection.makeCover(photo.id)}
                  onRemove={() => selection.removeFromGallery(photo.id)}
                  onChangePlace={(place) => selection.updatePlace(photo.id, place)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-xl border border-dashed border-line-strong bg-page px-6 py-8 text-center text-caption text-muted-foreground">
            No gallery photos yet. Add the photos visitors should scroll through on the region page.
          </p>
        )}
        <FieldError id="photos-error" message={error} />
      </FormSection>

      {openFor === "cover" && (
        <LibraryPhotoDialog
          title="Cover photo"
          selected={cover ? [cover] : []}
          pick={{ kind: "one", onChoose: chooseCover }}
          regionId={regionId}
          trekId={trekId}
          onClose={() => setOpenFor(null)}
        />
      )}
      {openFor === "gallery" && (
        <LibraryPhotoDialog
          title="Gallery photos"
          selected={gallery}
          pick={{ kind: "many", max: MAX_GALLERY_PHOTOS, onDone: selection.setGallery }}
          regionId={regionId}
          trekId={trekId}
          // The cover can't be in the gallery too.
          excludedIds={cover ? [cover.id] : []}
          onClose={() => setOpenFor(null)}
        />
      )}

      <input type="hidden" name="coverPhotoId" value={cover?.id ?? ""} />
      {gallery.map((photo) => (
        <input key={photo.id} type="hidden" name="galleryPhotoId" value={photo.id} />
      ))}
    </>
  );
};
