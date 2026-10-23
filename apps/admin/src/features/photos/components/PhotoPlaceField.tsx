"use client";

import { useId } from "react";

import { inputClass } from "@/components/ui/formStyles";

import { PHOTO_LIMITS } from "../constants";
import type { Photo } from "../types";

type PhotoPlaceFieldProps = {
  photo: Photo;
  onChange: (place: string) => void;
};

/** A photo's optional "taken at", saved with the form as photoPlace.<id>. */
export const PhotoPlaceField = ({ photo, onChange }: PhotoPlaceFieldProps) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-bold text-ink">
        Taken at <span className="font-medium text-muted-foreground">(optional)</span>
      </label>
      <input
        id={id}
        name={`photoPlace.${photo.id}`}
        value={photo.place}
        onChange={(event) => onChange(event.target.value)}
        maxLength={PHOTO_LIMITS.place}
        placeholder="e.g. Kyanjin Gompa"
        className={`${inputClass} h-8.5 text-caption`}
      />
    </div>
  );
};
