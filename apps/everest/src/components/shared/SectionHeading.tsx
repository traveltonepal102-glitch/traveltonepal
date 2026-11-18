import type { ReactNode } from "react";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  /** On the dark bands (the itinerary, "Why book with us"): light words, a glacier label. */
  isOnDark?: boolean;
  /** A line under the heading. */
  children?: ReactNode;
  /** The heading may run the page's width (a long title meant for one line on a laptop, e.g. the route map's). */
  isWide?: boolean;
};

/** A section's small label with its glacier dash, its H2 and the line under it. */
export const SectionHeading = ({ id, eyebrow, title, isOnDark = false, children, isWide = false }: SectionHeadingProps) => (
  <div className={`flex flex-col gap-3 ${isWide ? "max-w-none" : "max-w-190"} ${isOnDark ? "text-on-ocean-muted" : ""}`}>
    {eyebrow && <span className={`eyebrow eyebrow-dash ${isOnDark ? "text-glacier" : ""}`}>{eyebrow}</span>}
    <h2 id={id} className={isOnDark ? "text-mist" : ""}>
      {title}
    </h2>
    {children}
  </div>
);
