import { Icon } from "@ttn/ui/icon";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { DragHandle, SortableList } from "@/components/ui/SortableList";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { MAX_GALLERY_PHOTOS } from "../../../../sectionKinds";
import { LibraryPhotoPicker } from "../pickers/LibraryPhotoPicker";

type GalleryFieldsProps = {
  photoIds: string[];
  context: SectionContext;
  /** e.g. "sections.8" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (photoIds: string[]) => void;
};

/** "Photo gallery": photos visitors swipe through, in the order dragged here. Their descriptions come from the library. */
export const GalleryFields = ({ photoIds, context, field, errors, onChange }: GalleryFieldsProps) => {
  const picked = photoIds.flatMap((id) => context.photos.filter((photo) => photo.id === id)).map((photo) => ({ key: photo.id, photo }));
  const move = (from: number, to: number) => {
    const next = [...photoIds];
    const [id] = next.splice(from, 1);
    next.splice(to, 0, id);
    onChange(next);
  };

  return (
    <>
      {picked.length > 0 && (
        <SortableList items={picked} itemLabel={(_, index) => `photo ${index + 1}`} onMove={move} layout="grid" className="grid-cols-4 gap-2 max-tablet:grid-cols-2">
          {({ photo }, index, handle) => (
            <div className="relative overflow-hidden rounded-md bg-navy">
              <PhotoImage photo={photo} alt="" sizes="180px" className="block aspect-4/3 h-auto w-full object-cover" />
              <span className="absolute top-1 right-1 left-1 flex justify-between rounded-md bg-white/90">
                <DragHandle {...handle} />
                <button type="button" className={ghostIconButton} aria-label={`Remove photo ${index + 1}`} onClick={() => onChange(photoIds.filter((id) => id !== photo.id))}>
                  <Icon name="close" size={16} />
                </button>
              </span>
            </div>
          )}
        </SortableList>
      )}
      <LibraryPhotoPicker
        label="Choose from library"
        photos={context.photos}
        pickedIds={photoIds}
        max={MAX_GALLERY_PHOTOS}
        regionId={context.region?.id ?? null}
        onChange={onChange}
        onUploaded={context.addPhoto}
      />
      <span className="text-xs text-muted-foreground">2 to {MAX_GALLERY_PHOTOS} photos. Drag a photo by its handle to change the order.</span>
      <FieldError id={`${field}-photos-error`} message={errors[`${field}.photoIds`]} />
    </>
  );
};
