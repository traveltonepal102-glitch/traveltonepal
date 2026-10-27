import { Icon } from "@ttn/ui/icon";

import type { TrekDetail } from "../../types";
import { EYEBROW } from "../styles";
import { CalloutRequestForm } from "./CalloutRequestForm";

type BookingCalloutProps = Pick<TrekDetail, "name" | "shortName" | "days" | "groupPrices">;

/** "Ready for the Himalaya?": the last call to book, with a short request form. */
export const BookingCallout = ({ name, shortName, days, groupPrices }: BookingCalloutProps) => (
  <section aria-labelledby="booking-callout-title" className="border-t border-line bg-surface py-12">
    <div className="mx-auto max-w-content px-4 md:px-6">
      <div className="mx-auto flex max-w-190 flex-col gap-6 rounded-xl border-2 border-saffron bg-linear-45 from-white via-saffron-tint via-55% to-page p-5 shadow-[0_6px_16px_rgba(15,23,42,0.08)] md:p-10">
        <div className="flex flex-col items-center gap-2 border-b border-saffron-line pb-4 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-green-line bg-green-tint px-3 py-1 text-xs font-bold text-whatsapp">
            <Icon name="chat" size={16} />
            Fast reply · local operator
          </p>
          <p className={EYEBROW}>Ready for the Himalaya?</p>
          <h2 id="booking-callout-title" className="text-h2-sm md:text-[30px] md:leading-[36px]">
            Book the {shortName} with us
          </h2>
          <p className="max-w-140 text-body-sm text-text">
            Get a personal itinerary, packing advice and a confirmed price for your group, straight from our Kathmandu team.
          </p>
        </div>
        <CalloutRequestForm trekName={name} days={days} groupPrices={groupPrices} />
      </div>
    </div>
  </section>
);
