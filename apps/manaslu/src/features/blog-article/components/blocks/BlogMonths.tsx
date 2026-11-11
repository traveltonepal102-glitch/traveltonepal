import { MONTH_NAMES } from "@ttn/ui/lib/bestMonths";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";

import { MonthTiles } from "@/features/home/components/MonthTiles";

import type { BlogArticle } from "../../types";

const VERDICT: Record<MonthRating, { label: string; chip: string }> = {
  best: { label: "Best", chip: "bg-forest text-snow" },
  possible: { label: "Possible", chip: "bg-saffron text-ink" },
  avoid: { label: "Avoid", chip: "border border-solid border-line bg-stone text-muted" },
};

type BlogMonthsProps = { heading: string; view: "strip" | "table"; months: NonNullable<BlogArticle["months"]> };

/** The blog's months, as coloured tiles or a table with notes, each row an anchor ("#m-oct") that the blog's text can link to. */
export const BlogMonths = ({ heading, view, months }: BlogMonthsProps) => (
  <section aria-label={heading || "Month by month"} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    {view === "strip" ? (
      <MonthTiles ratings={months.ratings} />
    ) : (
      <div role="group" aria-label="Months, scrolls sideways" tabIndex={0} className="table-scroll rounded-[14px] border border-solid border-line">
        <table className="w-full min-w-120 border-collapse text-[15px] leading-5.5">
          <thead className="bg-stone text-left font-semibold text-ink">
            <tr>
              {["Month", "Verdict", "On the trail", "Crowds"].map((title) => (
                <th key={title} scope="col" className="p-3 font-semibold">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.ratings.map((rating, index) => (
              <tr key={MONTH_NAMES[index]} id={`m-${MONTH_NAMES[index].toLowerCase()}`} className="border-0 border-t border-solid border-line">
                <th scope="row" className="p-3 text-left align-top font-semibold text-ink">
                  {MONTH_NAMES[index]}
                </th>
                <td className="p-3 align-top">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm leading-5 font-semibold ${VERDICT[rating].chip}`}>{VERDICT[rating].label}</span>
                </td>
                <td className="p-3 align-top">{months.notes[index]?.onTheTrail}</td>
                <td className="p-3 align-top whitespace-nowrap">{months.notes[index]?.crowds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
