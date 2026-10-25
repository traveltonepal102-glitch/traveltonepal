import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { formatAltitude } from "@/features/treks/format";

import type { RegionListItem } from "../regionListItems";
import { RegionTrekLinks } from "./RegionTrekLinks";
import { RegionVisual } from "./RegionVisual";
import { ASK_ACTION, PRIMARY_ACTION, SECONDARY_ACTION } from "./styles";

/** The region picked on the map: photo, facts, its treks and the way into it. */
export const SelectedRegionCard = ({ region }: { region: RegionListItem }) => {
  const shortName = region.shortName ?? region.name;
  // A fact not filled in yet in the admin is left out.
  const facts = (
    [
      { icon: "altitude", label: "Max altitude", value: formatAltitude(region.maxAltitudeM) },
      { icon: "calendar_month", label: "Trek length", value: region.trekLength },
      { icon: region.access.isFlight ? "flight_takeoff" : "route", label: "Getting there", value: region.access.short },
      { icon: "description", label: "Permits", value: region.permits },
    ] satisfies { icon: IconName; label: string; value: string }[]
  ).filter((fact) => fact.value);

  return (
    <aside
      aria-live="polite"
      aria-label={`${region.name} region`}
      className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-video">
        <RegionVisual region={region} sizes="(min-width: 1024px) 420px, 100vw" />
        <p className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy/85 px-2.5 py-1 text-xs font-bold text-white">
          <span className="inline-flex size-4.5 items-center justify-center rounded-full bg-saffron text-[11px] font-extrabold text-ink">{region.number}</span>
          {[region.district, region.trekLength].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4.5">
        <h3 className="text-[22px] font-extrabold">{region.name}</h3>
        {region.summary && <p className="text-body-sm text-text">{region.summary}</p>}
        <dl className="grid grid-cols-2 gap-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-center gap-2 rounded-md border border-[#eef2f6] bg-page px-2.5 py-2 text-xs leading-snug">
              <Icon name={fact.icon} size={18} className="flex-none text-brand" />
              <div className="flex flex-col">
                <dt className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">{fact.label}</dt>
                <dd className="font-bold text-ink">{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        {region.treks.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">Treks in this region</p>
            <RegionTrekLinks treks={region.treks} />
          </div>
        )}
        {region.isAskOnly ? (
          <div className="mt-auto flex pt-1">
            <a href={region.inquiryUrl} target="_blank" rel="noopener noreferrer" className={ASK_ACTION}>
              <Icon name="chat" size={18} />
              Ask about {shortName}
              <span className="sr-only"> on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="mt-auto flex gap-2 pt-1">
            <Link href={region.href} className={PRIMARY_ACTION}>
              {region.hasPage ? `Explore ${shortName}` : `See ${shortName} treks`}
              <Icon name="arrow_forward" size={16} />
            </Link>
            <a
              href={region.inquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${SECONDARY_ACTION} border border-green-line bg-green-tint text-whatsapp hover:bg-green-line/60`}
            >
              <Icon name="chat" size={18} />
              Ask
              <span className="sr-only">about {region.name} on WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};
