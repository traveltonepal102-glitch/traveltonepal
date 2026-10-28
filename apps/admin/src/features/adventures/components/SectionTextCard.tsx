"use client";

import { cn } from "@ttn/ui/lib/utils";
import { startTransition, useActionState } from "react";
import type { FormEvent } from "react";

import type { EditorSaveState } from "@/components/editor/types";
import { secondaryButton } from "@/components/ui/buttonStyles";
import { TextField } from "@/components/ui/TextField";

import { saveAdventureSection } from "../actions/saveAdventureSection";
import { SECTION_LIMITS as LIMIT } from "../constants";
import { stepField } from "../schemas/adventureSchema";
import type { AdventureSectionValues } from "../types";

const IDLE: EditorSaveState = { status: "idle" };

/**
 * "Section text": the words around the cards on the home page (heading, the last card, "How it works", the note),
 * folded until opened. Not <form action>: React would empty the fields after saving.
 */
export const SectionTextCard = ({ values }: { values: AdventureSectionValues }) => {
  const [state, action, isSaving] = useActionState(saveAdventureSection, IDLE);
  const errors = state.status === "error" ? state.fieldErrors : {};

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <details open={state.status === "error"} className="group rounded-lg border border-solid border-border bg-surface">
      <summary className="cursor-pointer list-none p-4">
        <span className="block font-display text-body font-bold text-ink">Section text on the home page</span>
        <span className="block text-caption text-muted-foreground">
          The label, heading and intro above the cards, the last card (“{values.askTitle}”), “How it works” and the note. Click to edit.
        </span>
      </summary>
      <form noValidate onSubmit={submit} className="flex flex-col gap-4 border-t border-solid border-border p-4">
        <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
          <TextField name="eyebrow" label="Small label" defaultValue={values.eyebrow} maxLength={LIMIT.eyebrow} error={errors.eyebrow} />
          <TextField name="heading" label="Heading" defaultValue={values.heading} maxLength={LIMIT.heading} error={errors.heading} />
        </div>
        <TextField name="intro" label="Intro" labelNote="(optional)" multiline rows={3} defaultValue={values.intro} maxLength={LIMIT.intro} showCount error={errors.intro} />

        <fieldset className="m-0 flex flex-col gap-3 rounded-lg border border-solid border-border p-3">
          <legend className="px-1 text-caption font-semibold text-ink">Last card, with the WhatsApp and email buttons</legend>
          <TextField name="askTitle" label="Title" defaultValue={values.askTitle} maxLength={LIMIT.askTitle} error={errors.askTitle} />
          <TextField name="askText" label="Text" labelNote="(optional)" multiline rows={2} defaultValue={values.askText} maxLength={LIMIT.askText} showCount error={errors.askText} />
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-3 rounded-lg border border-solid border-border p-3">
          <legend className="px-1 text-caption font-semibold text-ink">How it works</legend>
          <TextField name="stepsTitle" label="Heading" defaultValue={values.stepsTitle} maxLength={LIMIT.stepsTitle} error={errors.stepsTitle} />
          <div className="grid gap-3 desktop:grid-cols-3">
            {values.steps.map((step, index) => (
              <div key={stepField(index, "Title")} className="flex flex-col gap-2">
                <TextField name={stepField(index, "Title")} label={`Step ${index + 1}`} defaultValue={step.title} maxLength={LIMIT.stepTitle} error={errors[`steps.${index}.title`]} />
                <TextField
                  name={stepField(index, "Text")}
                  label={`Step ${index + 1} text`}
                  isLabelHidden
                  multiline
                  rows={3}
                  defaultValue={step.text}
                  maxLength={LIMIT.stepText}
                  error={errors[`steps.${index}.text`]}
                />
              </div>
            ))}
          </div>
        </fieldset>

        <TextField
          name="note"
          label="Note under the steps"
          labelNote="(optional)"
          multiline
          rows={2}
          defaultValue={values.note}
          maxLength={LIMIT.note}
          hint="The yellow box, e.g. that some trips depend on season and permission. Empty: no box."
          error={errors.note}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSaving} className={secondaryButton}>
            {isSaving ? "Saving…" : "Save section text"}
          </button>
          <p role="status" className={cn("m-0 text-xs font-semibold", state.status === "error" ? "text-danger" : "text-whatsapp")}>
            {state.status === "saved" && "Saved. The website shows it within seconds."}
            {state.status === "error" && state.message}
          </p>
        </div>
      </form>
    </details>
  );
};
