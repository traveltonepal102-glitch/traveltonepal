import { MAX_VISITOR_TIME_ZONES, VISITOR_TIME_ZONES } from "@ttn/config/visitorTimeZones";

import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../../constants";
import type { ContactPageValues } from "../../types";

type ContactOfficeCardProps = { values: ContactPageValues; errors: FieldErrors; onEdit: () => void };

/** "Time difference": the places to show, the line under the times, and directions under the office address. */
export const ContactOfficeCard = ({ values, errors, onEdit }: ContactOfficeCardProps) => (
  <>
    <FormSection title="Time difference" hint="The times are worked out by themselves from the office hours, with summer and winter time. Pick the places to show.">
      <ChoiceChips
        legend={`Places (up to ${MAX_VISITOR_TIME_ZONES})`}
        name="timeZone"
        type="checkbox"
        options={VISITOR_TIME_ZONES.map((zone) => ({ value: zone.timeZone, label: zone.place }))}
        defaultValues={values.timeZones}
        onChange={onEdit}
        error={errors.timeZones}
      />
      <TextField name="timeNote" label="Line under the times" defaultValue={values.timeNote} placeholder="Outside these hours? Leave a WhatsApp message. We reply first thing in the morning." maxLength={LIMIT.timeNote} error={errors.timeNote} />
    </FormSection>
    <FormSection title="Office">
      <TextField
        name="officeDirections"
        label="Directions under the address"
        labelNote="(optional)"
        hint="e.g. “Near the Garden of Dreams, 2nd floor”. The address, hours and map come from Site settings."
        defaultValue={values.officeDirections}
        maxLength={LIMIT.officeDirections}
        error={errors.officeDirections}
      />
    </FormSection>
  </>
);
