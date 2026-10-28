"use client";

import { cn } from "@ttn/ui/lib/utils";
import { startTransition, useActionState } from "react";
import type { FormEvent } from "react";

import type { EditorSaveState } from "@/components/editor/types";
import { secondaryButton } from "@/components/ui/buttonStyles";
import { TextField } from "@/components/ui/TextField";

import { saveReviewRatings } from "../../actions/saveReviewRatings";
import { REVIEW_SOURCES } from "../../constants";
import type { ReviewRating } from "../../types";

const IDLE: EditorSaveState = { status: "idle" };

/**
 * "Overall rating": the review sites' own numbers, typed in by hand (e.g. 4.9 from 37 Google reviews). Shown on the
 * website beside the reviews; both empty hides it. Not <form action>: React would empty the fields after saving.
 */
export const RatingsCard = ({ ratings }: { ratings: ReviewRating[] }) => {
  const [state, action, isSaving] = useActionState(saveReviewRatings, IDLE);
  const errors = state.status === "error" ? state.fieldErrors : {};

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-solid border-border bg-surface p-4">
      <div>
        <h2 className="m-0 font-display text-body font-bold text-ink">Overall rating</h2>
        <p className="m-0 mt-0.5 text-caption text-muted-foreground">
          Copy both numbers from your Google profile when new reviews come in. Never work them out from the reviews chosen here. Leave both empty to hide the rating.
        </p>
      </div>
      <div className="grid gap-4 tablet:grid-cols-2">
        {REVIEW_SOURCES.map((source) => {
          const saved = ratings.find((rating) => rating.source === source.value);
          return (
            <fieldset key={source.value} className="m-0 grid min-w-0 grid-cols-2 gap-2.5 border-0 p-0">
              <legend className="mb-1.5 text-caption font-semibold text-ink">{source.label}</legend>
              <TextField
                name={`${source.value}Rating`}
                label="Rating"
                placeholder="4.9"
                inputMode="decimal"
                defaultValue={saved ? saved.rating.toFixed(1) : ""}
                error={errors[`${source.value}Rating`]}
              />
              <TextField
                name={`${source.value}Count`}
                label="Number of reviews"
                placeholder="37"
                inputMode="numeric"
                defaultValue={saved ? String(saved.reviewCount) : ""}
                error={errors[`${source.value}Count`]}
              />
            </fieldset>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isSaving} className={secondaryButton}>
          {isSaving ? "Saving…" : "Save rating"}
        </button>
        <p role="status" className={cn("m-0 text-xs font-semibold", state.status === "error" ? "text-danger" : "text-whatsapp")}>
          {state.status === "saved" && "Saved. The website shows it within seconds."}
          {state.status === "error" && state.message}
        </p>
      </div>
    </form>
  );
};
