import { MONTH_NAMES, monthNames } from "@ttn/ui/lib/bestMonths";
import type { MonthRating } from "@ttn/ui/lib/bestMonths";

import { MonthTiles } from "@/features/home/components/MonthTiles";
import { SITE_LANGUAGE } from "@/lib/site";

import type { BlogArticle } from "../../types";

const VERDICT: Record<MonthRating, { label: string; chip: string }> = {
  best: { label: "Beste Zeit", chip: "bg-ocean text-snow" },
  possible: { label: "Möglich", chip: "bg-glacier text-ink" },
  avoid: { label: "Nicht empfohlen", chip: "border border-solid border-line bg-ice text-muted" },
};

type BlogMonthsProps = { heading: string; view: "strip" | "table"; months: NonNullable<BlogArticle["months"]> };

/** The blog's months, as coloured tiles or a table with notes, each row an anchor ("#m-oct") that the blog's text can link to. */
export const BlogMonths = ({ heading, view, months }: BlogMonthsProps) => (
  <section aria-label={heading || "Monat für Monat"} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    {view === "strip" ? (
      <MonthTiles ratings={months.ratings} />
    ) : (
      <div role="group" aria-label="Monate, seitlich scrollbar" tabIndex={0} className="table-scroll rounded-[14px] border border-solid border-line">
        <table className="w-full min-w-120 border-collapse text-[15px] leading-5.5">
          <thead className="bg-ice text-left font-semibold text-ink">
            <tr>
              {["Monat", "Bewertung", "Auf dem Trail", "Andrang"].map((title) => (
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
                  {monthNames(SITE_LANGUAGE)[index]}
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
