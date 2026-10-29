import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SiteImage } from "@/components/ui/SiteImage";
import { RegionTileArt } from "@/features/regions/components/RegionTileArt";
import { regionInquiryEmailUrl, regionInquiryUrl } from "@/features/regions/inquiry";
import { formatAltitude } from "@/features/treks/format";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { regionBreadcrumbs } from "../seo";
import type { RegionDetail } from "../types";
import { PILL, WRAP } from "./styles";

/** Full-width photo hero (drawn ridges until a cover photo is set): breadcrumb, location and season, the name, chips, two actions. */
export const RegionHero = ({ region }: { region: RegionDetail }) => {
  const allChips: readonly { icon: IconName; text: string }[] = [
    { icon: "altitude", text: `Up to ${formatAltitude(region.maxAltitudeM)}` },
    { icon: "calendar_month", text: region.trekLength },
    { icon: "speed", text: region.difficulty },
    { icon: "directions_walk", text: region.heroHighlight },
  ];
  const chips = allChips.filter((chip) => chip.text);

  return (
    <section aria-labelledby="region-title" className="relative flex min-h-140 items-end overflow-hidden bg-navy md:min-h-150">
      {region.image ? <SiteImage image={region.image} sizes="100vw" priority className="object-cover" /> : <RegionTileArt />}
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/20 via-navy/50 via-45% to-navy/92" />

      <div className={`${WRAP} relative flex flex-col gap-4.5 pt-12 pb-24 text-white`}>
        <Breadcrumbs tone="onDark" items={regionBreadcrumbs(region)} />
        <div className="flex flex-wrap gap-2">
          {region.district && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-saffron px-3 py-1.5 text-caption font-bold text-navy">
              <Icon name="location_on" size={16} />
              {region.district}, Nepal
            </p>
          )}
          {region.bestMonthsLabel && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp/92 px-3 py-1.5 text-caption font-bold text-white">
              <Icon name="wb_sunny" size={16} />
              Best: {region.bestMonthsLabel}
            </p>
          )}
        </div>
        <h1 id="region-title" className="text-[44px] leading-none font-extrabold tracking-tight text-white md:text-display-xl">
          {region.name}
        </h1>
        {region.tagline && <p className="max-w-160 text-body-lg text-white/90 md:text-[19px]">{region.tagline}</p>}
        <ul className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li
              key={chip.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/28 bg-white/14 px-3 py-1.75 text-caption font-semibold backdrop-blur-md"
            >
              <Icon name={chip.icon} size={16} className="text-saffron" />
              {chip.text}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 pt-1.5 sm:flex-row sm:items-center">
          <a href="#treks" className={`${PILL} bg-white text-navy hover:bg-brand-tint focus-visible:outline-white`}>
            See {region.name} treks
            <Icon name="arrow_downward" />
          </a>
          <a
            href={regionInquiryUrl(region.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${PILL} bg-whatsapp text-white hover:bg-whatsapp/90 focus-visible:outline-white`}
          >
            <WhatsAppLogo />
            Plan {region.name} on WhatsApp
          </a>
          <a href={regionInquiryEmailUrl(region.name)} className={`${PILL} border-[1.5px] border-white/55 text-white hover:bg-white/10 focus-visible:outline-white`}>
            <Icon name="mail" />
            Email us
          </a>
        </div>
      </div>
    </section>
  );
};
