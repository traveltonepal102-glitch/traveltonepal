"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { FAQ_ICONS, MAX_FAQ_QUESTIONS, TREK_LIMITS as LIMIT } from "../../../constants";
import type { FaqTopicDraft, FaqTopics } from "../../../hooks/useFaqTopics";

type FaqTopicPanelProps = {
  topic: FaqTopicDraft & { key: string };
  index: number;
  isOpen: boolean;
  faq: FaqTopics;
  errors: FieldErrors;
};

/**
 * One topic: its name and icon, then its questions. Closed topics stay in the form (hidden), so Save sends
 * every topic. Questions are sent as faq<topic number>Question/Answer.
 */
export const FaqTopicPanel = ({ topic, index, isOpen, faq, errors }: FaqTopicPanelProps) => {
  const number = index + 1;
  const field = `faqs.${index}`;

  return (
    <div hidden={!isOpen} className="flex min-w-0 flex-col gap-3 p-5 max-tablet:p-4">
      <div className="grid items-start gap-2 tablet:grid-cols-[150px_minmax(0,1fr)_auto]">
        <SelectField name="faqTopicIcon" label="Icon" options={FAQ_ICONS} defaultValue={topic.icon} error={errors[`${field}.icon`]} />
        <TextField
          name="faqTopicTitle"
          label="Topic"
          value={topic.title}
          onValueChange={(title) => faq.renameTopic(topic.key, title)}
          placeholder="e.g. Altitude and health"
          maxLength={LIMIT.faqTopicTitle}
          error={errors[`${field}.title`]}
          inputClassName="font-bold"
        />
        <div className="flex gap-0.5 tablet:pt-6">
          <button type="button" className={ghostIconButton} aria-label={`Move topic ${number} up`} disabled={index === 0} onClick={() => faq.moveTopic(index, index - 1)}>
            <Icon name="arrow_upward" size={18} />
          </button>
          <button
            type="button"
            className={ghostIconButton}
            aria-label={`Move topic ${number} down`}
            disabled={index === faq.topics.length - 1}
            onClick={() => faq.moveTopic(index, index + 1)}
          >
            <Icon name="arrow_downward" size={18} />
          </button>
          <button type="button" className={ghostIconButton} aria-label={`Remove topic ${number}`} onClick={() => faq.removeTopic(topic.key)}>
            <Icon name="delete" size={18} />
          </button>
        </div>
      </div>

      {topic.items.map((item, row) => (
        <div key={item.key} className="flex gap-2 rounded-xl border border-solid border-border bg-page p-2.5">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <TextField
              name={`faq${index}Question`}
              label={`Question ${row + 1}`}
              defaultValue={item.question}
              placeholder="e.g. How do you prevent altitude sickness?"
              maxLength={LIMIT.faqQuestion}
              error={errors[`${field}.items.${row}.question`]}
              inputClassName="font-bold"
            />
            <TextField
              name={`faq${index}Answer`}
              label="Answer"
              multiline
              defaultValue={item.answer}
              placeholder="A short, direct answer in one or two sentences."
              maxLength={LIMIT.faqAnswer}
              error={errors[`${field}.items.${row}.answer`]}
              inputClassName="min-h-18 resize-none [field-sizing:content]"
            />
          </div>
          <div className="flex flex-col gap-0.5 pt-6">
            <button type="button" className={ghostIconButton} aria-label={`Move question ${row + 1} up`} disabled={row === 0} onClick={() => faq.moveQuestion(topic.key, row, row - 1)}>
              <Icon name="arrow_upward" size={18} />
            </button>
            <button
              type="button"
              className={ghostIconButton}
              aria-label={`Move question ${row + 1} down`}
              disabled={row === topic.items.length - 1}
              onClick={() => faq.moveQuestion(topic.key, row, row + 1)}
            >
              <Icon name="arrow_downward" size={18} />
            </button>
            <button type="button" className={ghostIconButton} aria-label={`Remove question ${row + 1}`} onClick={() => faq.removeQuestion(topic.key, item.key)}>
              <Icon name="delete" size={18} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => faq.addQuestion(topic.key)}
        disabled={topic.items.length >= MAX_FAQ_QUESTIONS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add question
      </button>
      <FieldError id={`faq-topic-${index}-error`} message={errors[`${field}.items`]} />
    </div>
  );
};
