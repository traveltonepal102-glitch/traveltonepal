import { getWhatsAppUrl } from "@ttn/config/contact";
import { isRichTextEmpty } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrek } from "../types";
import { ItineraryDayPanel } from "./ItineraryDayPanel";
import { ItineraryExplorer } from "./ItineraryExplorer";

type TrekItineraryProps = { name: string; itinerary: HomeTrek["itinerary"] };

/** "Day 3 to Kyang (3,850 m)" → "Day 3 to Kyang": the list's short line (the altitude is in its own column). */
const routeOf = (title: string) => title.replace(/\s*\([^)]*\)\s*$/, "");

/** The day-by-day plan on the dark band (design: Itinerary): the intro, the explorer, and how to change the route. */
export const TrekItinerary = ({ name, itinerary }: TrekItineraryProps) => (
  <section aria-labelledby="itinerary-h" id="itinerary" className="flex flex-col gap-9 text-on-maroon-muted">
    <div className="flex flex-col gap-4">
      <SectionHeading id="itinerary-h" eyebrow="Step-by-step route" title={itinerary.heading} isOnDark />
      {/* As wide as the section, its text and any photo or map in it (decided 2026-11-17: the intro fills the band). */}
      {!isRichTextEmpty(itinerary.intro) && <RichText doc={itinerary.intro} photoSizes="(min-width: 1280px) 1216px, 100vw" className="flex flex-col gap-4 text-lg leading-7.5 [--text-measure:none] [&_a]:text-saffron [&_figure]:rounded-[20px] [&_strong]:text-paper" />}
    </div>
    {itinerary.days.length > 0 && (
      <ItineraryExplorer
        days={itinerary.days.map((day) => ({ number: day.number, route: routeOf(day.title), place: day.place, nightAltitudeM: day.nightAltitudeM, altitudeM: day.altitudeM, topPlace: day.topPlace, isHighPoint: day.isHighPoint }))}
        panels={itinerary.days.map((day) => <ItineraryDayPanel key={day.number} day={day} count={itinerary.days.length} />)}
      />
    )}
    {itinerary.showsCustomization && (
      <section aria-labelledby="custom-h" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-3xl border border-solid border-white/12 bg-white/4 px-6 py-5.5">
        <div className="flex flex-[1_1_360px] items-start gap-3.5">
          <span className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-white/8 text-saffron">
            <TrailIcon name="route" size={22} />
          </span>
          <div className="flex flex-col gap-1">
            <h3 id="custom-h" className="text-xl! leading-6.5! text-paper!">
              Change the route to suit you
            </h3>
            <p className="m-0 text-base leading-6.25">Want an extra rest day or a different finish? Every trek is private, so we can change it for your group.</p>
          </div>
        </div>
        <a href={getWhatsAppUrl(`Hello! I would like to change the ${name} route for my group.`)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
          <WhatsAppLogo />
          Plan my route
        </a>
      </section>
    )}
  </section>
);
