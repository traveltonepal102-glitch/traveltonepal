import type { ReactNode } from "react";

import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutBelief, TitledText } from "../../aboutTypes";
import { PAGE_LIMITS as LIMIT } from "../../constants";

const GROUP = "flex flex-col gap-3 rounded-xl border border-solid border-border bg-page p-3";
const GROUP_TITLE = "text-[11px] font-bold tracking-widest text-brand uppercase";

type BeliefFieldsProps = { base: string; values: AboutBelief; errors: FieldErrors };

/** A belief's card in the four-card overview at the top of the page: title, one line and the link's words. */
export const BeliefCardFields = ({ base, values, errors }: BeliefFieldsProps) => (
  <div className={GROUP}>
    <span className={GROUP_TITLE}>Its card at the top of the page</span>
    <div className="grid gap-3 tablet:grid-cols-[2fr_1fr]">
      <TextField name={`${base}.cardTitle`} label="Card title" defaultValue={values.cardTitle} maxLength={LIMIT.cardTitle} error={errors[`${base}.cardTitle`]} />
      <TextField name={`${base}.cardLink`} label="Link words" hint="Leads down to the section." defaultValue={values.cardLink} maxLength={LIMIT.cardLink} error={errors[`${base}.cardLink`]} />
    </div>
    <TextField name={`${base}.cardText`} label="Card text" multiline rows={2} defaultValue={values.cardText} maxLength={LIMIT.cardText} error={errors[`${base}.cardText`]} />
  </div>
);

/** A belief section's small label, heading (H2), text and big quote. */
export const BeliefTextFields = ({ base, values, errors }: BeliefFieldsProps) => (
  <>
    <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
      <TextField name={`${base}.eyebrow`} label="Small label" defaultValue={values.eyebrow} maxLength={LIMIT.beliefEyebrow} error={errors[`${base}.eyebrow`]} />
      <TextField name={`${base}.heading`} label="Heading" labelNote="(H2)" defaultValue={values.heading} maxLength={LIMIT.beliefHeading} inputClassName="font-display font-bold" error={errors[`${base}.heading`]} />
    </div>
    <TextField
      name={`${base}.body`}
      label="Text"
      hint="Leave an empty line between paragraphs."
      multiline
      rows={6}
      defaultValue={values.body}
      maxLength={LIMIT.beliefBody}
      showCount
      error={errors[`${base}.body`]}
    />
    <TextField name={`${base}.quote`} label="Big quote" labelNote="(optional)" defaultValue={values.quote} maxLength={LIMIT.beliefQuote} error={errors[`${base}.quote`]} />
  </>
);

type TitledRowsProps = {
  /** e.g. "listen.steps": the fields are "listen.steps.0.title", "listen.steps.0.text"… */
  base: string;
  title: string;
  /** What one row is called, e.g. "Step" ("Step 1", "Step 2"…). */
  itemLabel: string;
  rows: readonly TitledText[];
  errors: FieldErrors;
  /** Columns on wide screens. */
  columns?: 2 | 3 | 4;
};

const COLUMNS = { 2: "tablet:grid-cols-2", 3: "desktop:grid-cols-3", 4: "tablet:grid-cols-2 desktop:grid-cols-4" } as const;

/** A fixed number of title + text rows (the design's number; an empty row is left out on the website). */
export const TitledRows = ({ base, title, itemLabel, rows, errors, columns = 3 }: TitledRowsProps) => (
  <div className={GROUP}>
    <span className={GROUP_TITLE}>{title}</span>
    <div className={`grid gap-3 ${COLUMNS[columns]}`}>
      {rows.map((row, index) => (
        <div key={index} className="flex flex-col gap-2">
          <TextField name={`${base}.${index}.title`} label={`${itemLabel} ${index + 1}`} defaultValue={row.title} maxLength={LIMIT.itemTitle} inputClassName="font-bold" error={errors[`${base}.${index}.title`]} />
          <TextField
            name={`${base}.${index}.text`}
            label={`${itemLabel} ${index + 1} text`}
            isLabelHidden
            multiline
            rows={3}
            defaultValue={row.text}
            maxLength={LIMIT.itemText}
            error={errors[`${base}.${index}.text`]}
          />
        </div>
      ))}
    </div>
  </div>
);

/** A group of fields with a small title, like the design's boxes. */
export const FieldGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className={GROUP}>
    <span className={GROUP_TITLE}>{title}</span>
    {children}
  </div>
);
