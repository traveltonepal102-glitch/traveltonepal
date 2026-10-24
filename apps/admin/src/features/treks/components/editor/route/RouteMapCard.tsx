"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../../constants";
import { googleMapsUrl, myMapsViewerUrl, parseMyMapsId } from "../../../lib/googleMaps";
import type { TrekValues } from "../../../types";
import { PageHeadingFields } from "../PageHeadingFields";
import { PdfMapField } from "./PdfMapField";

type RouteMapCardProps = {
  values: Pick<TrekValues, "mapPlace" | "myMapsId" | "itinerary" | "trekStart" | "trekEnd" | "pdfMapPath" | "routeMapHeading">;
  /** Where the saved PDF map downloads from (null without one). */
  pdfMapUrl: string | null;
  errors: FieldErrors;
  onEdit: () => void;
};

/** The day-by-day places in order, each once in a row (a rest day stays in the same place). */
const routeStops = (itinerary: TrekValues["itinerary"]) =>
  itinerary.map((day) => day.place.trim()).filter((place, index, places) => place && place !== places[index - 1]);

/**
 * "Route and GPS waypoints" on the trek page: its heading, where the trek starts and ends, the Google map (a place
 * to centre on, or a My Maps map with the GPS trail), the stops, and the printable PDF map.
 */
export const RouteMapCard = ({ values, pdfMapUrl, errors, onEdit }: RouteMapCardProps) => {
  const [place, setPlace] = useState(values.mapPlace);
  const [link, setLink] = useState(values.myMapsId ? myMapsViewerUrl(values.myMapsId) : "");
  const parsed = parseMyMapsId(link);
  const myMapsId = parsed.ok ? parsed.id : null;
  const canCheck = Boolean(myMapsId || place.trim());
  const stops = routeStops(values.itinerary);

  return (
    <>
      <PageHeadingFields
        title="Heading above the route map"
        eyebrow="Route and GPS waypoints"
        level="H2"
        heading={{ name: "routeMapHeading", defaultValue: values.routeMapHeading, placeholder: "Langtang Valley Trek route map", error: errors.routeMapHeading }}
      />
      <FormSection
        title="Route map"
        hint="The trek page shows a Google map. Visitors click “Load map” before anything loads from Google (privacy rules)."
      >
        <div className="grid gap-4 tablet:grid-cols-2">
          <TextField name="trekStart" label="Trek starts at" defaultValue={values.trekStart} placeholder="Syabrubesi, Rasuwa" maxLength={LIMIT.place} error={errors.trekStart} />
          <TextField name="trekEnd" label="Trek ends at" defaultValue={values.trekEnd} placeholder="Syabrubesi, Rasuwa" maxLength={LIMIT.place} error={errors.trekEnd} />
        </div>
        <div className="grid gap-4 tablet:grid-cols-2">
          <TextField
            name="mapPlace"
            label="Place the map centres on"
            value={place}
            onValueChange={setPlace}
            placeholder="Kyanjin Gompa, Langtang, Nepal"
            hint="Write it as you would search for it on Google Maps."
            maxLength={LIMIT.mapPlace}
            error={errors.mapPlace}
          />
          <TextField
            name="myMapsLink"
            label="Google My Maps link"
            labelNote="(optional)"
            value={link}
            onValueChange={setLink}
            placeholder="https://www.google.com/maps/d/viewer?mid=…"
            hint="Draw the GPS route in Google My Maps, share it publicly and paste the link: the map then shows the trail line."
            error={errors.myMapsId}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-sm border border-solid px-2.5 py-0.5 text-xs font-semibold",
              myMapsId ? "border-green-line bg-green-tint text-whatsapp" : "border-border bg-page text-muted-foreground",
            )}
          >
            {myMapsId ? "GPS trail route" : "Map of the area, no trail line"}
          </span>
          {canCheck && (
            <a href={googleMapsUrl({ place, myMapsId })} target="_blank" rel="noopener noreferrer" className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
              <Icon name="open_in_new" size={16} />
              Check on Google Maps
            </a>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="m-0 text-caption font-bold text-ink">Stops on the route</p>
          {stops.length ? (
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {stops.map((stop, index) => (
                <li key={`${stop}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-caption font-semibold text-ink">
                  <Icon name="location_on" size={16} className="text-brand" />
                  {stop}
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-caption text-muted-foreground">No stops yet. They come from the places in Day by day.</p>
          )}
          {stops.length > 0 && <p className="m-0 text-xs text-muted-foreground">From the places in Day by day (as last saved).</p>}
        </div>
        <PdfMapField path={values.pdfMapPath} url={pdfMapUrl} error={errors.pdfMapPath} onEdit={onEdit} />
      </FormSection>
    </>
  );
};
