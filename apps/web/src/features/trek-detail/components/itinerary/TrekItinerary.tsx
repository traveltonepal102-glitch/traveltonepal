import { Icon } from "@ttn/ui/icon";

import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { CustomItineraryCard } from "./CustomItineraryCard";
import { ItineraryDayCard } from "./ItineraryDayCard";
import { RouteSketch } from "./RouteSketch";

/** "Starts in the Langtang region" / "Into the Manaslu region": where a trek across several regions enters one. */
const RegionMarker = ({ name, isFirst }: { name: string; isFirst: boolean }) => (
  <p className="flex items-center gap-2 pt-1 text-caption font-bold text-brand">
    <Icon name="pin_drop" size={16} className="flex-none" />
    {isFirst ? `Starts in the ${name} region` : `Into the ${name} region`}
    <span aria-hidden="true" className="h-px flex-1 bg-line" />
  </p>
);

/** The region a day enters, when the day before was in another one (or it is the first day of a route's days). */
const enteredRegion = (trek: TrekDetail, index: number) => {
  const { regionSlug } = trek.itinerary.days[index];
  if (!regionSlug || trek.itinerary.days[index - 1]?.regionSlug === regionSlug) return undefined;
  return trek.route.find((stop) => stop.slug === regionSlug)?.name;
};

/**
 * "Step-by-step route": route sketch, one card per day and the offer to customize the trip. On a trek across
 * several regions (with the days' regions set), a line marks where it enters each region.
 */
export const TrekItinerary = ({ trek }: { trek: TrekDetail }) => (
  <section id={TREK_SECTION_IDS.itinerary} aria-labelledby="trek-itinerary-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-itinerary-title"
      eyebrow="Step-by-step route"
      title={`${trek.itinerary.days.length}-day day-by-day itinerary`}
      description={trek.itinerary.intro}
    />
    {trek.routeSketch && (
      <div className="py-2">
        <RouteSketch sketch={trek.routeSketch} />
      </div>
    )}
    <ol className="flex flex-col gap-3">
      {trek.itinerary.days.map((day, index) => {
        const region = enteredRegion(trek, index);
        return (
          <li key={day.title} className="flex flex-col gap-2">
            {region && <RegionMarker name={region} isFirst={index === 0} />}
            <ItineraryDayCard day={day} dayNumber={index + 1} />
          </li>
        );
      })}
    </ol>
    {!trek.hiddenSections.includes("customization") && <CustomItineraryCard name={trek.name} customization={trek.customization} />}
  </section>
);
