"use client";

import { useRef } from "react";

/** What to do with a file named like a photo already in the library. */
export type SameNameAnswer = "upload" | "useLibraryPhoto" | "skip";

/**
 * The upload waits on a question ("This photo is already in the library") until the editor answers it; a stopped
 * upload answers every open question with "skip".
 */
export const useSameNameQuestions = () => {
  const waiting = useRef(new Map<string, (answer: SameNameAnswer) => void>());

  const ask = (id: string, signal: AbortSignal) =>
    new Promise<SameNameAnswer>((resolve) => {
      if (signal.aborted) return resolve("skip");
      waiting.current.set(id, resolve);
      signal.addEventListener("abort", () => resolve("skip"), { once: true });
    });

  const answer = (id: string, value: SameNameAnswer) => {
    waiting.current.get(id)?.(value);
    waiting.current.delete(id);
  };

  return { ask, answer };
};
