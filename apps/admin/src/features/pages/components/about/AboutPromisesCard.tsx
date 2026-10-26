import { Icon } from "@ttn/ui/icon";

import { FormSection } from "@/components/ui/FormSection";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT, PROMISE_ICONS, PROMISE_ROWS } from "../../constants";
import type { AboutPageValues } from "../../types";
import { SectionHeadingFields } from "../SectionHeadingFields";

type AboutPromisesCardProps = { values: AboutPageValues; errors: FieldErrors };

/** "What you can expect from us": the heading, the line under it and six promises (also every trek page's "Why book"). */
export const AboutPromisesCard = ({ values, errors }: AboutPromisesCardProps) => (
  <FormSection title="Six promises">
    <SectionHeadingFields
      eyebrow="Why travel with us"
      heading={{ name: "promisesHeading", value: values.promisesHeading, placeholder: "What you can expect from us" }}
      intro={{ name: "promisesIntro", value: values.promisesIntro, placeholder: "Six promises we keep on every trek, whatever the region or group size." }}
      errors={errors}
    />
    <p className="m-0 flex items-start gap-2.5 rounded-md bg-brand-tint px-3.5 py-3 text-caption text-ink">
      <Icon name="info" size={18} className="flex-none text-brand" />
      These {PROMISE_ROWS} promises also show on every trek page as “Why book your trek with us”. Change them once, here.
    </p>
    {Array.from({ length: PROMISE_ROWS }, (_, index) => {
      const promise = values.promises[index];
      return (
        <div key={index} className="grid gap-2 rounded-xl border border-solid border-border bg-page p-2.5 tablet:grid-cols-[150px_minmax(0,1fr)]">
          <SelectField name="promiseIcon" label={`Icon ${index + 1}`} options={PROMISE_ICONS} defaultValue={promise?.icon || PROMISE_ICONS[index % PROMISE_ICONS.length].value} error={errors[`promises.${index}.icon`]} />
          <div className="flex flex-col gap-2">
            <TextField name="promiseTitle" label={`Promise ${index + 1}`} labelNote="(H3)" defaultValue={promise?.title ?? ""} maxLength={LIMIT.promiseTitle} inputClassName="font-bold" error={errors[`promises.${index}.title`]} />
            <TextField name="promiseText" label="Text" isLabelHidden multiline rows={2} defaultValue={promise?.text ?? ""} maxLength={LIMIT.promiseText} error={errors[`promises.${index}.text`]} />
          </div>
        </div>
      );
    })}
  </FormSection>
);
