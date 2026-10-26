import type { ReactNode } from "react";

const ANSWER = "px-4.5 pb-4 text-[15px] leading-relaxed text-text md:px-5";

/** `answer`: plain text, or rich content that brings its own paragraphs and lists. */
export type FaqItem = { question: string; answer: ReactNode };

/** Questions that fold open to show their answer; the first starts open. Native <details>, so it works without JavaScript. */
export const FaqAccordion = ({ items }: { items: readonly FaqItem[] }) => (
  <div className="divide-y divide-muted overflow-hidden rounded-xl border border-line bg-surface">
    {items.map((item, index) => (
      <details key={item.question} open={index === 0}>
        <summary className="cursor-pointer px-4.5 py-4 font-display text-base font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring md:px-5">
          {item.question}
        </summary>
        {typeof item.answer === "string" ? <p className={ANSWER}>{item.answer}</p> : <div className={`${ANSWER} flex flex-col gap-2.5`}>{item.answer}</div>}
      </details>
    ))}
  </div>
);
