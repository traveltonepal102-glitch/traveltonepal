import Link from "next/link";

import { formatAltitude, formatDays, formatUsd } from "@/lib/format";

import type { HomeTrekCard } from "../types";

const HEAD = "px-4 py-3.5 font-semibold";
const CELL = "px-4 py-3.5";

type CompareTreksProps = { current?: HomeTrekCard; others: readonly HomeTrekCard[] };

/** Treks side by side at a glance: the one on this page, when there is one, first and marked. */
export const CompareTreks = ({ current, others }: CompareTreksProps) => (
  <div id={current ? "compare" : undefined} className="flex flex-col gap-3">
    <h3>Compare at a glance</h3>
    <div className="relative overflow-x-auto rounded-[14px] border border-solid border-line bg-snow">
      <table className="w-full min-w-[720px] border-collapse text-[15px] leading-5.5">
        <thead>
          <tr className="text-left text-eyebrow tracking-[0.06em] text-muted uppercase">
            <th scope="col" className={HEAD}>Trek</th>
            <th scope="col" className={HEAD}>Days</th>
            <th scope="col" className={HEAD}>Difficulty</th>
            <th scope="col" className={HEAD}>Highest point</th>
            <th scope="col" className={HEAD}>From</th>
            <th scope="col" className={HEAD}>
              <span className="sr-only">Link</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...(current ? [current] : []), ...others].map((trek) => {
            const isCurrent = trek.slug === current?.slug;
            return (
              <tr key={trek.slug} className={`border-t border-solid border-line ${isCurrent ? "bg-forest-tint" : ""}`}>
                <th scope="row" className={`${CELL} text-left font-semibold text-ink`}>
                  {trek.name}
                  {isCurrent && <span className="ml-2 rounded-full bg-forest px-2 py-px text-xs leading-4.5 text-snow">This page</span>}
                </th>
                <td className={CELL}>{trek.days ? formatDays(trek.days) : ""}</td>
                <td className={CELL}>{trek.difficulty}</td>
                <td className={CELL}>{trek.maxAltitudeM ? formatAltitude(trek.maxAltitudeM) : ""}</td>
                <td className={`${CELL} font-semibold text-forest`}>{trek.priceFromUsd !== null ? formatUsd(trek.priceFromUsd) : "On request"}</td>
                <td className={`${CELL} text-right`}>{!isCurrent && trek.hasPage && <Link href={trek.href} className="font-semibold">View</Link>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
