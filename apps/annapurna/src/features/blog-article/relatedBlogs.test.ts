import { describe, expect, it } from "vitest";

import type { HomeGuide } from "@/features/home/types";

import { pickRelatedBlogs } from "./relatedBlogs";

const guide = (slug: string, topic = "x", regionSlugs: string[] = []): HomeGuide => ({ slug, title: slug, text: "", topic, tag: topic, meta: "", isFeatured: false, regionSlugs });
const slugs = (list: readonly HomeGuide[]) => list.map((item) => item.slug);
const blog = { slug: "me", topic: "t", regionSlugs: ["r"], relatedSlugs: [] as string[] };

describe("pickRelatedBlogs", () => {
  it("never picks the blog itself, and stops at the count", () => {
    expect(slugs(pickRelatedBlogs(blog, [guide("me"), guide("a"), guide("b")], 1))).toEqual(["a"]);
  });

  it("puts the blog's own picks first, in their order, skipping unknown ones", () => {
    expect(slugs(pickRelatedBlogs({ ...blog, relatedSlugs: ["c", "gone", "a"] }, [guide("a"), guide("b"), guide("c")]))).toEqual(["c", "a", "b"]);
  });

  it("then prefers the same region over the same topic", () => {
    expect(slugs(pickRelatedBlogs(blog, [guide("plain"), guide("topic", "t"), guide("region", "x", ["r"])]))).toEqual(["region", "topic", "plain"]);
  });
});
