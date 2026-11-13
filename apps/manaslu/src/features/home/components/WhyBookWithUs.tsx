import { SectionHeading } from "@/components/shared/SectionHeading";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeCompany } from "../types";

/** The company's promises from Pages › About. Left out while there are none. */
export const WhyBookWithUs = ({ company: { promises, promisesHeading, promisesIntro } }: { company: HomeCompany }) =>
  promises.length > 0 && (
    <section aria-labelledby="why-book-h" id="why_book" className="flex flex-col gap-5">
      <SectionHeading id="why-book-h" eyebrow="Book with the local team" title={promisesHeading || "Why book your trek with us"}>
        {promisesIntro && <p>{promisesIntro}</p>}
      </SectionHeading>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {promises.map((promise) => (
          <li key={promise.title} className="flex items-start gap-3.5 rounded-[14px] border border-solid border-line p-5">
            <span className="inline-flex size-11 flex-none items-center justify-center rounded-[10px] bg-forest-tint text-forest">
              <TrailIcon name="shield" size={22} />
            </span>
            <span className="flex flex-col gap-1">
              <strong className="leading-6 font-semibold text-ink">{promise.title}</strong>
              <span className="text-[15px] leading-5.75">{promise.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
