"use client";

type FilterSheetFooterProps = {
  shownCount: number;
  onClearAll: () => void;
  onClose: () => void;
};

const BUTTON = "min-h-12.5 cursor-pointer rounded-full px-4.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const showLabel = (count: number) => {
  if (count === 0) return "No treks match";
  return `Show ${count} ${count === 1 ? "trek" : "treks"}`;
};

/** Phones and tablets: stays at the bottom of the filter sheet while its content scrolls. */
export const FilterSheetFooter = ({ shownCount, onClearAll, onClose }: FilterSheetFooterProps) => (
  <div className="sticky bottom-0 z-10 flex gap-2.5 border-t border-line bg-surface px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden">
    <button type="button" onClick={onClearAll} className={`${BUTTON} flex-none border border-line-strong bg-surface font-bold text-ink`}>
      Clear all
    </button>
    <button type="button" onClick={onClose} className={`${BUTTON} flex-1 bg-brand font-extrabold text-on-brand hover:bg-brand-hover`}>
      {showLabel(shownCount)}
    </button>
  </div>
);
