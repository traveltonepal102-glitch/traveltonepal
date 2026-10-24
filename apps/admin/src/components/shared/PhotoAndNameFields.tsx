"use client";

import { useId } from "react";

import { FormGroup } from "@/components/editor/FormGroup";
import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import { PersonPhotoField } from "@/features/photos/components/PersonPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

type PhotoAndNameFieldsProps = {
  photo: Photo | null;
  /** The saved values. */
  name: string;
  photoConsent: boolean;
  /** The name as typed now, for the consent sentence. */
  typedName: string;
  nameMaxLength: number;
  photoHint: string;
  nameHint?: string;
  errors: FieldErrors;
  onEdit: () => void;
  onPhotoChange: (photo: Photo | null) => void;
};

/** "Photo and name" (guides and authors): the photo, the person's consent to show it with their name, and the name. */
export const PhotoAndNameFields = ({ photo, name, photoConsent, typedName, nameMaxLength, photoHint, nameHint, errors, onEdit, onPhotoChange }: PhotoAndNameFieldsProps) => {
  const id = useId();
  const firstName = typedName.split(/\s+/)[0] || "This person";

  return (
    <FormGroup title="Photo and name">
      <PersonPhotoField initial={photo} name={typedName} hint={photoHint} onEdit={onEdit} onChange={onPhotoChange} />
      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-ink">
          <input
            type="checkbox"
            name="photoConsent"
            defaultChecked={photoConsent}
            aria-describedby={errors.photoConsent ? `${id}-error` : undefined}
            aria-invalid={errors.photoConsent ? true : undefined}
            className="mt-0.5 size-4.5 flex-none accent-brand"
          />
          <span>{firstName} agreed that we show their photo and name on our websites.</span>
        </label>
        <FieldError id={`${id}-error`} message={errors.photoConsent} />
      </div>
      <TextField name="name" label="Full name" hint={nameHint} defaultValue={name} placeholder="First and last name" maxLength={nameMaxLength} error={errors.name} />
    </FormGroup>
  );
};
