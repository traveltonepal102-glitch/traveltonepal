import { PageHeader } from "@/components/shared/PageHeader";
import { WorkInProgress } from "@/components/shared/WorkInProgress";

import type { AdminSection } from "../navigation";

type SectionPlaceholderProps = {
  section: AdminSection;
};

/** A menu destination whose screen isn't built yet: its heading and a "Work in progress" note. */
export const SectionPlaceholder = ({ section }: SectionPlaceholderProps) => (
  <>
    <PageHeader title={section.label} description={section.summary} />
    <WorkInProgress />
  </>
);
