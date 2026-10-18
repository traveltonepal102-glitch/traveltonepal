import { describe, expect, it } from "vitest";

import type { TravelGuide } from "@/features/guides/types";

import { pickRelatedGuides } from "./related";

const guide = (slug: string, publishedOn: string, extra: Partial<TravelGuide> = {}): TravelGuide => ({
  slug,
  title: slug,
  shortTitle: slug,
  excerpt: "",
  topic: "planning",
  regionSlugs: [],
  image: { src: "/x.jpg", alt: "" },
  publishedOn,
  readMinutes: 5,
  author: "Author",
  ...extra,
});

const GUIDES = [
  guide("article", "2026-05-01", { topic: "best-time", regionSlugs: ["langtang"] }),
  guide("same-region", "2026-01-01", { regionSlugs: ["langtang"] }),
  guide("same-topic", "2026-02-01", { topic: "best-time" }),
  guide("newest-other", "2026-04-01"),
  guide("older-other", "2026-03-01"),
];
const ARTICLE = { slug: "article", topic: "best-time" as const, regionSlugs: ["langtang"] };

describe("pickRelatedGuides", () => {
  it("fills with the same region, then the same topic, then the newest", () => {
    expect(pickRelatedGuides(ARTICLE, GUIDES).map((g) => g.slug)).toEqual(["same-region", "same-topic", "newest-other"]);
  });

  it("puts the article's own picks first, in their order, and skips unknown ones", () => {
    const picks = pickRelatedGuides({ ...ARTICLE, relatedSlugs: ["older-other", "missing", "newest-other"] }, GUIDES);
    expect(picks.map((g) => g.slug)).toEqual(["older-other", "newest-other", "same-region"]);
  });

  it("never lists the article itself", () => {
    const picks = pickRelatedGuides({ ...ARTICLE, relatedSlugs: ["article"] }, GUIDES, 10);
    expect(picks.map((g) => g.slug)).not.toContain("article");
    expect(picks).toHaveLength(4);
  });
});
