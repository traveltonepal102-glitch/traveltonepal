import Link from "next/link";

import { ItineraryDayCard } from "@/features/trek-detail/components/itinerary/ItineraryDayCard";
import { formatAltitude, formatUsd } from "@/features/treks/format";
import type { TrekSummary } from "@/features/treks/types";

import type { ArticleDay } from "../../types";
import { trekHref } from "../trekHref";

/** "Itinerary days": some days from a trek's plan, with their number in the trek and a link to the whole plan. */
export const ArticleDays = ({ trek, days }: { trek: TrekSummary; days: readonly ArticleDay[] }) => (
  <section aria-label={`Days from the ${trek.name}`} className="flex flex-col gap-3">
    <ol className="flex flex-col gap-3">
      {days.map((day) => (
        <li key={day.dayNumber}>
          <ItineraryDayCard day={day} dayNumber={day.dayNumber} />
        </li>
      ))}
    </ol>
    <Link href={trekHref(trek)} className="self-start text-body-sm font-bold text-brand hover:text-brand-hover">
      See every day of the {trek.name}
    </Link>
  </section>
);

type CostTableProps = { heading: string; rows: readonly { item: string; price: string }[]; totalLabel: string; total: string };

/** "Cost table": a list of costs, with a total when there is one. */
export const ArticleCostTable = ({ heading, rows, totalLabel, total }: CostTableProps) => (
  <section aria-label={heading || "Costs"} className="overflow-hidden rounded-xl border border-line bg-surface">
    {heading && <h3 className="border-b border-line bg-page px-5 py-3 font-display text-base font-bold text-ink">{heading}</h3>}
    <table className="w-full text-[15px]">
      <tbody>
        {rows.map((row) => (
          <tr key={row.item} className="border-b border-muted last:border-b-0">
            <th scope="row" className="px-5 py-3 text-left font-normal text-text">
              {row.item}
            </th>
            <td className="px-5 py-3 text-right font-semibold whitespace-nowrap text-ink">{row.price}</td>
          </tr>
        ))}
      </tbody>
      {totalLabel && total && (
        <tfoot>
          <tr className="border-t border-line bg-brand-tint">
            <th scope="row" className="px-5 py-3 text-left font-bold text-ink">
              {totalLabel}
            </th>
            <td className="px-5 py-3 text-right font-extrabold whitespace-nowrap text-ink">{total}</td>
          </tr>
        </tfoot>
      )}
    </table>
  </section>
);

const FACTS: readonly { label: string; value: (trek: TrekSummary) => string }[] = [
  { label: "Days", value: (trek) => String(trek.days) },
  { label: "Difficulty", value: (trek) => trek.difficulty },
  { label: "Highest point", value: (trek) => formatAltitude(trek.maxAltitudeM) },
  { label: "Best months", value: (trek) => trek.seasonLabel || "Ask us" },
  { label: "From", value: (trek) => (trek.priceFromUsd ? formatUsd(trek.priceFromUsd) : "Price on request") },
];

/** "Compare treks": two or three treks side by side; the table scrolls sideways on small phones. */
export const ArticleCompare = ({ treks }: { treks: readonly TrekSummary[] }) => (
  <section aria-label="Treks compared" className="relative overflow-x-auto rounded-xl border border-line bg-surface">
    <table className="w-full min-w-120 text-[15px]">
      <thead>
        <tr className="border-b border-line bg-page">
          <td />
          {treks.map((trek) => (
            <th key={trek.slug} scope="col" className="px-4 py-3 text-left font-display text-base font-bold">
              <Link href={trekHref(trek)} className="text-ink hover:text-brand">
                {trek.name}
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {FACTS.map((fact) => (
          <tr key={fact.label} className="border-b border-muted last:border-b-0">
            <th scope="row" className="px-4 py-3 text-left text-body-sm font-semibold text-muted-foreground">
              {fact.label}
            </th>
            {treks.map((trek) => (
              <td key={trek.slug} className="px-4 py-3 text-text">
                {fact.value(trek)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
