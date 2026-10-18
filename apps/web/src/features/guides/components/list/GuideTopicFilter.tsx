import { GUIDE_TOPICS } from "../../topics";
import type { GuideTopicId } from "../../topics";

type GuideTopicFilterProps = {
  active: GuideTopicId | null;
  /** Guides matching the other filters (region, search), for "All guides". */
  total: number;
  /** The same, per topic. */
  countFor: (topic: GuideTopicId) => number;
  onPick: (topic: GuideTopicId | null) => void;
};

const OPTIONS: readonly { value: GuideTopicId | null; label: string }[] = [
  { value: null, label: "All guides" },
  ...GUIDE_TOPICS.map((topic) => ({ value: topic.id, label: topic.title })),
];

/**
 * Topic chips with guide counts. A topic with no guides for the current region or search is disabled,
 * so a chip never leads to an empty list. Scrolls sideways on phones.
 */
export const GuideTopicFilter = ({ active, total, countFor, onPick }: GuideTopicFilterProps) => (
  <div
    role="group"
    aria-label="Filter guides by topic"
    // relative: keeps the badges' screen-reader text (absolutely positioned) inside the scrolling row on phones.
    className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
  >
    {OPTIONS.map((option) => {
      const isActive = option.value === active;
      const count = option.value ? countFor(option.value) : total;
      return (
        <button
          key={option.label}
          type="button"
          aria-pressed={isActive}
          disabled={count === 0 && !isActive}
          onClick={() => onPick(option.value)}
          className={`inline-flex min-h-10 flex-none cursor-pointer items-center gap-2 rounded-full border px-4 text-caption font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            isActive ? "border-navy bg-navy text-white" : "border-line-strong bg-surface text-ink enabled:hover:border-brand"
          }`}
        >
          {option.label}
          <span
            className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold ${
              isActive ? "bg-white/20 text-white" : "bg-brand-tint text-text"
            }`}
          >
            {count}
            <span className="sr-only"> {count === 1 ? "guide" : "guides"}</span>
          </span>
        </button>
      );
    })}
  </div>
);
