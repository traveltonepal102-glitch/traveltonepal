"use client";

import { useState } from "react";

import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { FaqIcon, FaqTopic } from "../types";

/** A question row; its text stays in the (uncontrolled) fields, the key keeps it in place when rows move. */
export type FaqQuestionRow = { key: string; question: string; answer: string };
export type FaqTopicDraft = { title: string; icon: FaqIcon; items: FaqQuestionRow[] };

export type FaqTopics = ReturnType<typeof useFaqTopics>;

const newQuestion =(): FaqQuestionRow => ({ key: crypto.randomUUID(), question: "", answer: "" });

/** Topic numbers with an error ("faqs.2.items.0.answer" → 2), lowest first. */
const topicsWithErrors = (errors: FieldErrors) =>
  [...new Set(Object.keys(errors).flatMap((field) => /^faqs\.(\d+)/.exec(field)?.[1] ?? []).map(Number))].sort((a, b) => a - b);

/**
 * The trek's question topics and which one is open. After a failed save, the first topic with an error opens
 * (state adjusted while rendering, not in an effect).
 */
export const useFaqTopics = (initial: FaqTopic[], errors: FieldErrors, onEdit: () => void) => {
  const topics = useRowList<FaqTopicDraft>(
    initial.map((topic) => ({ ...topic, items: topic.items.map((item, index) => ({ ...item, key: `saved-${index}` })) })),
    onEdit,
  );
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [seenErrors, setSeenErrors] = useState(errors);
  const errorIndexes = topicsWithErrors(errors);

  if (errors !== seenErrors) {
    setSeenErrors(errors);
    const firstWithError = topics.rows[errorIndexes[0]];
    if (firstWithError) setOpenKey(firstWithError.key);
  }

  const open = topics.rows.find((topic) => topic.key === openKey) ?? topics.rows[0];
  const items = (key: string) => topics.rows.find((topic) => topic.key === key)?.items ?? [];
  const setItems = (key: string, next: FaqQuestionRow[]) => topics.update(key, { items: next });

  return {
    topics: topics.rows,
    openKey: open?.key ?? null,
    errorIndexes,
    open: setOpenKey,
    addTopic: () => {
      const key = topics.add({ title: "", icon: "info", items: [newQuestion()] });
      setOpenKey(key);
    },
    removeTopic: topics.remove,
    moveTopic: topics.move,
    renameTopic: (key: string, title: string) => topics.update(key, { title }),
    addQuestion: (key: string) => setItems(key, [...items(key), newQuestion()]),
    removeQuestion: (key: string, questionKey: string) => setItems(key, items(key).filter((item) => item.key !== questionKey)),
    moveQuestion: (key: string, from: number, to: number) => {
      const next = [...items(key)];
      if (to < 0 || to >= next.length) return;
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      setItems(key, next);
    },
  };
};
