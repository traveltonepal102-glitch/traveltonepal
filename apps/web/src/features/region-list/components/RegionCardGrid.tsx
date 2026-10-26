import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { formatAltitude } from "@/features/treks/format";
import { ROUTES } from "@/lib/routes";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { RegionListItem } from "../regionListItems";
import { trekCountLabel } from "../regionListItems";
import { RegionListHeading } from "./RegionListHeading";
import { RegionVisual } from "./RegionVisual";
import { ASK_ACTION, CARD, DIFFICULTY_CHIP, DIFFICULTY_CHIPS, PRIMARY_ACTION, SECONDARY_ACTION, WRAP } from "./styles";

const RegionCard = ({ region }: { region: RegionListItem }) => {
  // A fact not filled in yet in the admin is left out.
  const facts = (
    [
      { icon: "altitude", label: "Highest point", value: formatAltitude(region.maxAltitudeM) },
      { icon: "calendar_month", label: "Trek length", value: region.trekLength },
      { icon: region.access.isFlight ? "flight_takeoff" : "route", label: "Getting there", value: region.access.short },
    ] satisfies { icon: IconName; label: string; value: string }[]
  ).filter((fact) => fact.value);
  const bestFor = region.bestForTags[0];

  return (
    <article className={`${CARD} flex h-full flex-col overflow-hidden`}>
      <Link href={region.href} tabIndex={-1} aria-hidden="true" className="relative block aspect-video">
        <RegionVisual region={region} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-navy">
          <span className="inline-flex size-4.5 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">{region.number}</span>
          {region.district}
        </span>
        {bestFor && <span className="absolute top-3 right-3 rounded-sm bg-saffron px-2.5 py-1 text-[11px] font-extrabold text-ink">{bestFor}</span>}
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="text-[19px] font-bold">{region.name}</h3>
        {region.summary && <p className="text-caption font-normal text-text">{region.summary}</p>}
        <dl className="grid grid-cols-3 gap-1.5 border-y border-muted py-2.5 text-xs text-text">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt>
                <Icon name={fact.icon} size={16} className="text-brand" />
                <span className="sr-only">{fact.label}</span>
              </dt>
              <dd className="font-bold">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={`${DIFFICULTY_CHIP} ${DIFFICULTY_CHIPS[region.difficulty]}`}>{region.difficulty}</span>
          <span className="font-bold text-muted-foreground">{region.treks.length > 0 ? trekCountLabel(region.treks.length) : "Treks on request"}</span>
        </div>
        <div className="mt-auto flex gap-2 pt-1 text-body-sm">
          {region.isAskOnly ? (
            <a href={region.inquiryUrl} target="_blank" rel="noopener noreferrer" className={ASK_ACTION}>
              <WhatsAppLogo size={16} />
              Ask about this region
              <span className="sr-only">: {region.name}, on WhatsApp</span>
            </a>
          ) : (
            <Link href={region.href} className={PRIMARY_ACTION}>
              {region.hasPage ? "Explore region" : "See treks"}
              <span className="sr-only">: {region.name}</span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          )}
          {region.hasPage && (
            <Link href={region.treksHref} className={`${SECONDARY_ACTION} border border-line-strong text-ink hover:bg-page`}>
              Treks<span className="sr-only"> in {region.name}</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

/** "Explore the 9 regions": a card per region with its key facts and the way in (the count follows the data). */
export const RegionCardGrid = ({ regions }: { regions: readonly RegionListItem[] }) => (
  <section aria-labelledby="regions-all-title" className="pt-8 pb-10">
    <div className={`${WRAP} flex flex-col gap-4.5`}>
      <RegionListHeading
        id="regions-all-title"
        kicker="All regions"
        title={regions.length === 1 ? "Explore the region" : `Explore the ${regions.length} regions`}
        aside={
          <Link href={ROUTES.treks} className="inline-flex items-center gap-1.5 self-start rounded-sm font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-ring sm:self-auto">
            See all treks
            <Icon name="arrow_forward" size={16} />
          </Link>
        }
      />
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region.slug}>
            <RegionCard region={region} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
