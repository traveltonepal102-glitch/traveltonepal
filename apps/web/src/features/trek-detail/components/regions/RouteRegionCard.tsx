import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { formatAltitude } from "@/features/treks/format";

import type { TrekRouteStop } from "../../types";
import { PANEL, TEXT_ACTION } from "../styles";

const PLACE_LABELS: Record<TrekRouteStop["place"], string> = {
  start: "Starts here",
  through: "Passes through",
  end: "Ends here",
};

type RouteRegionCardProps = { stop: TrekRouteStop; number: number };

/** One region on the route: photo, its number and place on the route, its days, line and facts, and its page. */
export const RouteRegionCard = ({ stop, number }: RouteRegionCardProps) => {
  const facts: { icon: IconName; label: string; text: string }[] = [
    { icon: "altitude", label: "Highest point", text: stop.maxAltitudeM ? formatAltitude(stop.maxAltitudeM) : "" },
    { icon: "trending_up", label: "Difficulty", text: stop.difficulty ?? "" },
    { icon: "description", label: "Permits", text: stop.permits },
  ];

  return (
    <article className={`${PANEL} flex h-full flex-col overflow-hidden`}>
      <div className="relative aspect-[2/1] max-h-56 w-full bg-brand-tint">
        {stop.image ? (
          <SiteImage image={{ ...stop.image, alt: "" }} sizes="(min-width: 640px) 45vw, 100vw" className="object-cover" />
        ) : (
          <Icon name="landscape" size={40} className="absolute inset-0 m-auto text-brand/40" />
        )}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 py-1 pr-2.5 pl-1 text-xs font-extrabold text-navy">
          <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full bg-brand text-[11px] text-on-brand">
            {number}
          </span>
          {PLACE_LABELS[stop.place]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
          <h3 className="text-lg leading-snug font-extrabold text-ink">
            <span className="sr-only">Region {number}: </span>
            {stop.name}
          </h3>
          {stop.days && <p className="rounded-sm bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">{stop.days}</p>}
        </div>
        {stop.tagline && <p className="text-body-sm text-text">{stop.tagline}</p>}
        <dl className="flex flex-col gap-1.5 border-t border-muted pt-2.5 text-caption">
          {facts
            .filter((fact) => fact.text)
            .map((fact) => (
              <div key={fact.label}>
                <dt className="sr-only">{fact.label}</dt>
                {/* The icon sits inside the <dd>: a <dl> may hold only <dt>/<dd> pairs. */}
                <dd className="flex items-start gap-2 text-text">
                  <Icon name={fact.icon} size={16} className="mt-0.5 flex-none text-brand" />
                  <span>
                    <span aria-hidden="true" className="font-semibold text-ink">
                      {fact.label}:{" "}
                    </span>
                    {fact.text}
                  </span>
                </dd>
              </div>
            ))}
        </dl>
        <Link href={stop.href} className={`${TEXT_ACTION} mt-auto inline-flex items-center gap-1 self-start pt-1`}>
          {stop.href.startsWith("/regions/") ? `Explore the ${stop.name} region` : `See treks in ${stop.name}`}
          <Icon name="arrow_forward" size={14} />
        </Link>
      </div>
    </article>
  );
};
