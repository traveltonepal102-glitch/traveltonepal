import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { RichText } from "@/components/shared/RichText";

import { FAQ_ID } from "../../guideArticles";
import type { GuideFaq } from "../../types";
import { SECTION_TITLE } from "../styles";

/** "Frequently asked questions": each answer folds open; the first starts open. */
export const ArticleFaq = ({ faqs }: { faqs: readonly GuideFaq[] }) => {
  if (faqs.length === 0) return null;

  return (
    <section id={FAQ_ID} aria-labelledby="faq-title" className="flex scroll-mt-5 flex-col gap-5">
      <h2 id="faq-title" className={SECTION_TITLE}>
        Frequently asked questions
      </h2>
      <FaqAccordion items={faqs.map((faq) => ({ question: faq.question, answer: <RichText doc={faq.answer} headingLevel="h4" className="flex flex-col gap-2.5" /> }))} />
    </section>
  );
};
