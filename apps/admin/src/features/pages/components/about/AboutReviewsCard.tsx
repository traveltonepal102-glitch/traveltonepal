import { PendingSection } from "@/components/editor/PendingSection";
import { FormSection } from "@/components/ui/FormSection";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SectionHeadingFields } from "../SectionHeadingFields";

type AboutReviewsCardProps = { heading: string; errors: FieldErrors };

/** "Reviews": the heading now; the review scores and the three reviews shown come with the Reviews screen. */
export const AboutReviewsCard = ({ heading, errors }: AboutReviewsCardProps) => (
  <>
    <FormSection title="Section heading" hint="The section shows once there are real reviews.">
      <SectionHeadingFields eyebrow="Reviews" heading={{ name: "reviewsHeading", value: heading, placeholder: "What trekkers say about us" }} errors={errors} />
    </FormSection>
    <PendingSection waitsFor="the Reviews screen (review scores and the 3 reviews shown)" />
  </>
);
