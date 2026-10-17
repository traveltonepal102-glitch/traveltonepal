import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { departureOptions } from "@/features/trek-detail/pricing";
import type { TrekDetail } from "@/features/trek-detail/types";
import { formatAltitude, formatUsd } from "@/features/treks/format";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import { trekPath } from "@/lib/routes";

import { CARD, PILL } from "./styles";

type FeaturedTrekCardProps = { trek: TrekDetail; label: string; pitch: string };

/** The region's signature trek: photo with badges, facts, price, next departure and two actions. */
export const FeaturedTrekCard = ({ trek, label, pitch }: FeaturedTrekCardProps) => {
  const photo = trek.image ?? trek.photos[0];
  const nextDeparture = departureOptions(trek.departures)[0];
  const meta: readonly { icon: IconName; text: string }[] = [
    { icon: "calendar_month", text: `${trek.days} days` },
    { icon: "speed", text: trek.difficulty },
    { icon: "altitude", text: `Max ${formatAltitude(trek.maxAltitudeM)}` },
    { icon: "groups", text: "Private group" },
  ];

  return (
    <article className={`${CARD} grid overflow-hidden lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]`}>
      <div className="relative min-h-60 lg:min-h-85">
        {photo && <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />}
        <p className="absolute top-4 left-4 flex flex-wrap gap-1.5 text-xs font-extrabold">
          {trek.badge && <span className="rounded-full bg-saffron px-3 py-1.25 text-navy">{trek.badge}</span>}
          {trek.departures.length > 0 && (
            <span className="rounded-full bg-white/94 px-3 py-1.25 text-brand">{trek.departures.length} fixed dates</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3.5 p-4.5 md:p-7">
        <p className="text-xs font-bold tracking-widest text-whatsapp uppercase">{label}</p>
        <h3 className="text-[28px] leading-tight font-bold">{trek.name}</h3>
        <ul className="flex flex-wrap gap-2">
          {meta.map((item) => (
            <li key={item.text} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-page px-2.5 py-1.25 text-caption font-semibold text-ink">
              <Icon name={item.icon} size={16} className="text-brand" />
              {item.text}
            </li>
          ))}
        </ul>
        <p className="text-text">{pitch}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3.5 border-t border-[#eef2f6] pt-3">
          <div>
            {trek.priceFromUsd ? (
              <p>
                <span className="text-caption text-muted-foreground">From </span>
                <span className="font-display text-price text-navy">{formatUsd(trek.priceFromUsd)}</span>
                <span className="text-caption text-muted-foreground"> per person</span>
              </p>
            ) : (
              <p className="font-display text-h4 text-navy">Price on request</p>
            )}
            {nextDeparture && (
              <p className="text-caption font-semibold text-whatsapp">
                Next departure: {nextDeparture.label} · {nextDeparture.note}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href={trekPath(trek.slug)} className={`${PILL} bg-brand text-on-brand hover:bg-brand-hover focus-visible:outline-ring`}>
              View trek
            </Link>
            <a
              href={trekInquiryUrl(trek)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PILL} border border-whatsapp bg-surface text-whatsapp hover:bg-green-tint focus-visible:outline-ring`}
            >
              <Icon name="chat" size={18} />
              Ask
              <span className="sr-only">about the {trek.name} on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
