import { FormSection } from "@/components/ui/FormSection";
import { formatDateTime } from "@/utils/formatDateTime";

import { feedbackSummary, helpfulPercent } from "../../../lib/guideFeedback";
import type { GuideFeedbackTotals } from "../../../lib/guideFeedback";

/**
 * "Reader feedback": the answers to "Was this guide helpful?" at the end of the guide on the website, as a share of
 * Yes with both counts. Read-only; a low share is a hint to improve the guide.
 */
export const ReaderFeedbackCard = ({ feedback }: { feedback: GuideFeedbackTotals | null }) => {
  const percent = feedback && helpfulPercent(feedback);

  return (
    <FormSection title="Reader feedback" hint="“Was this guide helpful?” at the end of the guide. Nothing about the reader is kept.">
      <p className="m-0 font-display text-h4 text-ink">{feedbackSummary(feedback)}</p>
      {feedback && percent !== null && (
        <>
          <div className="h-2 overflow-hidden rounded-full bg-danger-tint" aria-hidden="true">
            <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
          </div>
          <dl className="m-0 grid grid-cols-2 gap-2 text-caption">
            <div>
              <dt className="text-muted-foreground">Yes</dt>
              <dd className="m-0 font-bold text-ink">{feedback.helpful}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Not really</dt>
              <dd className="m-0 font-bold text-ink">{feedback.notHelpful}</dd>
            </div>
          </dl>
          <p className="m-0 text-xs text-muted-foreground">Last vote {formatDateTime(feedback.lastVoteAt)} Nepal time</p>
        </>
      )}
    </FormSection>
  );
};
