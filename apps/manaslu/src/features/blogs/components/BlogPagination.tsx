import Link from "next/link";
import type { ReactNode } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { pageNumbers } from "../blogFiltering";

const ITEM = "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-solid px-3 font-semibold no-underline";
const LINK = `${ITEM} border-line bg-snow text-ink hover:border-forest hover:text-forest`;
const CURRENT = `${ITEM} border-forest bg-forest text-snow hover:text-snow`;

type BlogPaginationProps = {
  page: number;
  pageCount: number;
  /** A page's own address: the whole list's pages are real pages, so these are links. */
  hrefFor?: (page: number) => string;
  /** Without addresses (a search's or a topic's pages, which exist only in the browser): buttons that call this. */
  onChoose?: (page: number) => void;
};

/** Previous, the page numbers and Next: links to the list's pages, or buttons through what a search found. Hidden with a single page. */
export const BlogPagination = ({ page, pageCount, hrefFor, onChoose }: BlogPaginationProps) => {
  if (pageCount <= 1) return null;

  const item = (target: number, children: ReactNode, rel?: "prev" | "next") => {
    const isCurrent = !rel && target === page;
    const shared = { "aria-label": rel ? undefined : `Page ${target}`, "aria-current": isCurrent ? ("page" as const) : undefined, className: isCurrent ? CURRENT : LINK };
    if (hrefFor) {
      return (
        <Link href={hrefFor(target)} rel={rel} {...shared}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" onClick={() => onChoose?.(target)} {...shared}>
        {children}
      </button>
    );
  };

  return (
    <nav aria-label="Pages of blogs">
      <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
        {page > 1 && (
          <li>
            {item(
              page - 1,
              <>
                <TrailIcon name="arrow" size={16} className="rotate-180" />
                Previous
              </>,
              "prev",
            )}
          </li>
        )}
        {pageNumbers(page, pageCount).map((number, index) =>
          number === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={number}>{item(number, number)}</li>
          ),
        )}
        {page < pageCount && (
          <li>
            {item(
              page + 1,
              <>
                Next
                <TrailIcon name="arrow" size={16} />
              </>,
              "next",
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};
