import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { MEET_GUIDES, SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import { ToggleChipsField } from "../pickers/ToggleChipsField";

type MeetGuidesFieldsProps = {
  heading: string;
  guideIds: string[];
  context: SectionContext;
  /** e.g. "sections.4" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { heading?: string; guideIds?: string[] }) => void;
};

/** "Meet the guides": small cards of 2–4 guides (those who lead treks in the guide's region listed first). */
export const MeetGuidesFields = ({ heading, guideIds, context, field, errors, onChange }: MeetGuidesFieldsProps) => {
  const { guides, region } = context;
  const ordered = region ? [...guides].sort((a, b) => Number(b.regionIds.includes(region.id)) - Number(a.regionIds.includes(region.id))) : guides;
  return (
    <>
      <TextField
        name="sectionMeetHeading"
        label="Heading"
        labelNote="(optional)"
        value={heading}
        onValueChange={(next) => onChange({ heading: next })}
        placeholder="Guides who lead this trek"
        maxLength={LIMIT.heading}
        error={errors[`${field}.heading`]}
      />
      <ToggleChipsField
        label="Guides"
        field={`${field}.guideIds`}
        options={ordered.map((guide) => ({ value: guide.id, label: guide.name, disabled: !guide.hasConsent }))}
        values={guideIds}
        max={MEET_GUIDES.max}
        hint={`Pick ${MEET_GUIDES.min} to ${MEET_GUIDES.max}.${region ? ` Guides who lead treks in ${region.name} come first.` : ""} Greyed out: hasn’t agreed to be shown.`}
        error={errors[`${field}.guideIds`]}
        onChange={(next) => onChange({ guideIds: next })}
      />
    </>
  );
};
