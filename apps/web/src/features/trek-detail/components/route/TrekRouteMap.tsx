import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

import { googleMapLinks } from "../../routeMap";
import { routeStops } from "../../routeStops";
import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { PANEL } from "../styles";
import { GoogleMapEmbed } from "./GoogleMapEmbed";
import { RouteMapPreview } from "./RouteMapPreview";
import { RouteStopList } from "./RouteStopList";

type TrekRouteMapProps = Pick<TrekDetail, "name" | "routeMap" | "routeSketch" | "itinerary"> & { heading: string };

const MAP_LINK =
  "inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2 text-xs font-bold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * "Route and GPS waypoints": the Google map (click to load) with the drawn route map before it, and the stops.
 * "Download PDF map" shows when the admin uploaded a printable map.
 */
export const TrekRouteMap = ({ heading, name, routeMap, routeSketch, itinerary }: TrekRouteMapProps) => {
  const links = googleMapLinks(routeMap);
  const stops = routeStops(itinerary.days);

  return (
    <section id={TREK_SECTION_IDS.routeMap} aria-labelledby="trek-route-map-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeading id="trek-route-map-title" eyebrow="Route and GPS waypoints" title={heading} />
        <div className="flex flex-none flex-wrap gap-2 self-start">
          <a href={links.openUrl} target="_blank" rel="noopener noreferrer" className={MAP_LINK}>
            <Icon name="open_in_new" size={16} className="text-brand" />
            Open in Google Maps
          </a>
          {routeMap.pdfUrl && (
            <a href={routeMap.pdfUrl} target="_blank" rel="noopener noreferrer" type="application/pdf" className={MAP_LINK}>
              <Icon name="download" size={16} className="text-brand" />
              Download PDF map
            </a>
          )}
        </div>
      </div>

      <div className={`${PANEL} p-4.5 md:p-5`}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="inline-flex items-center gap-2 text-[15px] font-bold">
            <Icon name="pin_drop" className="flex-none text-brand" />
            Google interactive trail and waypoint map
          </h3>
          <p className="flex-none rounded-sm border border-green-line bg-green-tint px-2.5 py-0.5 text-[11px] font-semibold text-whatsapp">
            {links.hasTrailLine ? "GPS trail route" : "Interactive map"}
          </p>
        </div>

        <GoogleMapEmbed
          embedUrl={links.embedUrl}
          title={`Google map of the ${name}`}
          preview={routeSketch && <RouteMapPreview sketch={routeSketch} />}
        />

        {stops.length > 0 && <RouteStopList stops={stops} />}

        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Icon name="lock" size={14} className="flex-none" />
          <span>
            Interactive map by Google Maps. See our{" "}
            <Link href={ROUTES.privacy} className="rounded-sm underline hover:text-brand focus-visible:outline-2 focus-visible:outline-ring">
              privacy policy
            </Link>{" "}
            for how Google handles your data.
          </span>
        </p>
      </div>
    </section>
  );
};
