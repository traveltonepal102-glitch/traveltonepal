import Link from "next/link";

import { formatCount } from "@/lib/format";

import type { RegionTrekLink } from "../regionListItems";

const ROW =
  "flex items-center justify-between gap-2 rounded-md border border-line px-2.5 py-2 text-caption font-semibold text-ink hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** One row per trek: its page, or a WhatsApp chat about it while it has no page. */
export const RegionTrekLinks = ({ treks }: { treks: readonly RegionTrekLink[] }) => (
  <ul className="flex flex-col gap-1.5">
    {treks.map((trek) => {
      const days = <span className="text-brand">{formatCount(trek.days, "day")}</span>;
      return (
        <li key={trek.slug}>
          {trek.isInquiry ? (
            <a href={trek.href} target="_blank" rel="noopener noreferrer" className={ROW}>
              <span>
                {trek.name}
                <span className="sr-only"> (ask on WhatsApp)</span>
              </span>
              {days}
            </a>
          ) : (
            <Link href={trek.href} className={ROW}>
              {trek.name}
              {days}
            </Link>
          )}
        </li>
      );
    })}
  </ul>
);
