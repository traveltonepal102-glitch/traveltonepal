import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { trekPath } from "@/lib/routes";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { formatAltitude, formatUsd } from "../format";
import { trekInquiryUrl } from "../inquiry";
import type { TrekSummary } from "../types";
import { CARD_FOCUS_RING, STRETCHED_LINK } from "./cardStyles";
import { TrekCardMedia } from "./TrekCardMedia";
import { TrekFacts } from "./TrekFacts";

/**
 * Feature trek card (design: Main.dc.html, "Treks trekkers book first"). Two tab stops only: the trek
 * name, a link stretched over the whole card ("View trek" is its visual button), and the WhatsApp button.
 */
export const TrekCard = ({ trek }: { trek: TrekSummary }) => (
  <article
    className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-raised ${CARD_FOCUS_RING}`}
  >
    <TrekCardMedia trek={trek} className="h-50" sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 85vw" />

    <div className="flex grow flex-col gap-3.5 px-5 pt-4.5 pb-5">
      <h3 className="text-h3">
        <Link href={trekPath(trek.slug)} data-trek-link className={STRETCHED_LINK}>
          {trek.name}
        </Link>
      </h3>
      <TrekFacts days={trek.days} difficulty={trek.difficulty} altitude={formatAltitude(trek.maxAltitudeM)} />

      <p className="mt-auto flex items-baseline gap-2 border-t border-line pt-3 text-caption text-muted-foreground">
        {trek.priceFromUsd ? (
          <>
            From
            <span className="font-display text-price text-brand">{formatUsd(trek.priceFromUsd)}</span>
            per person
          </>
        ) : (
          <span className="font-display text-h4 text-brand">Price on request</span>
        )}
      </p>

      <div className="flex gap-2.5">
        <span
          aria-hidden="true"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-navy px-4 font-bold whitespace-nowrap text-white transition-colors group-hover:bg-brand"
        >
          View trek
          <Icon name="arrow_forward" size={18} />
        </span>
        <a
          href={trekInquiryUrl(trek)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ask about the ${trek.name} on WhatsApp`}
          className="relative z-10 inline-flex size-12 flex-none items-center justify-center rounded-full bg-whatsapp text-white transition-colors hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <WhatsAppLogo size={22} />
        </a>
      </div>
    </div>
  </article>
);
