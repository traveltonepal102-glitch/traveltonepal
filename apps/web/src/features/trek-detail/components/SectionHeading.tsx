import type { ReactNode } from "react";

import { EYEBROW } from "./styles";

type SectionHeadingProps = {
  /** Small line above the title, e.g. "Trek milestones". */
  eyebrow: string;
  title: string;
  /** Id of the <h2>, for the section's aria-labelledby. */
  id: string;
  /** Optional paragraph under the title. */
  description?: string;
  /** Optional text under the title that isn't one paragraph, e.g. rich text written in the admin. */
  children?: ReactNode;
};

/** Eyebrow and H2 that open each main section of the trek page. */
export const SectionHeading = ({ eyebrow, title, id, description, children }: SectionHeadingProps) => (
  <div className="flex flex-col gap-1">
    <p className={EYEBROW}>{eyebrow}</p>
    <h2 id={id} className="text-[22px] leading-tight font-extrabold md:text-[28px]">
      {title}
    </h2>
    {description && <p className="mt-1.5 max-w-190 text-body-sm text-text">{description}</p>}
    {children && <div className="mt-1.5 max-w-190 text-body-sm text-text">{children}</div>}
  </div>
);
