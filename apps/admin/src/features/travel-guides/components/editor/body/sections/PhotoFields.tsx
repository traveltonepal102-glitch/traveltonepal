import { Icon } from "@ttn/ui/icon";

import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import { LibraryPhotoPicker } from "../pickers/LibraryPhotoPicker";

type PhotoFieldsProps = {
  photoId: string | null;
  caption: string;
  alt: string;
  context: SectionContext;
  /** e.g. "sections.2" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { photoId?: string | null; caption?: string; alt?: string }) => void;
};

/** "Photo": one large photo from the library, its caption, and its description for Google. */
export const PhotoFields = ({ photoId, caption, alt, context, field, errors, onChange }: PhotoFieldsProps) => {
  const photo = context.photos.find((item) => item.id === photoId);
  return (
    <>
      <div className="flex aspect-21/9 items-center justify-center overflow-hidden rounded-lg bg-navy text-white/40">
        {photo ? <PhotoImage photo={photo} alt="" sizes="(min-width: 1200px) 760px, 100vw" className="h-full w-full object-cover" /> : <Icon name="image" size={36} />}
      </div>
      <LibraryPhotoPicker
        label={photo ? "Change photo" : "Choose from library"}
        photos={context.photos}
        pickedIds={photoId ? [photoId] : []}
        max={1}
        regionId={context.region?.id ?? null}
        onChange={(ids) => onChange({ photoId: ids[0] ?? null })}
        onUploaded={context.addPhoto}
      />
      <FieldError id={`${field}-photo-error`} message={errors[`${field}.photoId`]} />
      <TextField name="sectionPhotoCaption" label="Caption" labelNote="(optional)" value={caption} onValueChange={(next) => onChange({ caption: next })} placeholder="The trail above Langtang village in late October." maxLength={LIMIT.caption} error={errors[`${field}.caption`]} />
      <TextField
        name="sectionPhotoAlt"
        label="Photo description"
        labelNote="(for Google and screen readers)"
        value={alt}
        onValueChange={(next) => onChange({ alt: next })}
        placeholder="Stone houses and prayer flags in Langtang village"
        maxLength={LIMIT.photoAlt}
        error={errors[`${field}.alt`]}
      />
    </>
  );
};
