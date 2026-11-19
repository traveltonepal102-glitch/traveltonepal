import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  /** On the dark bands (the itinerary, "Why book with us"): light words, a light saffron label. */
  isOnDark?: boolean;
  /** A line under the heading. */
  children?: ReactNode;
};

/** A section's small label with its saffron dash, its H2 and the line under it. */
export const SectionHeading = ({ id, eyebrow, title, isOnDark = false, children }: SectionHeadingProps) => (
  <div className={`flex max-w-190 flex-col gap-3 ${isOnDark ? "text-on-maroon-muted" : ""}`}>
    {eyebrow && <span className={`eyebrow eyebrow-dash ${isOnDark ? "text-saffron-light" : ""}`}>{eyebrow}</span>}
    <h2 id={id} className={isOnDark ? "text-paper" : ""}>
      {title}
    </h2>
    {children}
  </div>
);
