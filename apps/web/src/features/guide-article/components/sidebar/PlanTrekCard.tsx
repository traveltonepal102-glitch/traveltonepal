import { getWhatsAppUrl } from "@ttn/config/contact";
import Link from "next/link";

import { formatAltitude, formatUsd } from "@/features/treks/format";
import type { TrekSummary } from "@/features/treks/types";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { FOCUS, KICKER } from "../styles";
import { TrekPhoto } from "../TrekPhoto";
import { trekHref } from "../trekHref";

const ACTION = `flex min-h-11 items-center justify-center gap-1.5 rounded-md font-bold ${FOCUS}`;

/** "Plan this trek": the article's trek with its price, a link to it and a WhatsApp question about dates. */
export const PlanTrekCard = ({ trek, guideTitle }: { trek: TrekSummary; guideTitle: string }) => (
  <section aria-labelledby="plan-trek-title" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-raised">
    <div className="relative aspect-16/10 bg-brand-tint">
      <TrekPhoto trek={trek} sizes="300px" />
    </div>
    <div className="flex flex-col gap-2.5 p-4">
      <p className={KICKER}>Plan this trek</p>
      <h2 id="plan-trek-title" className="text-[19px] font-bold">
        {trek.name}
      </h2>
      <ul className="flex flex-wrap gap-1.5 text-xs font-semibold text-text">
        {[`${trek.days} days`, trek.difficulty, formatAltitude(trek.maxAltitudeM)].map((fact) => (
          <li key={fact} className="rounded-md bg-muted px-2 py-0.75">
            {fact}
          </li>
        ))}
      </ul>
      {trek.priceFromUsd !== undefined && (
        <p className="flex items-baseline gap-1.5">
          <span className="text-xs text-muted-foreground">From</span>
          <span className="font-display text-[26px] font-extrabold text-brand">{formatUsd(trek.priceFromUsd)}</span>
          <span className="text-xs text-muted-foreground">/ person</span>
        </p>
      )}
      <Link href={trekHref(trek)} className={`${ACTION} bg-brand text-on-brand hover:bg-brand-hover`}>
        View trek details
      </Link>
      <a
        href={getWhatsAppUrl(`Hello! I'm reading your guide "${guideTitle}". Which dates would you suggest for the ${trek.name}?`)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ACTION} border border-green-line bg-green-tint text-[#0f5e2e] hover:border-whatsapp`}
      >
        <WhatsAppLogo size={18} className="text-whatsapp" />
        Ask about dates
      </a>
    </div>
  </section>
);
