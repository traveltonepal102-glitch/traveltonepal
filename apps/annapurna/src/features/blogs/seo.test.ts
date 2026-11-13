import { describe, expect, it } from "vitest";

import { blogsJsonLd } from "./seo";
import type { BlogsPageData } from "./types";

const data = {
  top: { seo: { title: "Blogs", description: "All of them" }, dates: { published: "2026-10-26", modified: "2026-11-01" } },
  guides: [{ slug: "first", title: "First" }, { slug: "second", title: "Second" }],
} as unknown as BlogsPageData;

describe("blogsJsonLd", () => {
  it("names every blog, in order, whatever page the HTML shows", () => {
    const [page] = blogsJsonLd(data)["@graph"];
    expect(page["@type"]).toBe("CollectionPage");
    expect(JSON.stringify(page)).toMatch(/"position":1,"name":"First","url":"[^"]*\/first".*"position":2,"name":"Second"/);
  });
});
