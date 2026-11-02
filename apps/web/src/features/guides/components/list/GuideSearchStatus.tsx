type GuideSearchStatusProps = {
  /** Guides matching the filters, and the 1-based range shown on this page. */
  total: number;
  from: number;
  to: number;
};

/** Announces the results to screen readers as the filters or the page change. */
export const GuideSearchStatus = ({ total, from, to }: GuideSearchStatusProps) => (
  <p aria-live="polite" className="sr-only">
    {total > 0 ? `Showing ${from} to ${to} of ${total} ${total === 1 ? "guide" : "guides"}` : "No guides found"}
  </p>
);
