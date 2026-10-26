import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { RichText } from "@/components/shared/RichText";

import { CONTACT_SECTION_IDS } from "../sections";
import type { ContactFaqItem } from "../types";
import { WRAP } from "./styles";

/** "Before you get in touch": the questions people ask before writing. */
export const ContactFaq = ({ faqs, heading }: { faqs: readonly ContactFaqItem[]; heading: string }) => (
  <section id={CONTACT_SECTION_IDS.faq} aria-labelledby="contact-faq-title" className="scroll-mt-4 pb-14">
    <div className={`${WRAP} flex flex-col gap-4.5`}>
      <h2 id="contact-faq-title" className="text-h2-sm tracking-tight md:text-[28px]">
        {heading || "Before you get in touch"}
      </h2>
      <FaqAccordion items={faqs.map((faq) => ({ question: faq.question, answer: <RichText doc={faq.answer} className="flex flex-col gap-2.5" headingLevel="h4" /> }))} />
    </div>
  </section>
);
