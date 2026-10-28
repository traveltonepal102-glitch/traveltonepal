import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutHonest } from "../../aboutTypes";
import { PAGE_LIMITS as LIMIT } from "../../constants";
import { BeliefCardFields, BeliefTextFields, FieldGroup, TitledRows } from "./AboutFieldParts";

const BASE = "honest";

/** 02 "Honest and proactive": its card, its text and quote, four pieces of advice and when we tell you. */
export const AboutHonestCard = ({ values, errors }: { values: AboutHonest; errors: FieldErrors }) => (
  <FormSection title="02 · Honest and proactive">
    <BeliefCardFields base={BASE} values={values} errors={errors} />
    <BeliefTextFields base={BASE} values={values} errors={errors} />
    <FieldGroup title="Advice we give">
      <TextField name={`${BASE}.adviceHeading`} label="Heading" defaultValue={values.adviceHeading} maxLength={LIMIT.beliefHeading} error={errors[`${BASE}.adviceHeading`]} />
      <div className="grid gap-3 tablet:grid-cols-2">
        {values.advice.map((advice, index) => (
          <div key={index} className="flex flex-col gap-2">
            <TextField
              name={`${BASE}.advice.${index}.quote`}
              label={`Advice ${index + 1}`}
              multiline
              rows={2}
              defaultValue={advice.quote}
              maxLength={LIMIT.itemText}
              error={errors[`${BASE}.advice.${index}.quote`]}
            />
            <TextField name={`${BASE}.advice.${index}.who`} label="Said to" placeholder="To a first-time trekker" defaultValue={advice.who} maxLength={LIMIT.itemTitle} error={errors[`${BASE}.advice.${index}.who`]} />
          </div>
        ))}
      </div>
    </FieldGroup>
    <TitledRows base={`${BASE}.points`} title="When we tell you (the blue box)" itemLabel="Moment" rows={values.points} errors={errors} columns={4} />
  </FormSection>
);
