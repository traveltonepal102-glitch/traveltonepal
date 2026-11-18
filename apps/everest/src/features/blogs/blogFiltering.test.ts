import { describe, expect, it } from "vitest";

import type { HomeGuide } from "@/features/home/types";

import { EMPTY_BLOG_FILTERS, blogTopics, matchesBlogSearch, pageNumbers, parseBlogFilters, serializeBlogFilters, toBlogPage } from "./blogFiltering";

const guide = (slug: string, topic = "planning", extra: Partial<HomeGuide> = {}): HomeGuide => ({ slug, title: `Blog ${slug}`, text: "", topic, tag: topic.toUpperCase(), meta: "", isFeatured: false, regionSlugs: [], ...extra });
const many = (count: number) => Array.from({ length: count }, (_, index) => guide(String(index + 1)));

describe("matchesBlogSearch", () => {
  const blog = guide("x", "permits", { title: "Manaslu permits explained", text: "What you need" });

  it("ignores case and accents and needs every word, anywhere", () => {
    expect(matchesBlogSearch(blog, "MANASLU need")).toBe(true);
    expect(matchesBlogSearch(blog, "mánaslu")).toBe(true);
    expect(matchesBlogSearch(blog, "manaslu visa")).toBe(false);
  });

  it("finds the topic's name, and everything for an empty search", () => {
    expect(matchesBlogSearch(blog, "PERMITS")).toBe(true);
    expect(matchesBlogSearch(blog, "   ")).toBe(true);
  });
});

describe("parseBlogFilters", () => {
  const parse = (query: string) => parseBlogFilters(new URLSearchParams(query), ["planning"]);

  it("reads what's usable", () => {
    expect(parse("q=%20permit%20&topic=planning&page=3")).toEqual({ q: "permit", topic: "planning", page: 3 });
  });

  it("falls back on an unknown topic or a bad page", () => {
    for (const page of ["0", "-1", "1.5", "abc"]) expect(parse(`topic=nope&page=${page}`)).toEqual(EMPTY_BLOG_FILTERS);
  });
});

describe("serializeBlogFilters", () => {
  it("leaves out the defaults", () => {
    expect(serializeBlogFilters(EMPTY_BLOG_FILTERS)).toBe("");
    expect(serializeBlogFilters({ q: "a b", topic: "planning", page: 2 })).toBe("q=a+b&topic=planning&page=2");
  });
});

describe("blogTopics", () => {
  it("lists each topic once, in order", () => {
    expect(blogTopics([guide("1", "b"), guide("2", "a"), guide("3", "b")])).toEqual([{ id: "b", label: "B" }, { id: "a", label: "A" }]);
  });
});

describe("toBlogPage", () => {
  it("splits into pages", () => {
    const second = toBlogPage(many(5), { ...EMPTY_BLOG_FILTERS, page: 2 }, 2);
    expect(second.items.map((item) => item.slug)).toEqual(["3", "4"]);
    expect(second).toMatchObject({ page: 2, pageCount: 3, total: 5 });
  });

  it("shows the last page for a page past the end, and one page when empty", () => {
    expect(toBlogPage(many(3), { ...EMPTY_BLOG_FILTERS, page: 99 }, 2).page).toBe(2);
    expect(toBlogPage([], EMPTY_BLOG_FILTERS, 2)).toMatchObject({ page: 1, pageCount: 1, total: 0, items: [] });
  });

  it("keeps a featured blog in the list like any other", () => {
    const blogs = [guide("1"), guide("f", "planning", { isFeatured: true }), guide("2")];
    expect(toBlogPage(blogs, EMPTY_BLOG_FILTERS, 2).items.map((item) => item.slug)).toEqual(["1", "f"]);
    expect(toBlogPage(blogs, { ...EMPTY_BLOG_FILTERS, page: 2 }, 2).items.map((item) => item.slug)).toEqual(["2"]);
  });

  it("goes back to the first page when a topic leaves fewer", () => {
    const { items, page } = toBlogPage([guide("t", "permits"), guide("1")], { q: "", topic: "permits", page: 5 }, 2);
    expect(items.map((item) => item.slug)).toEqual(["t"]);
    expect(page).toBe(1);
  });

  it("shows an empty page for no match", () => {
    expect(toBlogPage(many(3), { ...EMPTY_BLOG_FILTERS, q: "nothing-like-this" })).toMatchObject({ total: 0, items: [], isFiltering: true });
  });
});

describe("pageNumbers", () => {
  it("lists a few pages without gaps", () => {
    expect(pageNumbers(1, 1)).toEqual([1]);
    expect(pageNumbers(2, 3)).toEqual([1, 2, 3]);
  });

  it("marks the pages left out", () => {
    expect(pageNumbers(1, 9)).toEqual([1, 2, "gap", 9]);
    expect(pageNumbers(5, 9)).toEqual([1, "gap", 4, 5, 6, "gap", 9]);
    expect(pageNumbers(9, 9)).toEqual([1, "gap", 8, 9]);
  });
});
