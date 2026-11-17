import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";
import { formatAltitude } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

import type { HomeDay, HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";
import { RouteMapFrame } from "./RouteMapFrame";

type TrekRouteMapProps = { name: string; routeMap: NonNullable<HomeTrek["routeMap"]>; days: readonly HomeDay[] };

const FileLink = ({ href, icon, title, text, isDownload = false }: { href: string; icon: TrailIconName; title: string; text: string; isDownload?: boolean }) => (
  <a
    href={href}
    {...(isDownload ? { download: true } : { target: "_blank", rel: "noopener noreferrer", type: "application/pdf" })}
    className="flex items-center gap-3.5 rounded-[20px] border border-solid border-line bg-snow px-4.5 py-4 text-ink no-underline hover:border-maroon"
  >
    <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-cream text-maroon">
      <TrailIcon name={icon} size={20} />
    </span>
    <span className="flex-1 leading-5.5">
      <strong className="font-semibold">{title}</strong>
      <span className="block text-sm text-muted">{text}</span>
    </span>
    <TrailIcon name="arrow" size={18} className="rotate-90 text-maroon" />
  </a>
);

/**
 * "Where you walk" (design: Route map, from the content the trek has): the Google map of the route, and beside it the
 * nights from the itinerary (the high pass and side trips noted) and the files to download, those the trek has.
 */
export const TrekRouteMap = ({ name, routeMap, days }: TrekRouteMapProps) => (
  <section aria-labelledby="route-map-h" id="route_map" className="flex flex-col gap-8">
    <SectionHeading id="route-map-h" eyebrow="Where you walk" title={routeMap.heading}>
      <HeadingLine doc={routeMap.line} />
    </SectionHeading>
    <div className="flex flex-wrap items-stretch gap-6">
      <div className="flex min-w-0 flex-[999_1_620px] flex-col gap-2">
        <RouteMapFrame embedUrl={routeMap.embedUrl} title={`Google map of the ${name}`} hidesTitleBar={routeMap.hasTrailLine} />
        <p className="m-0 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm leading-5 text-muted">
          <span>
            Map by Google Maps. See our{" "}
            <Link href={ROUTES.privacy} className="underline">
              privacy policy
            </Link>{" "}
            for how Google handles your data.
          </span>
          <a href={routeMap.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold">
            <TrailIcon name="map" size={16} />
            Open in Google Maps
          </a>
        </p>
      </div>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
        {days.length > 0 && (
          <div className="flex-1 overflow-hidden rounded-[20px] border border-solid border-line bg-snow">
            <p className="m-0 flex max-w-none items-center justify-between border-0 border-b border-solid border-line px-5 py-4">
              <strong className="text-lg font-semibold text-ink">Overnight stops</strong>
              <span className="text-[13px] text-muted">From the itinerary</span>
            </p>
            <ol className="m-0 list-none p-0">
              {days.map((day) => (
                <li key={day.number} className={`grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 border-0 border-t border-solid border-cream px-5 py-2.5 first:border-t-0 ${day.isHighPoint ? "bg-saffron-tint shadow-[inset_3px_0_0_var(--color-saffron)]" : ""}`}>
                  <span aria-hidden="true" className={`inline-flex size-7.5 items-center justify-center rounded-full text-[13px] font-bold ${day.isHighPoint ? "bg-saffron text-ink" : "bg-maroon text-snow"}`}>
                    {day.number}
                  </span>
                  <span className="leading-5">
                    <span className="sr-only">Day {day.number}: </span>
                    <strong className="font-semibold text-ink">{day.place || day.title}</strong>
                    {day.altitudeM > day.nightAltitudeM && day.topPlace && (
                      <span className={`block text-[13px] ${day.isHighPoint ? "text-saffron-ink" : "text-muted"}`}>
                        {day.isHighPoint ? "Crosses" : "Visits"} {day.topPlace} · {formatAltitude(day.altitudeM)}
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-muted">{formatAltitude(day.nightAltitudeM)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {routeMap.pdfUrl && <FileLink href={routeMap.pdfUrl} icon="doc" title="Download PDF map" text="Print it for the trail" />}
        {routeMap.gpxUrl && <FileLink href={routeMap.gpxUrl} icon="route" title="GPS track (GPX)" text="For your phone or watch" isDownload />}
      </div>
    </div>
  </section>
);
