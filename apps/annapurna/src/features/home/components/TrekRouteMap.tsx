import Link from "next/link";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import type { HomeTrek } from "../types";
import { HeadingLine } from "./HeadingLine";
import { RouteMapFrame } from "./RouteMapFrame";

const MAP_LINK = "inline-flex min-h-11 items-center gap-1.5 font-semibold";

/** The route on a Google map (click to load), with links to open it in Google Maps and to the printable map. */
export const TrekRouteMap = ({ name, routeMap }: { name: string; routeMap: NonNullable<HomeTrek["routeMap"]> }) => (
  <section aria-labelledby="route-map-h" id="route_map" className="flex flex-col gap-5">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <SectionHeading id="route-map-h" eyebrow="Ihre Route" title={routeMap.heading}>
        <HeadingLine doc={routeMap.line} />
      </SectionHeading>
      <div className="flex flex-wrap gap-x-5">
        <a href={routeMap.openUrl} target="_blank" rel="noopener noreferrer" className={MAP_LINK}>
          <TrailIcon name="map" />
          In Google Maps öffnen
        </a>
        {routeMap.pdfUrl && (
          <a href={routeMap.pdfUrl} target="_blank" rel="noopener noreferrer" type="application/pdf" className={MAP_LINK}>
            <TrailIcon name="doc" />
            PDF-Karte herunterladen
          </a>
        )}
        {routeMap.gpxUrl && (
          <a href={routeMap.gpxUrl} download className={MAP_LINK}>
            <TrailIcon name="route" />
            GPS-Track (GPX)
          </a>
        )}
      </div>
    </div>
    <RouteMapFrame embedUrl={routeMap.embedUrl} title={`Google-Karte zum ${name}`} hidesTitleBar={routeMap.hasTrailLine} />
    <p className="text-sm leading-5 text-muted">
      Karte von Google Maps. Wie Google mit Ihren Daten umgeht, lesen Sie in unserer{" "}
      <Link href={ROUTES.privacy} className="underline">
        Datenschutzerklärung
      </Link>
      .
    </p>
  </section>
);
