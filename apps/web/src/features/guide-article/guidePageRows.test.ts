import { describe, expect, it } from "vitest";

import type { TrekSummary } from "@/features/treks/types";
import type { WebTravelGuidePageRow } from "@/lib/supabase/database.types";

import { articleToc } from "./guideArticles";
import { toGuideArticle } from "./guidePageRows";

const BASE = "https://photos.example/photos";
const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
const photo = (id: string, place = "") => ({ cover_id: id, cover_width: 800, cover_height: 600, cover_variant_widths: [400, 800], cover_placeholder: "", cover_place: place });
const section = (type: string, content: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) => ({
  type,
  settings: {},
  content,
  trek_slug: null,
  trek_slugs: [],
  guides: [],
  photos: [],
  days: [],
  ...extra,
});

const trek = (slug: string): TrekSummary => ({
  slug,
  name: `${slug} trek`,
  region: "Langtang",
  regionSlug: "langtang",
  summary: "",
  days: 10,
  maxAltitudeM: 4773,
  difficulty: "Moderate",
  seasonLabel: "Mar–May, Oct–Nov",
  seasons: ["spring", "autumn"],
  tags: ["classic"],
  isPopular: true,
  hasFixedDates: false,
  hasPage: true,
});

const page = (overrides: Partial<WebTravelGuidePageRow> = {}): WebTravelGuidePageRow => ({
  id: "a1",
  slug: "best-time-to-trek-langtang",
  locale: "en",
  title: "Best time to trek Langtang",
  intro: "What each month is like.",
  highlight_tag: "Best: Oct–Nov",
  updated_line: "Updated for the 2026/2027 season",
  facts: [{ icon: "wb_sunny", label: "Best months", value: "Oct–Nov" }, { icon: "nope", label: "Highest", value: "4,773 m" }, { label: "" }],
  seo_title: "",
  seo_description: "",
  published_on: "2026-10-25",
  updated_on: null,
  topic: "best-time",
  month_ratings: ["avoid", "avoid", "best", "best", "best", "avoid", "avoid", "avoid", "possible", "best", "best", "possible"],
  month_notes: Array.from({ length: 12 }, (_, index) => ({ onTheTrail: `Month ${index + 1}`, crowds: index === 9 ? "busiest" : "low" })),
  cover_alt: "Kyanjin Gompa",
  ...photo("cover"),
  main_trek_slug: "langtang-valley",
  photo_trek_slug: null,
  author: { kind: "office", name: "Anita Shrestha", job_title: "Head of trip planning", bio: "Plans our treks.", photo: null },
  checker: { name: "Nima Lama", role: "Culture specialist", photo: photo("nima") },
  related_slugs: ["langtang-permits-and-costs"],
  region_slugs: ["langtang"],
  read_minutes: 6,
  sections: [
    section("quick", { body: doc("October and November.") }),
    section("text", { heading: "Autumn: the clearest views", tocLabel: "Autumn", body: doc("Dry and clear.") }),
    section("text", { heading: "Autumn: the clearest views", body: doc("Again.") }),
    section("trek", {}, { trek_slug: "langtang-valley" }),
    section("trek", {}, { trek_slug: "not-published" }),
    section("months", { heading: "Month by month" }, { settings: { view: "table" } }),
    section("tip", { text: "Start early." }, { guides: [{ name: "Pasang Tamang", role: "Senior trek leader", quote: "", photo: null }] }),
    section("tip", { text: "No guide here." }),
    section("compare", {}, { trek_slugs: ["langtang-valley", "not-published"] }),
    section("image", { caption: "Kyanjin", alt: "Prayer wheels" }, { photos: [photo("p1", "Kyanjin Gompa")] }),
    section("video", { title: "A video" }, { settings: { youtubeId: "dQw4w9WgXcQ" } }),
    section("faq", { items: [{ question: "When?", answer: doc("Autumn.") }, { question: "Empty?", answer: { type: "doc", content: [] } }] }),
    section("cta", { heading: "Plan it", buttonText: "Ask", message: "Hello!" }),
    "not a section",
  ],
  ...overrides,
});

const treks = [trek("langtang-valley")];

describe("toGuideArticle", () => {
  const article = toGuideArticle({ page: page(), treks }, BASE);

  it("maps the guide's top, author and fact-checker", () => {
    expect(article).toMatchObject({
      title: "Best time to trek Langtang",
      highlightTag: "Best: Oct–Nov",
      trek: { slug: "langtang-valley" },
      author: { name: "Anita Shrestha", role: "Head of trip planning", isVerified: true },
      checker: { name: "Nima Lama", role: "Culture specialist", photo: { src: `${BASE}/nima`, alt: "Nima Lama" } },
      seo: { title: "Best time to trek Langtang", description: "What each month is like." },
    });
    expect(article?.facts).toEqual([
      { icon: "wb_sunny", tone: "green", label: "Best months", value: "Oct–Nov" },
      { icon: "wb_sunny", tone: "green", label: "Highest", value: "4,773 m" },
    ]);
    expect(article?.months?.notes[9]).toEqual({ onTheTrail: "Month 10", crowds: "Busiest" });
  });

  it("keeps the sections that can show, in order, and drops the rest", () => {
    expect(article?.blocks.map((block) => block.type)).toEqual(["quick", "text", "text", "trek", "months", "tip", "image", "cta"]);
    expect(article?.faqs.map((faq) => faq.question)).toEqual(["When?"]);
  });

  it("gives every headed section its own anchor for the contents list", () => {
    expect(articleToc(article!)).toEqual([
      { id: "quick-answer", label: "Quick answer" },
      { id: "autumn-the-clearest-views", label: "Autumn" },
      { id: "autumn-the-clearest-views-2", label: "Autumn: the clearest views" },
      { id: "faq", label: "FAQ" },
    ]);
  });

  it("marks a guest writer as not verified, and has no page without a cover photo", () => {
    const guest = toGuideArticle({ page: page({ author: { kind: "guest", name: "Tom Fletcher", job_title: "", bio: "", photo: null } }), treks }, BASE);
    expect(guest?.author.isVerified).toBe(false);
    expect(toGuideArticle({ page: page({ cover_id: null }), treks }, BASE)).toBeUndefined();
  });

  it("shows no months without 12 ratings, so a months section is left out", () => {
    const noMonths = toGuideArticle({ page: page({ month_ratings: null }), treks }, BASE);
    expect(noMonths?.months).toBeUndefined();
    expect(noMonths?.blocks.some((block) => block.type === "months")).toBe(false);
  });
});
