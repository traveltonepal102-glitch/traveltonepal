"use client";

import { useId } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { TextField } from "@/components/ui/TextField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { GUIDE_LIMITS as LIMIT } from "../../constants";
import { GuideFormGroup } from "./GuideFormGroup";
import { GuidePhotoField } from "./GuidePhotoField";

type PhotoAndNameFieldsProps = {
  photo: Photo | null;
  /** The saved values. */
  name: string;
  photoConsent: boolean;
  /** The name as typed now, for the consent sentence. */
  typedName: string;
  errors: FieldErrors;
  onEdit: () => void;
  onPhotoChange: (photo: Photo | null) => void;
};

/** "Photo and name": the photo, the guide's consent to show it with their name, and the name. */
export const PhotoAndNameFields = ({ photo, name, photoConsent, typedName, errors, onEdit, onPhotoChange }: PhotoAndNameFieldsProps) => {
  const id = useId();
  const firstName = typedName.split(/\s+/)[0] || "This person";

  return (
    <GuideFormGroup title="Photo and name">
      <GuidePhotoField initial={photo} name={typedName} onEdit={onEdit} onChange={onPhotoChange} />
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
      <TextField name="name" label="Full name" defaultValue={name} placeholder="First and last name" maxLength={LIMIT.name} error={errors.name} />
    </GuideFormGroup>
  );
};
