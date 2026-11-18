import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeCompany } from "../types";

/**
 * The company's promises from Pages › About on the ocean band (design: Why book with us, as a list, decided
 * 2026-11-18): the heading on the left, staying in view on a laptop, and the promises down the right as numbered rows,
 * each with its check. Left out while there are none.
 */
export const WhyBookWithUs = ({ company: { promises, promisesHeading, promisesIntro } }: { company: HomeCompany }) =>
  promises.length > 0 && (
    <section aria-labelledby="why-book-h" id="why_book" className="grid items-start gap-10 text-on-ocean-muted lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-28">
        <SectionHeading id="why-book-h" eyebrow="Direkt beim Team vor Ort buchen" title={promisesHeading || "Warum du deinen Trek bei uns buchen solltest"} isOnDark>
          {promisesIntro && <p className="m-0">{promisesIntro}</p>}
        </SectionHeading>
        <p className="m-0 inline-flex items-center gap-3 self-start rounded-full border border-solid border-white/20 bg-white/8 px-4 py-2 text-sm font-semibold text-snow">
          <TrailIcon name="shield" size={18} className="text-glacier" />
          {promises.length} Versprechen für jeden Trek
        </p>
      </div>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {promises.map((promise, index) => (
          <li key={promise.title} className="reveal grid grid-cols-[48px_minmax(0,1fr)] gap-4 rounded-[20px] border border-solid border-white/12 bg-white/6 px-5 py-5 sm:grid-cols-[56px_minmax(0,1fr)] sm:px-6">
            <span aria-hidden="true" className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 font-display text-lg font-extrabold text-glacier sm:size-14 sm:text-xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex min-w-0 flex-col gap-1.5 pt-0.5">
              <strong className="flex items-start gap-2 font-display text-[19px] leading-6 font-bold text-snow sm:text-xl">
                <TrailIcon name="check" size={18} className="mt-1 text-glacier" />
                {promise.title}
              </strong>
              <span className="text-[15px] leading-6.5 [--text-measure:none]">{promise.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
