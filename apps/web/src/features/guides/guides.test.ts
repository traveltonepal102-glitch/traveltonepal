import { describe, expect, it } from "vitest";

import { formatGuideCount, formatGuideMonth, formatReadTime, formatTotalReadTime } from "./format";
import { countGuidesByTopic, pickGuideHighlights, pickGuidesBySlug, regionsWithGuides } from "./guideLists";
import type { GuideTopicId } from "./topics";
import { START_HERE_SLUGS, TRAVEL_GUIDES } from "./guides.testData";
import type { TravelGuide } from "./types";

const guide = (slug: string, publishedOn: string, isFeatured?: boolean, topic: GuideTopicId = "planning"): TravelGuide => ({
  slug,
  title: slug,
  shortTitle: slug,
  regionSlugs: [],
  excerpt: "",
  topic,
  image: { src: "/x.jpg", alt: "" },
  publishedOn,
  readMinutes: 5,
  author: "Author",
  isFeatured,
});

describe("guide formatting", () => {
  it("formats the publish month as the same calendar month everywhere", () => {
    expect(formatGuideMonth("2026-10-01")).toBe("Oct 2026");
    expect(formatGuideMonth("2026-09-30")).toBe("Sep 2026");
  });

  it("formats reading times and guide counts", () => {
    expect(formatReadTime(8)).toBe("8 min read");
    expect(formatGuideCount(1)).toBe("1 guide");
    expect(formatGuideCount(4)).toBe("4 guides");
  });

  it("rounds the total reading time to 5 minutes, never below 5", () => {
    expect(formatTotalReadTime(48)).toBe("About 50 minutes in total");
    expect(formatTotalReadTime(46)).toBe("About 45 minutes in total");
    expect(formatTotalReadTime(1)).toBe("About 5 minutes in total");
  });
});

describe("pickGuideHighlights", () => {
  it("features the flagged guide and lists the two newest others", () => {
    const guides = [guide("old", "2026-01-01"), guide("flagged", "2026-02-01", true), guide("new", "2026-05-01"), guide("mid", "2026-03-01")];
    const highlights = pickGuideHighlights(guides);

    expect(highlights?.featured.slug).toBe("flagged");
    expect(highlights?.latest.map((g) => g.slug)).toEqual(["new", "mid"]);
  });

  it("features the newest guide when none is flagged", () => {
    const highlights = pickGuideHighlights([guide("a", "2026-01-01"), guide("b", "2026-04-01")]);

    expect(highlights?.featured.slug).toBe("b");
    expect(highlights?.latest.map((g) => g.slug)).toEqual(["a"]);
  });

  it("returns null when there are no guides", () => {
    expect(pickGuideHighlights([])).toBeNull();
  });
});

describe("countGuidesByTopic", () => {
  it("counts guides per topic, 0 for a topic without guides", () => {
    const count = countGuidesByTopic([guide("a", "2026-01-01"), guide("b", "2026-01-01"), guide("c", "2026-01-01", false, "gear")]);

    expect(count("planning")).toBe(2);
    expect(count("gear")).toBe(1);
    expect(count("health")).toBe(0);
  });
});

describe("pickGuidesBySlug", () => {
  it("keeps the order of the slugs and skips unknown ones", () => {
    const guides = [guide("a", "2026-01-01"), guide("b", "2026-01-01")];

    expect(pickGuidesBySlug(guides, ["b", "missing", "a"]).map((g) => g.slug)).toEqual(["b", "a"]);
  });

  it("finds every guide in the Start here list", () => {
    expect(pickGuidesBySlug(TRAVEL_GUIDES, START_HERE_SLUGS)).toHaveLength(START_HERE_SLUGS.length);
  });
});

describe("regionsWithGuides", () => {
  it("keeps the regions that have a guide, in their order", () => {
    const regions = [{ slug: "everest", name: "Everest" }, { slug: "langtang", name: "Langtang" }, { slug: "manaslu", name: "Manaslu" }];
    const guides = [{ ...guide("a", "2026-01-01"), regionSlugs: ["manaslu", "everest"] }, guide("b", "2026-01-01")];

    expect(regionsWithGuides(guides, regions).map((region) => region.slug)).toEqual(["everest", "manaslu"]);
  });
});
