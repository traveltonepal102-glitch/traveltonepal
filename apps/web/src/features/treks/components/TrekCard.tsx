import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { trekPath } from "@/lib/routes";

import { formatAltitude, formatUsd } from "../format";
import type { TrekSummary } from "../types";
import { TrekFacts } from "./TrekFacts";
import { TrekPhotoPlaceholder } from "./TrekPhotoPlaceholder";

/**
 * Trek card (design: Main.dc.html, "Treks trekkers book first"). Two tab stops only: the trek name,
 * a link stretched over the whole card ("View trek" is its visual button), and the WhatsApp button.
 */
export const TrekCard = ({ trek }: { trek: TrekSummary }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-raised has-[[data-trek-link]:focus-visible]:outline-2 has-[[data-trek-link]:focus-visible]:outline-offset-2 has-[[data-trek-link]:focus-visible]:outline-ring">
    <div className="relative h-50 bg-brand-tint">
      {trek.image ? (
        <Image
          src={trek.image.src}
          alt={trek.image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 85vw"
          className="object-cover"
        />
      ) : (
        <TrekPhotoPlaceholder />
      )}
      <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-navy">
        <Icon name="location_on" size={14} className="text-brand" />
        {trek.region}
      </span>
    </div>

    <div className="flex grow flex-col gap-3.5 px-5 pt-4.5 pb-5">
      <h3 className="text-h3">
        <Link href={trekPath(trek.slug)} data-trek-link className="outline-none after:absolute after:inset-0">
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
          href={getWhatsAppUrl(`Hello! I would like to know more about the ${trek.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ask about the ${trek.name} on WhatsApp`}
          className="relative z-10 inline-flex size-12 flex-none items-center justify-center rounded-full bg-whatsapp text-white transition-colors hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Icon name="chat" size={22} />
        </a>
      </div>
    </div>
  </article>
);
