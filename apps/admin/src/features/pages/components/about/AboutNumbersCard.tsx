import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../../constants";
import type { AboutFacts } from "../../types";

type AboutNumbersCardProps = { trekkersGuided: string; facts: AboutFacts; errors: FieldErrors };

const TILE = "flex flex-col gap-1.5 rounded-xl border border-solid border-border bg-page p-2.5";
const VALUE = "font-display text-xl font-extrabold text-ink";

/** "Four numbers under the heading": only "trekkers guided" is typed; the others fill in by themselves, so they stay true. */
export const AboutNumbersCard = ({ trekkersGuided, facts, errors }: AboutNumbersCardProps) => (
  <FormSection title="Four numbers under the heading" hint="Keep them true and up to date. Change “trekkers guided” once a year. A number that is empty is left out.">
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
        <TextField name="trekkersGuided" label="Trekkers guided" isLabelHidden defaultValue={trekkersGuided} placeholder="1,200+" maxLength={LIMIT.trekkersGuided} inputClassName="font-display text-xl font-extrabold" error={errors.trekkersGuided} />
        <span className="text-caption text-text">Trekkers guided</span>
        <span className="text-xs text-muted-foreground">Typed here</span>
      </div>
      <div className={TILE}>
        <span className={VALUE}>—</span>
        <span className="text-caption text-text">Average review score</span>
        <span className="text-xs text-muted-foreground">From Reviews, once there are real ones</span>
      </div>
    </div>
    <span className="text-xs text-muted-foreground">The links under the numbers (Our story, Why us, Team…) are made from the sections below by themselves.</span>
  </FormSection>
);
