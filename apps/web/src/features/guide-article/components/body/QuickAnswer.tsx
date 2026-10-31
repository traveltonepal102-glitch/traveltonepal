import { Icon } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";

import { QUICK_ANSWER_ID } from "../../guideArticles";

/** Blue "Quick answer" box, where the admin put it (a stop in the contents list). */
export const QuickAnswer = ({ body }: { body: RichTextDoc }) => (
  <section
    id={QUICK_ANSWER_ID}
    aria-labelledby="quick-answer-title"
    className="flex scroll-mt-5 flex-col gap-2.5 rounded-xl border border-[#d3e3f1] bg-brand-tint px-5.5 py-5"
  >
    <h2 id="quick-answer-title" className="inline-flex items-center gap-2 font-sans text-xs font-extrabold tracking-widest text-brand uppercase">
      <Icon name="lightbulb" size={18} />
      Quick answer
    </h2>
    <RichText doc={body} headingLevel="h4" className="flex flex-col gap-2 text-body-lg text-ink" />
  </section>
);
