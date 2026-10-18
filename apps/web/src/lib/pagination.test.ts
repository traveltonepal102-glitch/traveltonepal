import { describe, expect, it } from "vitest";

import { pageItems, paginate } from "./pagination";

const ITEMS = Array.from({ length: 10 }, (_, index) => index + 1);

describe("paginate", () => {
  it("returns the items of a page and their positions", () => {
    expect(paginate(ITEMS, 2, 4)).toEqual({ items: [5, 6, 7, 8], page: 2, pageCount: 3, from: 5, to: 8 });
  });

  it("shows a short last page", () => {
    expect(paginate(ITEMS, 3, 4)).toMatchObject({ items: [9, 10], from: 9, to: 10 });
  });

  it("clamps a page outside the range", () => {
    expect(paginate(ITEMS, 9, 4).page).toBe(3);
    expect(paginate(ITEMS, 0, 4).page).toBe(1);
  });

  it("has one empty page when there are no items", () => {
    expect(paginate([], 1, 4)).toEqual({ items: [], page: 1, pageCount: 1, from: 0, to: 0 });
  });
});

describe("pageItems", () => {
  it("lists every page when there are few", () => {
    expect(pageItems(1, 1)).toEqual([1]);
    expect(pageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("puts gaps around the current page's neighbours", () => {
    expect(pageItems(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
    expect(pageItems(1, 10)).toEqual([1, 2, "gap", 10]);
    expect(pageItems(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("shows a single skipped page instead of a gap", () => {
    expect(pageItems(4, 10)).toEqual([1, 2, 3, 4, 5, "gap", 10]);
  });
});
