import type { WebTravelGuidePageRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import type { HomeTrekCard } from "@/features/home/types";

import { FAQ_ID, QUICK_ANSWER_ID, toBlogArticle, toBlogToc } from "./blogArticleRows";

const doc = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Words" }] }] };
const page = {
  slug: "permits",
  title: " Permits ",
  intro: " The intro ",
  topic: "planning",
  cover_id: "cover",
  cover_width: 1200,
  cover_height: 800,
  cover_variant_widths: [800],
  cover_placeholder: "",
  cover_place: "Samagaun",
  cover_alt: "",
  cover_file_name: null,
  published_on: "2026-10-25",
  updated_on: null,
  read_minutes: 6,
  month_ratings: null,
  month_notes: null,
  facts: [{ icon: "water_drop", label: "Rain", value: "Low" }],
  sections: [
    { type: "quick", content: { body: doc } },
    { type: "text", content: { heading: "Which permits", body: doc } },
    { type: "faq", content: { items: [{ question: "Why?", answer: doc }] } },
    { type: "trek", trek_slug: "unpublished", content: {} },
  ],
  author: null,
  checker: null,
  main_trek_slug: "circuit",
  photo_trek_slug: null,
  related_slugs: [],
  region_slugs: [],
  highlight_tag: "",
  updated_line: "",
  seo_title: "",
  seo_description: "",
  share_id: null,
  help_heading: "",
  help_text: "",
  help_message: "",
  show_sidebar: true,
} as unknown as WebTravelGuidePageRow;

const trek = { slug: "circuit", name: "Circuit" } as HomeTrekCard;
const source = { page, treks: [trek], guides: [], photosBaseUrl: "https://photos", filesBaseUrl: "https://files", isLive: true, isHidden: false };

describe("toBlogArticle", () => {
  it("can't show without a title or a cover", () => {
    expect(toBlogArticle({ ...source, page: { ...page, title: " " } })).toBeUndefined();
    expect(toBlogArticle({ ...source, page: { ...page, cover_id: null } })).toBeUndefined();
  });

  it("reads the words, the trek and the contents list", () => {
    const blog = toBlogArticle(source);
    expect(blog).toMatchObject({ title: "Permits", intro: "The intro", topicLabel: "Planning", publishedLabel: "Oct 25, 2026", trek: { slug: "circuit" }, showSidebar: true });
    expect(blog?.toc.map((link) => link.id)).toEqual([QUICK_ANSWER_ID, "which-permits", FAQ_ID]);
    expect(blog?.faqs.map((faq) => faq.question)).toEqual(["Why?"]);
  });

  it("leaves out a trek block whose trek isn't published", () => {
    expect(toBlogArticle(source)?.blocks.some((block) => block.type === "trek")).toBe(false);
  });

  it("shows each fact in this website's icons", () => {
    expect(toBlogArticle(source)?.facts).toEqual([{ icon: "drop", label: "Rain", value: "Low" }]);
  });

  it("falls back to the team, the page's words and the default help box", () => {
    const blog = toBlogArticle(source);
    expect(blog?.author.isOurTeam).toBe(true);
    expect(blog?.seo).toMatchObject({ title: "Permits", description: "The intro" });
    expect(blog?.helpBox.heading.length).toBeGreaterThan(0);
  });

  it("says 'updated' only for a later date, and keeps a general blog's sidebar off", () => {
    expect(toBlogArticle(source)?.updatedLabel).toBeUndefined();
    expect(toBlogArticle({ ...source, page: { ...page, updated_on: "2026-11-02", show_sidebar: false } })).toMatchObject({ updatedLabel: "Nov 2, 2026", showSidebar: false });
  });
});

describe("toBlogToc", () => {
  it("skips small headings", () => {
    expect(toBlogToc([{ type: "heading", id: "a", level: "h2", heading: "A", tocLabel: "A" }, { type: "heading", id: "b", level: "h3", heading: "B", tocLabel: "B" }])).toEqual([{ id: "a", label: "A" }]);
  });
});
