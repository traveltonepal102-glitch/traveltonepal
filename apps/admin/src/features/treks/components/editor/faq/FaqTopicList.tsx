"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { secondaryButton } from "@/components/ui/buttonStyles";

import { MAX_FAQ_TOPICS } from "../../../constants";
import type { FaqTopicDraft } from "../../../hooks/useFaqTopics";

type FaqTopicListProps = {
  topics: (FaqTopicDraft & { key: string })[];
  openKey: string | null;
  /** Topic numbers with an error, marked in red. */
  errorIndexes: number[];
  onOpen: (key: string) => void;
  onAdd: () => void;
};

/** The topics down the side of the questions (design: "Topics"), each with its number of questions. */
export const FaqTopicList = ({ topics, openKey, errorIndexes, onOpen, onAdd }: FaqTopicListProps) => (
  <div className="flex min-w-0 flex-col gap-0.5 border-solid border-border bg-page p-3 max-desktop:border-b desktop:border-r">
    <span className="px-2.5 pt-1 pb-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Topics</span>
    <ul className="m-0 flex list-none flex-col gap-0.5 p-0 max-desktop:flex-row max-desktop:overflow-x-auto">
      {topics.map((topic, index) => {
        const isOpen = topic.key === openKey;
        const hasError = errorIndexes.includes(index);
        return (
          <li key={topic.key} className="flex-none">
            <button
              type="button"
              aria-current={isOpen ? "true" : undefined}
              onClick={() => onOpen(topic.key)}
              className={cn(
                "m-0 flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-solid px-2.5 py-2 text-left font-sans text-caption font-semibold focus-visible:outline-2 focus-visible:outline-ring max-desktop:whitespace-nowrap",
                isOpen ? "border-brand/40 bg-surface text-brand" : "border-transparent bg-transparent text-text hover:bg-surface",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon name={topic.icon} size={18} className="flex-none text-subtle" />
                <span className="max-desktop:truncate">{topic.title.trim() || `Topic ${index + 1}`}</span>
                {hasError && <span className="sr-only">(has a problem)</span>}
              </span>
              <span
                className={cn(
                  "flex-none rounded-full border border-solid px-1.5 text-[11px] font-bold",
                  hasError ? "border-danger bg-danger-tint text-danger" : "border-border bg-surface text-muted-foreground",
                )}
              >
                {topic.items.length}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
    <button type="button" onClick={onAdd} disabled={topics.length >= MAX_FAQ_TOPICS} className={cn(secondaryButton, "mt-2 min-h-8 self-start px-3 text-caption")}>
      <Icon name="add" size={16} />
      Add topic
    </button>
  </div>
);
