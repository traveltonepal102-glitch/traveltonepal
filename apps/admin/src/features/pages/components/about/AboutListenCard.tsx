import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutListen } from "../../aboutTypes";
import { PAGE_LIMITS as LIMIT } from "../../constants";
import { BeliefCardFields, BeliefTextFields, FieldGroup, TitledRows } from "./AboutFieldParts";

const BASE = "listen";

/** 01 "We listen first": its card, its text and quote, and the three steps with their questions, four "your …" and an example. */
export const AboutListenCard = ({ values, errors }: { values: AboutListen; errors: FieldErrors }) => (
  <FormSection title="01 · We listen first">
    <BeliefCardFields base={BASE} values={values} errors={errors} />
    <BeliefTextFields base={BASE} values={values} errors={errors} />
    <TitledRows base={`${BASE}.steps`} title="Three steps" itemLabel="Step" rows={values.steps} errors={errors} />
    <FieldGroup title="Step 1: the questions we ask">
      <div className="grid gap-2 tablet:grid-cols-2">
        {values.questions.map((question, index) => (
          <TextField
            key={index}
            name={`${BASE}.questions.${index}`}
            label={`Question ${index + 1}`}
            defaultValue={question}
            maxLength={LIMIT.itemTitle}
            error={errors[`${BASE}.questions.${index}`]}
          />
        ))}
      </div>
    </FieldGroup>
    <FieldGroup title="Step 2: what we understand">
      <div className="grid gap-2 tablet:grid-cols-2">
        {values.understand.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <TextField name={`${BASE}.understand.${index}.label`} label={`Label ${index + 1}`} placeholder="Your interests" defaultValue={item.label} maxLength={LIMIT.itemLabel} error={errors[`${BASE}.understand.${index}.label`]} />
            <TextField name={`${BASE}.understand.${index}.value`} label="Shown under it" placeholder="Peaks, villages, food" defaultValue={item.value} maxLength={LIMIT.itemLabel} error={errors[`${BASE}.understand.${index}.value`]} />
          </div>
        ))}
      </div>
      <TextField name={`${BASE}.understandNote`} label="Small line under them" defaultValue={values.understandNote} maxLength={LIMIT.note} error={errors[`${BASE}.understandNote`]} />
    </FieldGroup>
    <TextField
      name={`${BASE}.example`}
      label="Step 3: example"
      hint="Shown after “For example:”."
      multiline
      rows={3}
      defaultValue={values.example}
      maxLength={LIMIT.note}
      error={errors[`${BASE}.example`]}
    />
  </FormSection>
);
