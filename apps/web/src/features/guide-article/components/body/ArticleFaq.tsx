import { FAQ_ID } from "../../guideArticles";
import type { GuideFaq } from "../../types";
import { FOCUS, SECTION_TITLE } from "../styles";

/** "Frequently asked questions": each answer folds open; the first starts open. */
export const ArticleFaq = ({ faqs }: { faqs: readonly GuideFaq[] }) => {
  if (faqs.length === 0) return null;

  return (
    <section id={FAQ_ID} aria-labelledby="faq-title" className="flex scroll-mt-5 flex-col gap-5">
      <h2 id="faq-title" className={SECTION_TITLE}>
        Frequently asked questions
      </h2>
      <div className="divide-y divide-muted overflow-hidden rounded-xl border border-line">
        {faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary className={`cursor-pointer px-4.5 py-4 font-display text-base font-bold text-ink ${FOCUS}`}>{faq.question}</summary>
            <p className="px-4.5 pb-4 text-[15px] leading-relaxed text-text">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};
