"use client";

import { Icon } from "@ttn/ui/icon";

import { FieldError } from "@/components/ui/FieldError";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { RECOMMENDED_FAQS } from "../../../constants";
import { useFaqTopics } from "../../../hooks/useFaqTopics";
import type { FaqTopic } from "../../../types";
import { FaqTopicList } from "./FaqTopicList";
import { FaqTopicPanel } from "./FaqTopicPanel";

type TrekFaqSectionProps = {
  faqs: FaqTopic[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "Frequently asked questions" on the trek page (design: section "faq"): topics down the side, the open
 * topic's questions beside them. Every question on the trek also goes to Google as FAQ data.
 */
export const TrekFaqSection = ({ faqs, errors, onEdit }: TrekFaqSectionProps) => {
  const faq = useFaqTopics(faqs, errors, onEdit);
  const questionCount = faq.topics.reduce((count, topic) => count + topic.items.length, 0);

  return (
    <>
      {questionCount < RECOMMENDED_FAQS && (
        <p className="m-0 flex items-center gap-2.5 rounded-md border border-solid border-saffron-line bg-saffron-tint px-3 py-2.5 text-saffron-ink">
          <Icon name="warning" size={18} className="flex-none text-saffron-deep" />
          {questionCount ? `Only ${questionCount} question${questionCount === 1 ? "" : "s"}.` : "No questions yet."} {RECOMMENDED_FAQS} or more give
          Google more to show.
        </p>
      )}

      {/* grid-cols-1 (minmax(0, 1fr)) keeps the sideways topic row on phones from widening the panel. */}
      <section aria-label="Questions by topic" className="grid grid-cols-1 overflow-hidden rounded-lg border border-solid border-border bg-surface desktop:grid-cols-[250px_minmax(0,1fr)]">
        <FaqTopicList topics={faq.topics} openKey={faq.openKey} errorIndexes={faq.errorIndexes} onOpen={faq.open} onAdd={faq.addTopic} />
        <div className="min-w-0">
          {faq.topics.map((topic, index) => (
            <FaqTopicPanel key={topic.key} topic={topic} index={index} isOpen={topic.key === faq.openKey} faq={faq} errors={errors} />
          ))}
          {!faq.topics.length && (
            <p className="m-0 p-5 text-caption text-muted-foreground">No topics yet. Add a topic, e.g. “Altitude and health”, then its questions.</p>
          )}
        </div>
      </section>

      <FieldError id="faqs-error" message={errors.faqs} />
      <p className="m-0 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon name="travel_explore" size={16} className="flex-none text-brand" />
        All questions on this trek are added as FAQ data for Google. Answers are plain text, as on the trek page.
      </p>
    </>
  );
};
