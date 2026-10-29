import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { SourceNote } from "@/components/editor/SourceNote";
import { FormSection } from "@/components/ui/FormSection";
import { MONTH_NAMES, MONTH_RATING_LABELS, regionPath } from "@/features/regions/constants";
import type { MonthRating } from "@/lib/supabase/database.types";

import { routeMonthRatings } from "../../../lib/routeMonths";
import type { RegionOption } from "../../../types";

const BAR_CLASSES: Record<MonthRating, string> = {
  best: "bg-month-best",
  possible: "bg-month-possible",
  avoid: "bg-month-avoid",
};

type StartDateCardProps = {
  /** The regions on the route as last saved, main region first (their best months colour the start months). */
  regions: RegionOption[];
};

/**
 * "Start date" (design: Admin-trek-editor, pricing): there are no fixed departures, every trek starts on the day the
 * trekker picks. Nothing to fill in: the month colours come from the route's regions (each month the worst of them).
 */
export const StartDateCard = ({ regions }: StartDateCardProps) => {
  const ratings = routeMonthRatings(regions);
  const [main] = regions;
  return (
    <FormSection
      title="Start date"
      hint="There are no fixed departures. Visitors pick any start day on the trek page."
      aside={<span className="rounded-full bg-green-tint px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-whatsapp">Any day of the year</span>}
    >
      <div className="flex flex-col gap-2 rounded-xl border border-solid border-border bg-page px-3.5 py-3">
        <span className="text-caption font-bold text-ink">Month colours on the page</span>
        {ratings ? (
          <ul className="m-0 grid list-none grid-cols-12 gap-1 p-0 max-tablet:grid-cols-6">
            {ratings.map((rating, month) => (
              <li key={MONTH_NAMES[month]} title={`${MONTH_NAMES[month]}: ${MONTH_RATING_LABELS[rating]}`} className="flex flex-col items-center gap-1 text-[11px] font-bold text-text">
                <span className={cn("block h-1.5 w-full rounded-full", BAR_CLASSES[rating])} />
                {MONTH_NAMES[month]}
                <span className="sr-only">: {MONTH_RATING_LABELS[rating]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-caption text-muted-foreground">Pick the trek&apos;s region in Top of the page and save.</p>
        )}
        <SourceNote
          shownIn={regions.length > 1 ? "the trek page's start months (each month the worst region on the route)" : "the trek page's start months (the same as the region page)"}
          from={main ? { href: regionPath(main.id), label: `Regions › ${regions.map((region) => region.name).join(", ")} › Best time to go` } : { section: "top" }}
        />
      </div>
      <p className="m-0 flex items-start gap-2 rounded-md border border-solid border-border bg-page px-3 py-2.5 text-caption">
        <Icon name="info" size={18} className="flex-none text-brand" />
        <span>The end date is worked out from the number of days. The chosen date and group size go into the WhatsApp message.</span>
      </p>
    </FormSection>
  );
};
