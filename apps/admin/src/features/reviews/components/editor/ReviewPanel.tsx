"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@ttn/ui/lib/utils";
import { useRouter } from "next/navigation";

import { ConfirmRemoveButton } from "@/components/editor/ConfirmRemoveButton";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { SideDrawer } from "@/components/ui/SideDrawer";

import { removeReview } from "../../actions/removeReview";
import { REVIEWS_PATH } from "../../constants";
import type { Review, ReviewTrekOption, ReviewValues } from "../../types";
import { ReviewPlacementFields, ReviewTextFields } from "./ReviewFields";

type ReviewPanelProps = {
  /** saveReview bound to this review's id (null for a new review). */
  action: EditorSaveAction;
  /** The saved review; null for a new one. */
  review: Review | null;
  values: ReviewValues;
  treks: ReviewTrekOption[];
  canRemove: boolean;
};

const STATUS_TONE = { saved: "text-whatsapp", unsaved: "text-saffron-ink", neutral: "text-muted-foreground" } as const;

/** Add or edit one review in a drawer over the list. One Save sends everything and closes the drawer. */
export const ReviewPanel = ({ action, review, values, treks, canRemove }: ReviewPanelProps) => {
  const form = useEditorForm<"review">({
    action,
    firstKey: "review",
    firstSectionWithError: () => undefined,
    isNew: !review,
  });
  const router = useRouter();
  const [status, tone] = form.saveStatus;
  const title = review ? `Review by ${review.reviewerName}` : "Add review";

  const close = () => {
    if (form.isDirty && !window.confirm("Close without saving? Your changes to this review will be lost.")) return;
    router.push(REVIEWS_PATH, { scroll: false });
  };

  return (
    <SideDrawer
      kicker={review ? "Edit review" : "New review"}
      title={title}
      status={
        <p role="status" className={cn("m-0 text-xs font-semibold", STATUS_TONE[tone])}>
          {status}
        </p>
      }
      onClose={close}
    >
      <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 max-tablet:px-5">
          {form.state.status === "error" && <FormAlert message={form.state.message} />}
          <ReviewTextFields values={values} photo={review?.photo ?? null} errors={form.errors} onEdit={form.markDirty} />
          <ReviewPlacementFields values={values} treks={treks} errors={form.errors} />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          {review && canRemove && <ConfirmRemoveButton name={title} action={removeReview.bind(null, review.id)} />}
          <span className="flex-1" />
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={form.isSaving} className={primaryButton}>
            {form.isSaving ? "Saving…" : review ? "Save changes" : "Add review"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};
