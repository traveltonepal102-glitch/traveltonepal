import { describe, expect, it } from "vitest";

import { blogsJsonLd, blogsPageTitle } from "./seo";
import type { BlogsPageData } from "./types";

const data = {
  top: { seo: { title: "Blog", description: "All of them" }, dates: { published: "2026-10-26", modified: "2026-11-01" } },
  guides: [{ slug: "first", title: "First" }, { slug: "second", title: "Second" }, { slug: "third", title: "Third" }],
} as unknown as BlogsPageData;

describe("blogsJsonLd", () => {
  it("names the first page's blogs, in order, at the Blog page's address", () => {
    const [page] = blogsJsonLd(data, 1, 2)["@graph"];
    expect(page["@type"]).toBe("CollectionPage");
    expect(JSON.stringify(page)).toMatch(/"url":"[^"]*\/blog","name":"Blog"/);
    expect(JSON.stringify(page)).toMatch(/"position":1,"name":"First","url":"[^"]*\/first".*"position":2,"name":"Second"/);
    expect(JSON.stringify(page)).not.toContain("Third");
  });

  it("names a later page's own blogs, numbered through the whole list, at that page's address", () => {
    const [page] = blogsJsonLd(data, 2, 2)["@graph"];
    expect(JSON.stringify(page)).toMatch(/"url":"[^"]*\/blog\/seite\/2","name":"Blog \(Seite 2\)"/);
    expect(JSON.stringify(page)).toMatch(/"position":3,"name":"Third"/);
    expect(JSON.stringify(page)).not.toContain("First");
  });
});

describe("blogsPageTitle", () => {
  it("adds the page number after the first page", () => {
    expect(blogsPageTitle("Blog", 1)).toBe("Blog");
    expect(blogsPageTitle("Blog", 3)).toBe("Blog (Seite 3)");
  });
});
