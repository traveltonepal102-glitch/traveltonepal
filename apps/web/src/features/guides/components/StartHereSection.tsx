import Link from "next/link";

import { formatCountWord } from "@/lib/format";
import { guidePath } from "@/lib/routes";

import { formatTotalReadTime } from "../format";
import type { TravelGuide } from "../types";
import { WRAP } from "./styles";

/** "Start here" panel: the guides to read before a first trek, in reading order, with the total reading time. */
export const StartHereSection = ({ guides }: { guides: readonly TravelGuide[] }) => {
  if (guides.length === 0) return null;

  const totalMinutes = guides.reduce((sum, guide) => sum + guide.readMinutes, 0);

  return (
    <section aria-labelledby="start-here-title" className="pb-14 md:pb-18">
      <div className={WRAP}>
        <div className="flex flex-col gap-5 rounded-xl bg-navy p-5.5 text-white md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-eyebrow text-saffron uppercase">First trek in Nepal?</p>
              <h2 id="start-here-title" className="text-h2-sm tracking-tight text-white md:text-h2">
                Start here: {formatCountWord(guides.length)} guides to read before you book
              </h2>
            </div>
            <p className="flex-none text-body-sm text-navy-text">{formatTotalReadTime(totalMinutes)}</p>
          </div>

          {/* The list is ordered, so screen readers announce the step; the number badges are visual only. */}
          <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <li key={guide.slug}>
                <Link
                  href={guidePath(guide.slug)}
                  className="flex h-full items-center gap-3.5 rounded-lg border border-white/12 bg-white/6 px-4 py-3.5 transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 flex-none place-items-center rounded-full bg-saffron text-body-sm font-extrabold text-ink"
                  >
                    {index + 1}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-body-sm font-bold text-white">{guide.shortTitle}</span>
                    <span className="text-xs text-navy-text">{guide.readMinutes} min</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
