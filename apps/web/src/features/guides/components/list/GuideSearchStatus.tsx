import { Icon } from "@ttn/ui/icon";

type GuideSearchStatusProps = {
  /** Guides matching the filters, and the 1-based range shown on this page. */
  total: number;
  from: number;
  to: number;
  query: string;
  onClearSearch: () => void;
};

/** Announces the results to screen readers, and shows the active search with a button to clear it. */
export const GuideSearchStatus = ({ total, from, to, query, onClearSearch }: GuideSearchStatusProps) => (
  <>
    <p aria-live="polite" className="sr-only">
      {total > 0 ? `Showing ${from} to ${to} of ${total} ${total === 1 ? "guide" : "guides"}` : "No guides found"}
    </p>
    {query && (
      <div>
        <button
          type="button"
          onClick={onClearSearch}
          aria-label={`Clear the search for “${query}”`}
          className="inline-flex min-h-9.5 cursor-pointer items-center gap-1.5 rounded-full border border-brand/30 bg-brand-tint px-3.5 text-caption font-bold text-navy hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Search: “{query}”
          <Icon name="close" size={16} />
        </button>
      </div>
    )}
  </>
);
