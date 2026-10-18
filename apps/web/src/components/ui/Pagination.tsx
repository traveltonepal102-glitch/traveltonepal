import { Icon } from "@ttn/ui/icon";
import type { MouseEvent } from "react";

import { pageItems } from "@/lib/pagination";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** URL of a page; real links, so paging works before JavaScript loads and search engines can follow it. */
  hrefFor: (page: number) => string;
  /** Called instead of following the link (plain clicks only; Ctrl/⌘-click still opens a new tab). */
  onPageChange?: (page: number) => void;
  label?: string;
};

const ITEM =
  "inline-flex min-h-10.5 min-w-10.5 items-center justify-center rounded-md text-body-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const LINK = `${ITEM} border border-line-strong bg-surface text-ink transition-colors hover:border-brand hover:text-brand`;
const STEP = "gap-1.5 px-3";

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/** Previous / page numbers / Next. Renders nothing when everything fits on one page. */
export const Pagination = ({ page, pageCount, hrefFor, onPageChange, label = "Pagination" }: PaginationProps) => {
  if (pageCount <= 1) return null;

  const linkTo = (target: number) => ({
    href: hrefFor(target),
    onClick: (event: MouseEvent) => {
      if (!onPageChange || !isPlainClick(event)) return;
      event.preventDefault();
      onPageChange(target);
    },
  });

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          {page > 1 ? (
            <a {...linkTo(page - 1)} rel="prev" className={`${LINK} ${STEP}`}>
              <Icon name="arrow_back" size={18} />
              <span className="max-sm:sr-only">Previous</span>
            </a>
          ) : (
            <span aria-disabled="true" className={`${ITEM} ${STEP} border border-line text-subtle`}>
              <Icon name="arrow_back" size={18} />
              <span className="max-sm:sr-only">Previous</span>
            </span>
          )}
        </li>

        {pageItems(page, pageCount).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span aria-current="page" className={`${ITEM} bg-navy text-white`}>
                  <span className="sr-only">Page </span>
                  {item}
                </span>
              ) : (
                <a {...linkTo(item)} className={LINK}>
                  <span className="sr-only">Page </span>
                  {item}
                </a>
              )}
            </li>
          ),
        )}

        <li>
          {page < pageCount ? (
            <a {...linkTo(page + 1)} rel="next" className={`${LINK} ${STEP}`}>
              <span className="max-sm:sr-only">Next</span>
              <Icon name="arrow_forward" size={18} />
            </a>
          ) : (
            <span aria-disabled="true" className={`${ITEM} ${STEP} border border-line text-subtle`}>
              <span className="max-sm:sr-only">Next</span>
              <Icon name="arrow_forward" size={18} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};
