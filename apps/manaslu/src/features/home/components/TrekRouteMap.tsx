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
      <SectionHeading id="route-map-h" eyebrow="Where you walk" title={routeMap.heading}>
        <HeadingLine doc={routeMap.line} />
      </SectionHeading>
      <div className="flex flex-wrap gap-x-5">
        <a href={routeMap.openUrl} target="_blank" rel="noopener noreferrer" className={MAP_LINK}>
          <TrailIcon name="map" />
          Open in Google Maps
        </a>
        {routeMap.pdfUrl && (
          <a href={routeMap.pdfUrl} target="_blank" rel="noopener noreferrer" type="application/pdf" className={MAP_LINK}>
            <TrailIcon name="doc" />
            Printable map (PDF)
          </a>
        )}
      </div>
    </div>
    <RouteMapFrame embedUrl={routeMap.embedUrl} title={`Google map of the ${name}`} hidesTitleBar={routeMap.hasTrailLine} />
    <p className="text-sm leading-5 text-muted">
      Map by Google Maps. See our{" "}
      <Link href={ROUTES.privacy} className="underline">
        privacy policy
      </Link>{" "}
      for how Google handles your data.
    </p>
  </section>
);
