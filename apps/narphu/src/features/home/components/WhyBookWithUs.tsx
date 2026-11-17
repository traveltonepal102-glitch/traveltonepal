import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeCompany } from "../types";

/** The company's promises from Pages › About, numbered on the maroon band (design: Why book with us). Left out while there are none. */
export const WhyBookWithUs = ({ company: { promises, promisesHeading, promisesIntro } }: { company: HomeCompany }) =>
  promises.length > 0 && (
    <section aria-labelledby="why-book-h" id="why_book" className="flex flex-col gap-10 text-on-maroon-muted">
      <SectionHeading id="why-book-h" eyebrow="Book with the local team" title={promisesHeading || "Why book your trek with us"} isOnDark>
        {promisesIntro && <p className="m-0">{promisesIntro}</p>}
      </SectionHeading>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(300px,1fr))] border-0 border-t border-solid border-white/16 p-0 max-sm:grid-cols-1">
        {promises.map((promise, index) => (
          <li key={promise.title} className="flex gap-4 border-0 border-b border-solid border-white/16 py-7 pr-6">
            <span aria-hidden="true" className="pt-1 text-sm leading-none font-bold tracking-[0.12em] text-saffron">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-1.5">
              <strong className="text-[19px] leading-6 font-semibold text-snow">{promise.title}</strong>
              <span className="text-[15px] leading-6">{promise.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
