"use client";

import { FormGroup } from "@/components/editor/FormGroup";
import { FieldError } from "@/components/ui/FieldError";
import { Switch } from "@/components/ui/Switch";
import { TextField } from "@/components/ui/TextField";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { ADVENTURE_LIMITS as LIMIT } from "../constants";
import type { AdventureValues } from "../types";

type AdventureFieldsProps = {
  values: AdventureValues;
  /** The saved photo; null for none. */
  photo: Photo | null;
  /** The library photos to choose from. */
  libraryPhotos: Photo[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** The adventure form: the card as the website shows it, then its place in the carousel and whether it shows. */
export const AdventureFields = ({ values, photo, libraryPhotos, errors, onEdit }: AdventureFieldsProps) => (
  <>
    <FormGroup title="The card" where="Home page, custom adventures">
      <TextField name="title" label="Name" placeholder="Wild honey hunting" defaultValue={values.title} maxLength={LIMIT.title} error={errors.title} />
      <TextField
        name="tag"
        label="Place and season"
        labelNote="(optional)"
        placeholder="Lamjung · Spring and autumn"
        defaultValue={values.tag}
        maxLength={LIMIT.tag}
        hint="The orange tag on the photo."
        error={errors.tag}
      />
      <TextField name="summary" label="Text" multiline rows={4} defaultValue={values.summary} maxLength={LIMIT.summary} showCount hint="One or two sentences: what they'll do and why it's special." error={errors.summary} />
      <div className="flex flex-col gap-1">
        <LibraryPhotoField name="photoId" label="Photo" initial={photo} photos={libraryPhotos} hint="A wide photo works best. Needed before the card can show on the website." emptyText="No photo yet." onEdit={onEdit} />
        <FieldError id="adventure-photo-error" message={errors.photoId} />
      </div>
      <TextField
        name="photoAlt"
        label="What the photo shows"
        labelNote="(optional)"
        placeholder="A honey hunter on a rope ladder harvesting cliff honey"
        defaultValue={values.photoAlt}
        maxLength={LIMIT.photoAlt}
        hint="For blind visitors and Google. Empty: the name is used."
        error={errors.photoAlt}
      />
    </FormGroup>

    <FormGroup title="Where it shows">
      <TextField
        name="position"
        label="Place in the carousel"
        inputMode="numeric"
        defaultValue={String(values.position)}
        hint="1 shows first. Cards with the same number go A–Z."
        error={errors.position}
      />
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-ink">Show on the website</span>
          <span className="block text-xs text-muted-foreground">Off: kept here, but visitors don&apos;t see it.</span>
        </span>
        <Switch name="isShown" label="Show on the website" defaultChecked={values.isShown} />
      </label>
    </FormGroup>
  </>
);
