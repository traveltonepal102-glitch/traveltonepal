import type { MouseEvent } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { pageNumbers } from "../blogFiltering";
import { isPlainClick } from "../isPlainClick";

const ITEM = "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-[10px] border border-solid px-3 font-semibold no-underline";
const LINK = `${ITEM} border-line bg-snow text-ink hover:border-forest hover:text-forest`;

type BlogPaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  /** Called with the page chosen; without it the links simply load their address. */
  onChoose?: (page: number) => void;
};

/** Previous, the page numbers and Next, as real links. Hidden with a single page. */
export const BlogPagination = ({ page, pageCount, hrefFor, onChoose }: BlogPaginationProps) => {
  if (pageCount <= 1) return null;

  const choose = (target: number) => (event: MouseEvent) => {
    if (!onChoose || !isPlainClick(event)) return;
    event.preventDefault();
    onChoose(target);
  };

  return (
    <nav aria-label="Pages of blogs" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <a href={hrefFor(page - 1)} rel="prev" onClick={choose(page - 1)} className={LINK}>
          <TrailIcon name="arrow" size={16} className="rotate-180" />
          Previous
        </a>
      )}
      {pageNumbers(page, pageCount).map((number, index) =>
        number === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : (
          <a
            key={number}
            href={hrefFor(number)}
            aria-label={`Page ${number}`}
            aria-current={number === page ? "page" : undefined}
            onClick={choose(number)}
            className={number === page ? `${ITEM} border-forest bg-forest text-snow hover:text-snow` : LINK}
          >
            {number}
          </a>
        ),
      )}
      {page < pageCount && (
        <a href={hrefFor(page + 1)} rel="next" onClick={choose(page + 1)} className={LINK}>
          Next
          <TrailIcon name="arrow" size={16} />
        </a>
      )}
    </nav>
  );
};
