"use client";

import type { GuideFeedbackResult, GuideVote } from "@ttn/site-data/guideFeedback";
import { useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { sendBlogFeedback } from "../feedback/actions";

const OPTIONS: readonly { vote: GuideVote; label: string }[] = [
  { vote: "yes", label: "Yes" },
  { vote: "no", label: "No" },
];

const UNREACHABLE: GuideFeedbackResult = { status: "error", message: "We could not reach the server. Please try again." };

/** "Was this helpful?": one vote per visit. The buttons lock while it is sent, and a thank-you takes their place once it is saved; a failed vote can be tried again. */
export const BlogFeedback = ({ slug }: { slug: string }) => {
  const [vote, setVote] = useState<GuideVote | null>(null);
  const [result, setResult] = useState<GuideFeedbackResult | null>(null);
  const isSending = vote !== null && result === null;

  const send = async (picked: GuideVote) => {
    setVote(picked);
    setResult(null);
    const outcome = await sendBlogFeedback({ slug, vote: picked }).catch(() => UNREACHABLE);
    setResult(outcome);
    if (outcome.status === "error") setVote(null);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl bg-cloud px-5 py-4">
      <p id="blog-feedback-q" className="font-semibold text-ink">
        Was this helpful?
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {result?.status !== "recorded" && (
          <div role="group" aria-labelledby="blog-feedback-q" aria-busy={isSending} className="flex gap-2">
            {OPTIONS.map((option) => (
              <button
                key={option.vote}
                type="button"
                aria-pressed={option.vote === vote}
                disabled={isSending}
                onClick={() => send(option.vote)}
                className="inline-flex min-h-11 min-w-16 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-field bg-snow px-4 font-semibold text-ink enabled:hover:border-navy enabled:hover:text-navy disabled:cursor-wait disabled:opacity-60"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <p role="status" className="text-[15px] leading-5.5 font-semibold">
          {result?.status === "recorded" && (
            <span className="inline-flex items-center gap-1.5 text-navy">
              <TrailIcon name="check" size={18} />
              Thanks for telling us
            </span>
          )}
          {result?.status === "error" && <span className="text-cream-ink">{result.message}</span>}
        </p>
      </div>
    </div>
  );
};
