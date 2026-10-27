import { SourceNote } from "@/components/editor/SourceNote";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";

import { TREK_LIMITS as LIMIT } from "../../constants";

type HeadingField = {
  name: string;
  defaultValue: string;
  placeholder: string;
  error?: string;
};

type PageHeadingFieldsProps = {
  /** The card's title, when a section has more than one heading (default "Heading on the page"). */
  title?: string;
  /** The small label above the heading on the page, the same on every trek, e.g. "Trek milestones". */
  eyebrow?: string;
  /** The heading's level on the page, for Google. */
  level: "H2" | "H3";
  heading: HeadingField;
  /** Fixed words before the heading, e.g. "10-day" before "day-by-day itinerary". */
  headingPrefix?: string;
  /** Where the fixed words come from, e.g. "“10-day” is counted from the days below." */
  headingPrefixNote?: string;
  /** The line under the heading, when the section has one. */
  line?: HeadingField & { label?: string; maxLength: number };
};

/**
 * A section's heading as the trek page shows it (design: the block at the top of each section): the fixed small
 * label, the heading (amber past 70 characters, a little long for Google) and the line under it.
 */
export const PageHeadingFields = ({ title = "Heading on the page", eyebrow, level, heading, headingPrefix, headingPrefixNote, line }: PageHeadingFieldsProps) => (
  <FormSection title={title} hint={eyebrow ? `The small label above it, “${eyebrow}”, is the same on every trek.` : undefined}>
    <div className="flex items-end gap-2">
      {headingPrefix && <span className="mb-2.5 flex-none font-display text-lg font-bold text-ink">{headingPrefix}</span>}
      <div className="min-w-0 flex-1">
        <TextField
          name={heading.name}
          label="Section heading"
          labelNote={level}
          defaultValue={heading.defaultValue}
          placeholder={heading.placeholder}
          maxLength={LIMIT.heading}
          recommendedLength={LIMIT.headingRecommended}
          showCount
          error={heading.error}
          inputClassName="font-display text-lg font-bold"
        />
      </div>
    </div>
    {headingPrefixNote && <SourceNote from={{ note: headingPrefixNote }} className="-mt-2" />}
    {line && (
      <TextField
        name={line.name}
        label={line.label ?? "Line under the heading"}
        defaultValue={line.defaultValue}
        placeholder={line.placeholder}
        maxLength={line.maxLength}
        error={line.error}
      />
    )}
  </FormSection>
);
