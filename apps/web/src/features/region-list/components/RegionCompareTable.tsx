import Link from "next/link";

import { formatAltitude } from "@/features/treks/format";

import type { RegionListItem } from "../regionListItems";
import { RegionListHeading } from "./RegionListHeading";
import { CARD, DIFFICULTY_CHIP, DIFFICULTY_CHIPS, WRAP } from "./styles";

const CELL = "px-4 py-3";
const COLUMNS = ["Max altitude", "Trek length", "Difficulty", "Getting there", "Permits", "Best for"] as const;

/** A fact not filled in yet in the admin, as an empty cell would read like a mistake. */
const NOT_SET = "—";

/** "Compare the regions": every region's key facts in one table (scrolls sideways on phones). */
export const RegionCompareTable = ({ regions }: { regions: readonly RegionListItem[] }) => (
  <section aria-labelledby="regions-compare-title" className="pt-10 pb-4">
    <div className={`${WRAP} flex flex-col gap-4`}>
      <RegionListHeading id="regions-compare-title" kicker="Side by side" title="Compare the regions" />
      {/* Focusable so keyboard users can scroll the table sideways on small screens. */}
      <div
        role="region"
        aria-labelledby="regions-compare-title"
        tabIndex={0}
        className={`${CARD} overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
      >
        <table className="w-full min-w-215 border-collapse text-left text-caption font-normal">
          <thead>
            <tr className="border-b border-line bg-page text-[11px] font-bold tracking-wider text-text uppercase">
              <th scope="col" className={CELL}>
                Region
              </th>
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className={CELL}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-text">
            {regions.map((region) => (
              <tr key={region.slug} className="border-t border-muted">
                <th scope="row" className={`${CELL} font-bold text-ink`}>
                  <Link href={region.href} className="inline-flex items-center gap-2 rounded-sm hover:text-brand focus-visible:outline-2 focus-visible:outline-ring">
                    <span aria-hidden="true" className="inline-flex size-5 flex-none items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">
                      {region.number}
                    </span>
                    {region.name}
                  </Link>
                </th>
                <td className={`${CELL} font-bold`}>{formatAltitude(region.maxAltitudeM)}</td>
                <td className={CELL}>{region.trekLength || NOT_SET}</td>
                <td className={CELL}>
                  <span className={`${DIFFICULTY_CHIP} ${DIFFICULTY_CHIPS[region.difficulty]}`}>{region.difficulty}</span>
                </td>
                <td className={CELL}>{region.access.long || NOT_SET}</td>
                <td className={CELL}>{region.permits || NOT_SET}</td>
                <td className={CELL}>{region.bestFor || NOT_SET}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Since 2023, foreign trekkers in Nepal&apos;s national parks and conservation areas must trek with a licensed guide.
        Restricted areas also need a special permit and at least two trekkers. We arrange all permits.
      </p>
    </div>
  </section>
);
