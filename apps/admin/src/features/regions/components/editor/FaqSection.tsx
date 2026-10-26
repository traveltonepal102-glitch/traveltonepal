import { FaqListEditor } from "@/components/editor/FaqListEditor";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_FAQS, RECOMMENDED_FAQS, REGION_LIMITS } from "../../constants";
import type { RegionFaq } from "../../types";

type FaqSectionProps = {
  faqs: RegionFaq[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** Questions and answers for the region page, in order (design: section "faq"). */
export const FaqSection = ({ faqs, errors, onEdit }: FaqSectionProps) => (
  <FaqListEditor
    faqs={faqs}
    hint="Shown near the bottom of the region page, and to Google."
    recommendedCount={RECOMMENDED_FAQS}
    maxItems={MAX_FAQS}
    limits={{ question: REGION_LIMITS.faqQuestion, answer: REGION_LIMITS.faqAnswer }}
    errors={errors}
    onEdit={onEdit}
  />
);
