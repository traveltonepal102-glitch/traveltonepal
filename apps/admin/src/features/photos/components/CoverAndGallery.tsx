"use client";

import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";

import { MAX_GALLERY_PHOTOS } from "../constants";
import { usePhotoSelection } from "../hooks/usePhotoSelection";
import type { PhotoSelection } from "../hooks/usePhotoSelection";
import { usePhotoUploads } from "../hooks/usePhotoUploads";
import { CoverPhotoSlot } from "./CoverPhotoSlot";
import { GalleryPhotoCard } from "./GalleryPhotoCard";
import { PhotoUploadButton } from "./PhotoUploadButton";
import { UploadProgressList } from "./UploadProgressList";

type CoverAndGalleryProps = {
  initial: PhotoSelection;
  /** New uploads are tagged with this region (null for a region that isn't saved yet; tagged on Save). */
  regionId: string | null;
  /** What the photos show, e.g. "Langtang region": with "taken at" it becomes their image text. */
  subject: string;
  onEdit: () => void;
  error?: string;
};

/**
 * Cover slot + ordered gallery for an editor form. Uploads are saved to the photo library right away; which
 * photos the page uses, their order and "taken at" are sent with the form's Save (coverPhotoId,
 * galleryPhotoId, photoPlace.<id>).
 */
export const CoverAndGallery = ({ initial, regionId, subject, onEdit, error }: CoverAndGalleryProps) => {
  const selection = usePhotoSelection(initial, onEdit);
  const uploads = usePhotoUploads<"cover" | "gallery">({
    regionId,
    onUploaded: (photo, target) => (target === "cover" ? selection.setCover(photo) : selection.addToGallery(photo)),
  });
  const { cover, gallery } = selection;
  const freeSlots = MAX_GALLERY_PHOTOS - gallery.length;

  return (
    <>
      <FormSection title="Cover photo" hint="Shown on the region card, at the top of the region page and when the page is shared.">
        <CoverPhotoSlot
          cover={cover}
          subject={subject}
          isUploading={uploads.isUploading}
          isGalleryFull={selection.isGalleryFull}
          onUpload={(files) => uploads.upload(files, "cover")}
          onMoveToGallery={selection.moveCoverToGallery}
          onRemove={selection.removeCover}
          onChangePlace={(place) => cover && selection.updatePlace(cover.id, place)}
        />
      </FormSection>

      <FormSection
        title="Gallery"
        hint={`Up to ${MAX_GALLERY_PHOTOS} photos, shown in this order. Location data is removed on upload.`}
        aside={
          <PhotoUploadButton
            label="Add photos"
            isMultiple
            isDisabled={selection.isGalleryFull}
            onFiles={(files) => uploads.upload(files.slice(0, freeSlots), "gallery")}
          />
        }
      >
        <UploadProgressList items={uploads.items} onDismiss={uploads.dismiss} />
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

      <input type="hidden" name="coverPhotoId" value={cover?.id ?? ""} />
      {gallery.map((photo) => (
        <input key={photo.id} type="hidden" name="galleryPhotoId" value={photo.id} />
      ))}
    </>
  );
};
