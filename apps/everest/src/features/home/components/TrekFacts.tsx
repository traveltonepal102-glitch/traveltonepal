import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeFact } from "../types";

/** The trek at a glance (design: the key-facts strip under the top): only the facts filled in, each with its round icon. */
export const TrekFacts = ({ facts }: { facts: readonly HomeFact[] }) => (
  <ul className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-solid border-line bg-snow p-1.5 sm:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] sm:p-2">
    {facts.map((fact) => (
      <li key={fact.label} className="flex items-center gap-3 rounded-2xl px-2.5 py-3 sm:gap-3.5 sm:px-4 sm:py-4">
        <span className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-ice text-ocean sm:size-11">
          <TrailIcon name={fact.icon} size={20} />
        </span>
        {/* One small <dl> per fact: a <dl> may hold only <dt>/<dd> pairs, not the icon beside them. */}
        <dl className="m-0 min-w-0 leading-5">
          <dt className="text-[13px] text-muted">{fact.label}</dt>
          <dd className="m-0 text-[15px] leading-5 font-semibold text-ink sm:text-[17px] sm:leading-5.5">{fact.value}</dd>
        </dl>
      </li>
    ))}
  </ul>
);
