export type Paginated<T> = {
  items: T[];
  /** The page shown, clamped to 1…pageCount. */
  page: number;
  pageCount: number;
  /** 1-based position of the first and last item shown (0 and 0 when there are none). */
  from: number;
  to: number;
};

/** One page of `items`; a page past the end shows the last page. */
export const paginate = <T>(items: readonly T[], page: number, perPage: number): Paginated<T> => {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * perPage;
  const shown = items.slice(start, start + perPage);

  return { items: shown, page: current, pageCount, from: shown.length ? start + 1 : 0, to: start + shown.length };
};

export type PageItem = number | "gap";

/**
 * Page numbers for a pager: the first, the last and the ones next to the current page, with "gap"
 * where pages are skipped. 5 of 10 → [1, "gap", 4, 5, 6, "gap", 10]. A gap never hides just one page.
 */
export const pageItems = (page: number, pageCount: number): PageItem[] => {
  const shown = new Set([1, pageCount, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pageCount));
  const sorted = [...shown].sort((a, b) => a - b);

  return sorted.flatMap((n, index): PageItem[] => {
    const previous = sorted[index - 1];
    if (previous === undefined || n - previous === 1) return [n];
    return n - previous === 2 ? [previous + 1, n] : ["gap", n];
  });
};
