import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { SectionHeading } from "../SectionHeading";
import { GroupRatesTable } from "./GroupRatesTable";
import { StartDatePicker } from "./StartDatePicker";
import { TrekChoiceBar } from "./TrekChoiceBar";

type TrekPricingProps = Pick<TrekDetail, "name" | "days" | "region" | "groupPrices">;

/** "Transparent pricing structure": the start date (any day, no fixed departures), the group rates and the choice. */
export const TrekPricing = ({ name, days, region, groupPrices }: TrekPricingProps) => (
  <section id={TREK_SECTION_IDS.pricing} aria-labelledby="trek-pricing-title" className="flex scroll-mt-16 flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-pricing-title"
      eyebrow="Transparent pricing structure"
      title="Group rates by team size"
      description="Book directly with our Kathmandu team, with no middlemen. Every trek is private, so you choose your own start date."
    />
    <StartDatePicker days={days} regionName={region} />
    <GroupRatesTable groupPrices={groupPrices} />
    <TrekChoiceBar trekName={name} days={days} groupPrices={groupPrices} />
  </section>
);
