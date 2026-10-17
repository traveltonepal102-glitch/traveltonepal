import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { CustomItineraryCard } from "./CustomItineraryCard";
import { ItineraryDayCard } from "./ItineraryDayCard";
import { RouteSketch } from "./RouteSketch";

/** "Step-by-step route": route sketch, one card per day and the offer to customize the trip. */
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
      {trek.itinerary.days.map((day, index) => (
        <li key={day.title}>
          <ItineraryDayCard day={day} dayNumber={index + 1} />
        </li>
      ))}
    </ol>
    <CustomItineraryCard name={trek.name} customization={trek.customization} />
  </section>
);
