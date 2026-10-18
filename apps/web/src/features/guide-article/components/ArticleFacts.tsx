import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";

import type { GuideFact } from "../types";
import { WRAP } from "./styles";

/** Key facts strip under the hero: four across from 1280px, two on tablets and small laptops, one on phones. */
export const ArticleFacts = ({ facts }: { facts: readonly GuideFact[] }) => {
  if (facts.length === 0) return null;

  return (
    <section aria-label="Key facts" className="border-b border-line bg-page">
      <dl className={`${WRAP} grid gap-5 py-5.5 sm:grid-cols-2 xl:grid-cols-4`}>
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center gap-3.5">
            <span aria-hidden="true" className={`inline-flex size-13.5 flex-none items-center justify-center rounded-xl ${ICON_TONES[fact.tone]}`}>
              <Icon name={fact.icon} size={26} />
            </span>
            <div className="flex flex-col leading-tight">
              <dt className="text-[13px] font-semibold tracking-[0.04em] text-muted-foreground uppercase">{fact.label}</dt>
              <dd className="font-display text-xl font-bold text-ink">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};
