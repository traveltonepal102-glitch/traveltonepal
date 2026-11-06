import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";

/** Questions that open in place (no JavaScript); the first starts open. */
export const TrekFaq = ({ faq }: { faq: HomeTrek["faq"] }) => (
  <section aria-labelledby="faq-h" id="faq" className="flex flex-col gap-5">
    <SectionHeading id="faq-h" eyebrow="Questions" title={faq.heading} />
    <div className="overflow-hidden rounded-[14px] border border-solid border-line">
      {faq.items.map((item, index) => (
        <details key={item.question} open={index === 0} className="group -mt-px border-t border-solid border-line open:bg-stone">
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-[17px] leading-6 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <span aria-hidden="true" className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-forest-tint font-semibold text-forest">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <RichText doc={item.body} className="flex flex-col gap-3 px-5 pb-4.5" />
        </details>
      ))}
    </div>
  </section>
);
