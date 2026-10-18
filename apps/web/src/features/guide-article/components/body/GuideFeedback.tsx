"use client";

import { useState } from "react";

import { sendGuideFeedback } from "../../feedback/actions";
import type { GuideFeedbackResult, GuideVote } from "../../feedback/schema";
import { FOCUS } from "../styles";

const OPTIONS: readonly { vote: GuideVote; label: string }[] = [
  { vote: "yes", label: "Yes" },
  { vote: "no", label: "Not really" },
];

const UNREACHABLE: GuideFeedbackResult = { status: "error", message: "We could not reach the server. Please try again." };

/** "Was this guide helpful?" Yes / Not really. One vote per visit; the buttons lock while it is sent and after. */
export const GuideFeedback = ({ slug }: { slug: string }) => {
  const [vote, setVote] = useState<GuideVote | null>(null);
  const [result, setResult] = useState<GuideFeedbackResult | null>(null);
  const isSending = vote !== null && result === null;
  const isRecorded = result?.status === "recorded";

  const send = async (picked: GuideVote) => {
    setVote(picked);
    setResult(null);
    const outcome = await sendGuideFeedback({ slug, vote: picked }).catch(() => UNREACHABLE);
    setResult(outcome);
    // A failed vote can be tried again.
    if (outcome.status === "error") setVote(null);
  };

  return (
    <div className="flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <p id="guide-feedback-question" className="text-[15px] font-bold text-ink">
        Was this guide helpful?
      </p>
      <div role="group" aria-labelledby="guide-feedback-question" className="flex flex-wrap items-center gap-2">
        {OPTIONS.map((option) => {
          const isPicked = option.vote === vote;
          return (
            <button
              key={option.vote}
              type="button"
              aria-pressed={isPicked}
              disabled={isSending || isRecorded}
              onClick={() => send(option.vote)}
              className={`min-h-10 cursor-pointer rounded-md border px-4 text-body-sm font-bold transition-colors disabled:cursor-default ${FOCUS} ${
                isPicked ? "border-brand bg-brand text-on-brand" : "border-line-strong bg-surface text-ink enabled:hover:border-brand"
              } ${!isPicked && isRecorded ? "opacity-60" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
        <p role="status" className="text-caption">
          {isRecorded && <span className="font-semibold text-whatsapp">Thanks for telling us.</span>}
          {result?.status === "error" && <span className="font-semibold text-danger">{result.message}</span>}
        </p>
      </div>
    </div>
  );
};
