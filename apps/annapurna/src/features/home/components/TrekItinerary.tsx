import { getWhatsAppUrl } from "@ttn/config/contact";
import { isRichTextEmpty } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrek } from "../types";
import { AltitudeChart } from "./AltitudeChart";
import { ItineraryDayCard } from "./ItineraryDayCard";

type TrekItineraryProps = { name: string; itinerary: HomeTrek["itinerary"] };

/** The day-by-day plan: the altitude chart, a card per day, and how to change it. */
export const TrekItinerary = ({ name, itinerary }: TrekItineraryProps) => (
  <section aria-labelledby="itinerary-h" id="itinerary" className="flex flex-col gap-6">
    <SectionHeading id="itinerary-h" eyebrow="Step-by-step route" title={itinerary.heading} />
    {!isRichTextEmpty(itinerary.intro) && <RichText doc={itinerary.intro} />}
    <AltitudeChart days={itinerary.days} />
    <ol className="flex flex-col">
      {itinerary.days.map((day) => (
        <ItineraryDayCard key={day.number} day={day} />
      ))}
    </ol>
    {itinerary.showsCustomization && (
      <section aria-labelledby="custom-h" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-[14px] border border-solid border-line bg-cloud px-6 py-5.5">
        <div className="flex flex-[1_1_360px] items-start gap-3.5">
          <span className="inline-flex size-11 flex-none items-center justify-center rounded-[10px] bg-snow text-navy">
            <TrailIcon name="route" size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h3 id="custom-h" className="text-xl! leading-6.5!">
              Change the route to suit you
            </h3>
            <p className="text-base leading-6.25">Want an extra rest day or a different finish? Every trek is private, so we can change it for your group.</p>
          </div>
        </div>
        <a href={getWhatsAppUrl(`Hello! I would like to change the ${name} route for my group.`)} rel="nofollow" className={whatsAppButton}>
          <WhatsAppLogo />
          Plan my route
        </a>
      </section>
    )}
  </section>
);
