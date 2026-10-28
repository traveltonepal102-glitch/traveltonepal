"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { sendGuideFeedback } from "../../feedback/actions";
import type { GuideFeedbackResult, GuideVote } from "../../feedback/schema";
import { FOCUS } from "../styles";

const OPTIONS = [
  { vote: "yes", label: "Yes", icon: "thumb_up", pickedIcon: "thumb_up-fill" },
  { vote: "no", label: "No", icon: "thumb_down", pickedIcon: "thumb_down-fill" },
] as const satisfies readonly { vote: GuideVote; label: string; icon: string; pickedIcon: string }[];

const UNREACHABLE: GuideFeedbackResult = { status: "error", message: "We could not reach the server. Please try again." };

/**
 * "Was this guide helpful?" as one slim line with round 👍 Yes / 👎 No buttons. One vote per visit: the buttons
 * lock while it is sent, and a thank-you takes their place once it is saved.
 */
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
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-y border-line py-3.5 print:hidden">
      <p id="guide-feedback-question" className="text-[15px] font-bold text-ink">
        Was this guide helpful?
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {!isRecorded && (
          <div role="group" aria-labelledby="guide-feedback-question" aria-busy={isSending} className="flex items-center gap-2">
            {OPTIONS.map((option) => {
              const isPicked = option.vote === vote;
              return (
                <button
                  key={option.vote}
                  type="button"
                  aria-pressed={isPicked}
                  disabled={isSending}
                  onClick={() => send(option.vote)}
                  className={`inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-body-sm font-bold transition-colors disabled:cursor-default ${FOCUS} ${
                    isPicked
                      ? "border-brand bg-brand-tint text-brand"
                      : "border-line-strong bg-surface text-ink enabled:hover:border-brand enabled:hover:text-brand"
                  }`}
                >
                  <Icon name={isPicked ? option.pickedIcon : option.icon} size={18} />
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
        <p role="status" className="text-caption font-semibold">
          {isRecorded && (
            <span className="inline-flex items-center gap-1.5 text-whatsapp">
              <Icon name="check_circle" size={18} />
              Thanks for telling us
            </span>
          )}
          {result?.status === "error" && <span className="text-danger">{result.message}</span>}
        </p>
      </div>
    </div>
  );
};
