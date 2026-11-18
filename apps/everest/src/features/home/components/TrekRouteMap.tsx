import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import type { TrailIconName } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import type { HomeDay, HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";
import { RouteMapFrame } from "./RouteMapFrame";
import { RouteStops } from "./RouteStops";

type TrekRouteMapProps = { name: string; routeMap: NonNullable<HomeTrek["routeMap"]>; days: readonly HomeDay[] };

const FileLink = ({ href, icon, title, text, isDownload = false }: { href: string; icon: TrailIconName; title: string; text: string; isDownload?: boolean }) => (
  <a
    href={href}
    {...(isDownload ? { download: true } : { target: "_blank", rel: "noopener noreferrer", type: "application/pdf" })}
    className="flex items-center gap-3.5 rounded-[20px] border border-solid border-line bg-snow px-4.5 py-4 text-ink no-underline hover:border-ocean"
  >
    <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-ice text-ocean">
      <TrailIcon name={icon} size={20} />
    </span>
    <span className="flex-1 leading-5.5">
      <strong className="font-semibold">{title}</strong>
      <span className="block text-sm text-muted">{text}</span>
    </span>
    <TrailIcon name="arrow" size={18} className="rotate-90 text-ocean" />
  </a>
);

/**
 * "Deine Route" (design: Route map, from the content the trek has): the Google map of the route with the files to
 * download under it (those the trek has), and beside it the nights from the itinerary (RouteStops), as tall as the map.
 */
export const TrekRouteMap = ({ name, routeMap, days }: TrekRouteMapProps) => (
  <section aria-labelledby="route-map-h" id="route_map" className="flex flex-col gap-8">
    <SectionHeading id="route-map-h" eyebrow="Deine Route" title={routeMap.heading} isWide>
      <HeadingLine doc={routeMap.line} />
    </SectionHeading>
    <div className={`grid items-start gap-6 ${days.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
      <div className="flex min-w-0 flex-col gap-3">
        <RouteMapFrame embedUrl={routeMap.embedUrl} title={`Google-Karte zum ${name}`} hidesTitleBar={routeMap.hasTrailLine} />
        <p className="m-0 flex max-w-none flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-sm leading-5 text-muted">
          <span>
            Karte von Google Maps. Wie Google mit deinen Daten umgeht, liest du in unserer{" "}
            <Link href={ROUTES.privacy} className="underline">
              Datenschutzerklärung
            </Link>
            .
          </span>
          <a href={routeMap.openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
            <TrailIcon name="map" size={16} />
            In Google Maps öffnen
          </a>
        </p>
        {(routeMap.pdfUrl || routeMap.gpxUrl) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {routeMap.pdfUrl && <FileLink href={routeMap.pdfUrl} icon="doc" title="PDF-Karte herunterladen" text="Zum Ausdrucken für unterwegs" />}
            {routeMap.gpxUrl && <FileLink href={routeMap.gpxUrl} icon="route" title="GPS-Track (GPX)" text="Für dein Handy oder deine Uhr" isDownload />}
          </div>
        )}
      </div>
      {days.length > 0 && <RouteStops days={days} />}
    </div>
  </section>
);
