import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Form from "next/form";

import { REGIONS } from "@/features/regions/regions";
import { TREK_LENGTHS, TREK_SEASONS } from "@/features/treks/filters";
import { ROUTES } from "@/lib/routes";

import { FinderSelect } from "./FinderSelect";

const REGION_OPTIONS = REGIONS.map((region) => ({ value: region.slug, label: region.name }));

const TRUST_POINTS: readonly { icon: IconName; text: string }[] = [
  { icon: "verified", text: "Licensed by the Nepal Government · TAAN member" },
  { icon: "shield_person", text: "Local guides from each region" },
  { icon: "tune", text: "Custom itineraries, no extra cost" },
];

/**
 * Trek finder card overlapping the hero's bottom edge, then the trust points.
 * A plain GET form to /treks (works before JavaScript loads); next/form adds client-side navigation.
 */
export const TrekFinder = () => (
  <div className="relative z-10 mx-auto -mt-20 max-w-content px-4 md:px-5">
    <Form
      action={ROUTES.treks}
      aria-label="Find a trek"
      className="flex flex-wrap gap-2.5 rounded-xl bg-surface p-3 shadow-popover"
    >
      <FinderSelect
        name="region"
        label="Where"
        icon="location_on"
        anyLabel={`All ${REGIONS.length} regions`}
        options={REGION_OPTIONS}
      />
      <FinderSelect name="length" label="How long" icon="schedule" anyLabel="Any length" options={TREK_LENGTHS} />
      <FinderSelect name="season" label="When" icon="wb_sunny" anyLabel="Any season" options={TREK_SEASONS} />
      <button
        type="submit"
        className="inline-flex min-h-15.5 grow basis-40 cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-brand px-6.5 text-base font-extrabold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Icon name="search" size={22} />
        Find my trek
      </button>
    </Form>

    {/* Phones: a left-aligned list (centered wrapping lines read badly); wider: one centered row. */}
    <ul className="flex flex-col gap-3 px-1 pt-6.5 text-body-sm font-semibold text-text md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:px-0">
      {TRUST_POINTS.map((point) => (
        <li key={point.icon} className="inline-flex items-center gap-2">
          <Icon name={point.icon} className="text-brand" />
          {point.text}
        </li>
      ))}
    </ul>
  </div>
);
