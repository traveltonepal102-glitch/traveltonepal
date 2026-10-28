import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../../constants";
import type { AboutFacts, AboutPageValues } from "../../types";

type AboutNumbersCardProps = { values: AboutPageValues; facts: AboutFacts; errors: FieldErrors };

const TILE = "flex flex-col gap-1.5 rounded-xl border border-solid border-border bg-page p-2.5";
const VALUE = "font-display text-xl font-extrabold text-ink";

/**
 * "Four numbers under the heading": the year and the regions fill in by themselves; "trekkers guided" and the fourth
 * number are typed here. Then the line under the four beliefs' cards.
 */
export const AboutNumbersCard = ({ values, facts, errors }: AboutNumbersCardProps) => (
  <FormSection title="Four numbers, and the line under the four beliefs" hint="Keep the numbers true. A number left empty is left out.">
    <div className="grid gap-2.5 tablet:grid-cols-4">
      <div className={TILE}>
        <span className={VALUE}>{facts.foundedYear ?? "—"}</span>
        <span className="text-caption text-text">Founded in Kathmandu</span>
        <Link href={ADMIN_SECTIONS.settings.href} className="text-xs font-bold text-brand">
          From Site settings
        </Link>
      </div>
      <div className={TILE}>
        <span className={VALUE}>{facts.regionCount}</span>
        <span className="text-caption text-text">Trekking regions</span>
        <span className="text-xs text-muted-foreground">Counted from Regions</span>
      </div>
      <div className={TILE}>
        <TextField name="trekkersGuided" label="Trekkers guided" isLabelHidden defaultValue={values.trekkersGuided} placeholder="50+" maxLength={LIMIT.trekkersGuided} inputClassName="font-display text-xl font-extrabold" error={errors.trekkersGuided} />
        <span className="text-caption text-text">Trekkers guided</span>
        <span className="text-xs text-muted-foreground">Typed here, e.g. 50+ or 1,200</span>
      </div>
      <div className={TILE}>
        <TextField name="statValue" label="Fourth number" isLabelHidden defaultValue={values.statValue} placeholder="All" maxLength={LIMIT.statValue} inputClassName="font-display text-xl font-extrabold" error={errors.statValue} />
        <TextField name="statLabel" label="What it counts" isLabelHidden defaultValue={values.statLabel} placeholder="Guides from their own valleys" maxLength={LIMIT.statLabel} error={errors.statLabel} />
      </div>
    </div>
    <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
      <TextField name="safetyLead" label="Line under the beliefs: bold start" placeholder="All four rest on one rule:" defaultValue={values.safetyLead} maxLength={LIMIT.safetyLine} error={errors.safetyLead} />
      <TextField name="safetyText" label="Then" placeholder="your safety comes first." defaultValue={values.safetyText} maxLength={LIMIT.safetyLine} error={errors.safetyText} />
    </div>
  </FormSection>
);
