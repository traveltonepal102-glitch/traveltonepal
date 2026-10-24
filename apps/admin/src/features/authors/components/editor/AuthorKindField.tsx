"use client";

import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";

import { FormGroup } from "@/components/editor/FormGroup";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { AUTHOR_KINDS } from "../../constants";
import type { AuthorGuide, AuthorKind } from "../../types";

type AuthorKindFieldProps = {
  kind: AuthorKind;
  onKindChange: (kind: AuthorKind) => void;
  guideId: string | null;
  guides: AuthorGuide[];
  /** Guides that are already another author (offered but not pickable). */
  takenGuideIds: string[];
  errors: FieldErrors;
};

const guideNote = (guide: AuthorGuide, isTaken: boolean) => {
  if (isTaken) return " (already an author)";
  return guide.hasConsent ? "" : " (hasn’t agreed to be shown yet)";
};

/** "Who is this author?": office team, a trekking guide (picked from Trekking guides) or a guest writer. */
export const AuthorKindField = ({ kind, onKindChange, guideId, guides, takenGuideIds, errors }: AuthorKindFieldProps) => {
  const id = useId();
  const hint = AUTHOR_KINDS.find((option) => option.value === kind)?.hint;

  return (
    <FormGroup title="Who is this author?">
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Who is this author?</legend>
        <div className="flex rounded-lg border border-solid border-border bg-muted p-0.75">
          {AUTHOR_KINDS.map((option) => (
            <label key={option.value} className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="kind"
                value={option.value}
                checked={kind === option.value}
                onChange={() => onKindChange(option.value)}
                className="peer sr-only"
              />
              <span className="flex min-h-9 items-center justify-center rounded-md px-2 text-center text-caption font-bold text-text peer-checked:bg-brand peer-checked:text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-ring">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {kind === "guide" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-guide`} className={labelClass}>
            Which trekking guide?
          </label>
          <select
            id={`${id}-guide`}
            name="guideId"
            defaultValue={guideId ?? ""}
            aria-invalid={errors.guideId ? true : undefined}
            aria-describedby={`${id}-guide-hint${errors.guideId ? ` ${id}-guide-error` : ""}`}
            className={cn(inputClass, "cursor-pointer")}
          >
            <option value="">Pick a guide</option>
            {guides.map((guide) => {
              const isTaken = guide.id !== guideId && takenGuideIds.includes(guide.id);
              return (
                <option key={guide.id} value={guide.id} disabled={isTaken || !guide.hasConsent}>
                  {guide.name}
                  {guideNote(guide, isTaken)}
                </option>
              );
            })}
          </select>
          <span id={`${id}-guide-hint`} className="text-xs text-muted-foreground">
            Photo, name and bio come from Trekking guides, so they stay the same everywhere.
          </span>
          <FieldError id={`${id}-guide-error`} message={errors.guideId} />
        </div>
      )}
      {hint && <p className="m-0 text-xs text-muted-foreground">{hint}</p>}
    </FormGroup>
  );
};
