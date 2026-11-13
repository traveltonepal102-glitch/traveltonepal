import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeFact } from "../types";

/** The trek at a glance, as a row of tiles: only the facts filled in. One small <dl> per fact: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */
export const TrekFacts = ({ facts }: { facts: readonly HomeFact[] }) => (
  <ul aria-label="At a glance" className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] overflow-hidden rounded-[18px] border border-solid border-line bg-cloud">
    {facts.map((fact) => (
      <li key={fact.label} className="-mr-px -mb-px flex items-center gap-3 border-r border-b border-solid border-line px-4.5 py-4">
        <span className="inline-flex size-10 flex-none items-center justify-center rounded-[10px] bg-snow text-azure">
          <TrailIcon name={fact.icon} size={20} />
        </span>
        <dl className="min-w-0">
          <dt className="text-eyebrow font-semibold tracking-[0.06em] text-muted uppercase">{fact.label}</dt>
          <dd className="leading-5.5 font-semibold text-ink">{fact.value}</dd>
        </dl>
      </li>
    ))}
  </ul>
);
