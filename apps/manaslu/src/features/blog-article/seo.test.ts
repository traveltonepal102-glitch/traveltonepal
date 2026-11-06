import { describe, expect, it } from "vitest";

import { blogJsonLd, blogMetadata } from "./seo";
import type { BlogArticle } from "./types";

const doc = { type: "doc" as const, content: [{ type: "paragraph" as const, content: [{ type: "text" as const, text: "An answer" }] }] };
const dates = { published: "2026-10-25", modified: "2026-11-02" };
const blog = {
  slug: "permits",
  title: "Permits",
  image: { src: "https://photos/cover", alt: "", variantWidths: [1280] },
  author: { name: "Rajan", role: "Permits manager", bio: "", isOurTeam: true },
  faqs: [{ question: "Why?", body: doc }],
  seo: { title: "Permits for 2026", description: "All three permits", shareImageBase: "https://photos/share.jpg", isLive: true, dates },
  isHidden: false,
} as unknown as BlogArticle;

describe("blogMetadata", () => {
  it("shows the typed title exactly, with its own address and dates", () => {
    const metadata = blogMetadata(blog);
    expect(metadata.title).toEqual({ absolute: "Permits for 2026" });
    expect(metadata.alternates?.canonical).toBe("/permits");
    expect(metadata.openGraph).toMatchObject({ type: "article", publishedTime: dates.published, modifiedTime: dates.modified });
    expect(metadata.robots).toBeUndefined();
  });

  it("keeps a hidden blog out of Google but follows its links", () => {
    expect(blogMetadata({ ...blog, isHidden: true }).robots).toEqual({ index: false, follow: true });
  });

  it("names the page the Google card points to", () => {
    const metadata = blogMetadata({ ...blog, canonicalPath: "/other" });
    expect(metadata.alternates?.canonical).toBe("/other");
    expect(metadata.openGraph?.url).toBe("/other");
  });

  it("lists nothing until the website is live", () => {
    expect(blogMetadata({ ...blog, seo: { ...blog.seo, isLive: false } }).robots).toEqual({ index: false, follow: false });
  });
});

describe("blogJsonLd", () => {
  const types = (data: ReturnType<typeof blogJsonLd>) => data["@graph"].map((node) => node["@type"]);

  it("is a BlogPosting with its dates, author and breadcrumb ending at the blog", () => {
    const data = blogJsonLd(blog);
    expect(types(data)).toEqual(["BlogPosting", "BreadcrumbList", "FAQPage"]);
    expect(data["@graph"][0]).toMatchObject({ headline: "Permits", datePublished: dates.published, dateModified: dates.modified, author: { name: "Rajan", jobTitle: "Permits manager" } });
    expect(JSON.stringify(data["@graph"][1])).toContain('"position":3,"name":"Permits"');
  });

  it("answers each question in plain text, and leaves the questions out without any", () => {
    expect(JSON.stringify(blogJsonLd(blog))).toContain('"text":"An answer"');
    expect(types(blogJsonLd({ ...blog, faqs: [] }))).toEqual(["BlogPosting", "BreadcrumbList"]);
  });
});
