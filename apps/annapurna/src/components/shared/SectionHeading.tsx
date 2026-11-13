import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  /** A line under the heading. */
  children?: ReactNode;
};

/** A section's small label, its H2 and the line under it. */
export const SectionHeading = ({ id, eyebrow, title, children }: SectionHeadingProps) => (
  <div className="flex flex-col gap-2">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 id={id}>{title}</h2>
    {children}
  </div>
);
