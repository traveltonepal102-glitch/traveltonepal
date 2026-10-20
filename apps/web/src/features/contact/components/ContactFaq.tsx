import { FaqAccordion } from "@/components/shared/FaqAccordion";

import { CONTACT_FAQS } from "../contactContent";
import { CONTACT_SECTION_IDS } from "../sections";
import { WRAP } from "./styles";

/** "Before you get in touch": the questions people ask before writing. */
export const ContactFaq = () => (
  <section id={CONTACT_SECTION_IDS.faq} aria-labelledby="contact-faq-title" className="scroll-mt-4 pb-14">
    <div className={`${WRAP} flex flex-col gap-4.5`}>
      <h2 id="contact-faq-title" className="text-h2-sm tracking-tight md:text-[28px]">
        Before you get in touch
      </h2>
      <FaqAccordion items={CONTACT_FAQS} />
    </div>
  </section>
);
