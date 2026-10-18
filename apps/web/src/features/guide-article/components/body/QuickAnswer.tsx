import { Icon } from "@ttn/ui/icon";

import { QUICK_ANSWER_ID } from "../../guideArticles";
import type { RichText } from "../../types";

/** Blue "Quick answer" box at the top of the article (the contents list's first stop). */
export const QuickAnswer = ({ text }: { text: RichText }) => (
  <section
    id={QUICK_ANSWER_ID}
    aria-labelledby="quick-answer-title"
    className="flex scroll-mt-5 flex-col gap-2.5 rounded-xl border border-[#d3e3f1] bg-brand-tint px-5.5 py-5"
  >
    <h2 id="quick-answer-title" className="inline-flex items-center gap-2 font-sans text-xs font-extrabold tracking-widest text-brand uppercase">
      <Icon name="lightbulb" size={18} />
      Quick answer
    </h2>
    <p className="text-body-lg text-ink">
      {text.map((part, index) =>
        typeof part === "string" ? part : <strong key={index}>{part.strong}</strong>,
      )}
    </p>
  </section>
);
