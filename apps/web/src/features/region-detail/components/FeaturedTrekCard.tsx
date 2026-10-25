import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { RegionTileArt } from "@/features/regions/components/RegionTileArt";
import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { formatAltitude, formatUsd } from "@/features/treks/format";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import { trekPath } from "@/lib/routes";

import type { RegionTrekPick } from "../types";
import { CARD, PILL } from "./styles";

/**
 * The region's signature trek: photo with badges, facts, price and its actions. While the trek has no page, asking
 * on WhatsApp is the main action.
 */
export const FeaturedTrekCard = ({ pick }: { pick: RegionTrekPick }) => {
  const { trek, label, note } = pick;
  const hasPage = hasTrekPage(trek.slug);
  const meta: readonly { icon: IconName; text: string }[] = [
    { icon: "calendar_month", text: `${trek.days} days` },
    { icon: "speed", text: trek.difficulty },
    { icon: "altitude", text: `Max ${formatAltitude(trek.maxAltitudeM)}` },
    { icon: "groups", text: "Private group" },
  ];

  return (
    <article className={`${CARD} grid overflow-hidden lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]`}>
      <div className="relative min-h-60 bg-navy lg:min-h-85">
        {trek.image ? <SiteImage image={trek.image} sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" /> : <RegionTileArt />}
        <p className="absolute top-4 left-4 flex flex-wrap gap-1.5 text-xs font-extrabold">
          {trek.badge && <span className="rounded-full bg-saffron px-3 py-1.25 text-navy">{trek.badge}</span>}
          {trek.hasFixedDates && <span className="rounded-full bg-white/94 px-3 py-1.25 text-brand">Fixed dates</span>}
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
        {note && <p className="text-text">{note}</p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3.5 border-t border-[#eef2f6] pt-3">
          {trek.priceFromUsd ? (
            <p>
              <span className="text-caption text-muted-foreground">From </span>
              <span className="font-display text-price text-navy">{formatUsd(trek.priceFromUsd)}</span>
              <span className="text-caption text-muted-foreground"> per person</span>
            </p>
          ) : (
            <p className="font-display text-h4 text-navy">Price on request</p>
          )}
          <div className="flex flex-wrap gap-2.5">
            {hasPage && (
              <Link href={trekPath(trek.slug)} className={`${PILL} bg-brand text-on-brand hover:bg-brand-hover focus-visible:outline-ring`}>
                View trek
              </Link>
            )}
            <a
              href={trekInquiryUrl(trek)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${PILL} focus-visible:outline-ring ${
                hasPage ? "border border-whatsapp bg-surface text-whatsapp hover:bg-green-tint" : "bg-whatsapp text-white hover:bg-whatsapp/90"
              }`}
            >
              <Icon name="chat" size={18} />
              {hasPage ? "Ask" : "Ask on WhatsApp"}
              <span className="sr-only">
                about the {trek.name}
                {hasPage && " on WhatsApp"}
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
