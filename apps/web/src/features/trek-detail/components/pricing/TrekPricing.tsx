import { Icon } from "@ttn/ui/icon";

import { departureOptions } from "../../pricing";
import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { PANEL } from "../styles";
import { DeparturePicker } from "./DeparturePicker";
import { GroupRatesTable } from "./GroupRatesTable";

/** Shown instead of the date picker when the trek has no fixed departures. */
const OwnDatesCard = () => (
  <div className={`${PANEL} flex flex-col gap-3 px-5 py-4.5 sm:flex-row sm:items-center sm:justify-between`}>
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
        <Icon name="calendar_month" size={22} />
      </span>
      <p className="flex flex-col">
        <strong className="font-display text-body-sm font-bold text-ink">Your dates, your pace</strong>
        <span className="text-xs text-text">
          No fixed departures. Tell us your preferred dates on WhatsApp and we confirm them, with no surcharge.
        </span>
      </p>
    </div>
    <p className="inline-flex flex-none items-center gap-1.5 text-xs font-semibold text-whatsapp">
      <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
      Private trek · any start date
    </p>
  </div>
);

type TrekPricingProps = Pick<TrekDetail, "groupPrices" | "departures" | "currentSeason">;

/** "Transparent pricing structure": departure dates (or own dates) and the group rates table. */
export const TrekPricing = ({ groupPrices, departures, currentSeason }: TrekPricingProps) => (
  <section id={TREK_SECTION_IDS.pricing} aria-labelledby="trek-pricing-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-pricing-title"
      eyebrow="Transparent pricing structure"
      title="Group rates by team size"
      description="Book directly with our Kathmandu team, with no middlemen. Every trek is private, so you choose your own start date."
    />
    {departures.length > 0 ? (
      <DeparturePicker departures={departureOptions(departures)} season={currentSeason} />
    ) : (
      <OwnDatesCard />
    )}
    <GroupRatesTable groupPrices={groupPrices} />
  </section>
);
