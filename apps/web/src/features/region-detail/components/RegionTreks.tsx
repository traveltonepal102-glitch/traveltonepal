import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { RegionTileArt } from "@/features/regions/components/RegionTileArt";
import { regionInquiryUrl } from "@/features/regions/inquiry";
import { formatAltitude } from "@/features/treks/format";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import { trekPath } from "@/lib/routes";

import type { RegionDetail, RegionTrekPick } from "../types";
import { FeaturedTrekCard } from "./FeaturedTrekCard";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { CARD, WRAP } from "./styles";

const CARD_LINK = `${CARD} flex items-center gap-4 p-3 text-inherit transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`;

/** A nearby trek: links to its page, or to a WhatsApp chat while it has none. */
const NearbyTrekCard = ({ pick: { trek, label, note } }: { pick: RegionTrekPick }) => {
  const content = (
    <>
      <span className="relative h-28 w-37.5 flex-none overflow-hidden rounded-md bg-navy">
        {trek.image ? <SiteImage image={trek.image} sizes="150px" className="object-cover" /> : <RegionTileArt />}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{label}</span>
        <span className="font-display text-[19px] font-bold text-ink">{trek.name}</span>
        <span className="text-body-sm text-muted-foreground">
          {trek.days} days · {trek.difficulty} · max {formatAltitude(trek.maxAltitudeM)}
        </span>
        {note && <span className="text-body-sm text-text">{note}</span>}
      </span>
    </>
  );

  return trek.hasPage ? (
    <Link href={trekPath(trek.slug)} className={CARD_LINK}>
      {content}
    </Link>
  ) : (
    <a href={trekInquiryUrl(trek)} target="_blank" rel="noopener noreferrer" className={CARD_LINK}>
      {content}
    </a>
  );
};

/** "Trek in …": the signature trek, nearby treks and the offer of a custom route. */
export const RegionTreks = ({ region }: { region: RegionDetail }) => (
  <section id="treks" aria-labelledby="region-treks-title" className="scroll-mt-14 border-y border-line bg-surface py-14">
    <div className={`${WRAP} flex flex-col gap-6`}>
      <RegionSectionHeading id="region-treks-title" kicker="Treks" title={`Trek in ${region.name}`} />
      {region.featuredTrek && <FeaturedTrekCard pick={region.featuredTrek} />}
      <div className="grid gap-4.5 md:grid-cols-2">
        {region.nearbyTreks.map((pick) => (
          <NearbyTrekCard key={pick.trek.slug} pick={pick} />
        ))}
        <div className="flex items-center gap-4 rounded-lg border border-green-line bg-green-tint p-5 shadow-card">
          <span aria-hidden="true" className="inline-flex size-13 flex-none items-center justify-center rounded-lg bg-white text-whatsapp">
            <Icon name="tune" size={28} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[19px] font-bold">Want your own route?</h3>
            <p className="text-body-sm text-text">{region.customRoutePitch}</p>
            <a
              href={regionInquiryUrl(region.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start rounded-sm font-bold text-whatsapp hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              Plan it on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
