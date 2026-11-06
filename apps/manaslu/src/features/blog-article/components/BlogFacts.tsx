import { TrailIcon } from "@/components/ui/TrailIcon";

import type { BlogArticle } from "../types";

/** The blog's key facts at a glance, as the admin typed them. */
export const BlogFacts = ({ facts }: { facts: BlogArticle["facts"] }) => {
  if (facts.length === 0) return null;

  return (
    <dl className="grid gap-x-6 gap-y-4 rounded-2xl bg-stone p-5 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="relative flex min-h-10 flex-col justify-center pl-13">
          <dt className="text-sm leading-5 text-muted">
            <span aria-hidden="true" className="absolute top-0 left-0 inline-flex size-10 items-center justify-center rounded-[10px] bg-snow text-forest">
              <TrailIcon name={fact.icon} size={20} />
            </span>
            {fact.label}
          </dt>
          <dd className="leading-5.5 font-semibold text-ink">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};
