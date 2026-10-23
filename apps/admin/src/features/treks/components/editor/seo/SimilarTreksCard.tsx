"use client";

import { Icon } from "@ttn/ui/icon";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { MAX_SIMILAR_TREKS, difficultyOf } from "../../../constants";
import type { SimilarTrekOption } from "../../../types";

type SimilarTreksCardProps = {
  similarTrekIds: string[];
  /** Every other trek, A–Z. */
  options: SimilarTrekOption[];
  error?: string;
  onEdit: () => void;
};

/**
 * "Similar trekking options" at the bottom of the trek page (design: "Similar treks"). Up to 4 in order,
 * sent as similarTrekId; the website fills any empty places itself (same region first, then popular treks).
 */
export const SimilarTreksCard = ({ similarTrekIds, options, error, onEdit }: SimilarTreksCardProps) => {
  const selectId = useId();
  // A trek deleted since the last save drops out here.
  const [picked, setPicked] = useState(() => similarTrekIds.filter((id) => options.some((option) => option.id === id)));
  const pickedTreks = picked.flatMap((id) => options.filter((option) => option.id === id));
  const available = options.filter((option) => !picked.includes(option.id));

  const change = (next: string[]) => {
    setPicked(next);
    onEdit();
  };
  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) change([...picked, event.target.value]);
  };

  return (
    <FormSection
      title="Similar treks"
      hint={`Shown at the bottom of the trek page. Pick up to ${MAX_SIMILAR_TREKS}; empty places are filled automatically with treks from the same region first, then popular ones.`}
    >
      {pickedTreks.length > 0 && (
        <ul className="m-0 grid list-none gap-3 p-0 tablet:grid-cols-2 desktop:grid-cols-4">
          {pickedTreks.map((trek, index) => (
            <li key={trek.id} className="relative overflow-hidden rounded-lg border border-solid border-border bg-surface">
              <input type="hidden" name="similarTrekId" value={trek.id} />
              <div className="flex h-27 items-center justify-center bg-page text-subtle">
                {trek.cover ? (
                  <PhotoImage photo={trek.cover} alt="" sizes="(min-width: 1101px) 220px, (min-width: 701px) 45vw, 90vw" className="h-full w-full object-cover" />
                ) : (
                  <Icon name="landscape" size={28} />
                )}
              </div>
              <button
                type="button"
                className={`${ghostIconButton} absolute top-1.5 right-1.5 bg-surface/90`}
                aria-label={`Remove ${trek.name}`}
                onClick={() => change(picked.filter((id) => id !== trek.id))}
              >
                <Icon name="close" size={16} />
              </button>
              <div className="flex flex-col gap-0.5 p-2.5">
                <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                <span className="font-bold text-ink">{trek.name}</span>
                <span className="text-xs text-muted-foreground">
                  {trek.days} days · {difficultyOf(trek.difficulty).label} · {trek.regionName}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!pickedTreks.length && <p className="m-0 text-caption text-muted-foreground">None picked: the website chooses all {MAX_SIMILAR_TREKS} itself.</p>}

      {picked.length < MAX_SIMILAR_TREKS && available.length > 0 && (
        <div className="flex max-w-90 flex-col gap-1.5">
          <label htmlFor={selectId} className={labelClass}>
            Add a similar trek
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">Pick a trek…</option>
            {available.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} ({option.days} days · {option.regionName})
              </option>
            ))}
          </select>
        </div>
      )}
      <FieldError id="similar-treks-error" message={error} />
    </FormSection>
  );
};
