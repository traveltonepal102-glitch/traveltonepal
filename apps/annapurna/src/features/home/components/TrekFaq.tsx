import { FaqList } from "@/components/shared/FaqList";
import { SectionHeading } from "@/components/shared/SectionHeading";

import type { HomeTrek } from "../types";

/** The trek's questions. */
export const TrekFaq = ({ faq }: { faq: HomeTrek["faq"] }) => (
  <section aria-labelledby="faq-h" id="faq" className="flex flex-col gap-5">
    <SectionHeading id="faq-h" eyebrow="Questions" title={faq.heading} />
    <FaqList items={faq.items} />
  </section>
);
