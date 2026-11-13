import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeCompany } from "../types";

/** The numbers take the flag colours in turn. */
const SQUARES = ["bg-azure text-snow", "bg-ember text-snow", "bg-whatsapp text-snow", "bg-sun text-ink", "bg-navy text-snow", "bg-sky text-navy"];

/** The company's promises from Pages › About. Left out while there are none. */
export const WhyBookWithUs = ({ company: { promises, promisesHeading, promisesIntro } }: { company: HomeCompany }) =>
  promises.length > 0 && (
    <section aria-labelledby="why-book-h" id="why_book" className="flex flex-col gap-6">
      <SectionHeading id="why-book-h" eyebrow="Book with the local team" title={promisesHeading || "Why book your trek with us"}>
        {promisesIntro && <p>{promisesIntro}</p>}
      </SectionHeading>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
        {promises.map((promise, index) => (
          <li key={promise.title} className="flex items-start gap-3.5 rounded-[18px] border border-solid border-line p-5.5">
            <span aria-hidden="true" className={`inline-flex size-11 flex-none items-center justify-center rounded-xl font-display font-bold ${SQUARES[index % SQUARES.length]}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-1">
              <strong className="leading-6 font-semibold text-ink">{promise.title}</strong>
              <span className="text-[15px] leading-5.75 text-muted">{promise.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
