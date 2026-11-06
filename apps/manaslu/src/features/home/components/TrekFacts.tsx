import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeFact } from "../types";

/** The trek at a glance: only the facts filled in. One small <dl> per fact: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */
export const TrekFacts = ({ facts }: { facts: readonly HomeFact[] }) => (
  <ul className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] overflow-hidden rounded-[14px] border border-solid border-line">
    {facts.map((fact) => (
      <li key={fact.label} className="-mr-px -mb-px flex items-center gap-3.5 border-r border-b border-solid border-line px-5 py-4.5">
        <span className="inline-flex size-11 flex-none items-center justify-center rounded-[10px] bg-forest-tint text-forest">
          <TrailIcon name={fact.icon} size={22} />
        </span>
        <dl>
          <dt className="text-eyebrow font-semibold tracking-[0.06em] text-muted uppercase">{fact.label}</dt>
          <dd className="leading-5.5 font-semibold text-ink">{fact.value}</dd>
        </dl>
      </li>
    ))}
  </ul>
);
