import { describe, expect, it } from "vitest";

import type { WebAboutTeamRow, WebSitePageRow } from "@/lib/supabase/database.types";

import { toAboutPage, toAboutTeam } from "./aboutPageRows";

const BASE = "https://photos.example/photos";

const ROW: WebSitePageRow = {
  slug: "about",
  eyebrow: " About Travel To Nepal ",
  heading: "A Nepali team",
  intro: "We are a licensed trekking company.",
  seo_title: "About us",
  seo_description: "Meet the team.",
  seo_keyword: "Nepali trekking company",
  content: {
    trekkersGuided: "1,200+",
    storyHeading: "Born in the mountains",
    storyTeaser: "Short story.",
    story: ["First paragraph.", "  ", "Second paragraph."],
    quote: "Like family.",
    promisesHeading: "What to expect",
    teamIntro: "Local guides.",
    milestones: [
      { year: "2015", title: "Founded", text: "In Kathmandu." },
      { year: "", title: "", text: "No title: left out." },
      { year: "Today", title: "One team", text: "" },
    ],
    promises: [
      { icon: "price_check", title: "Clear prices", text: "No surprises." },
      { icon: "not-an-icon", title: "Safety", text: "Checks every day." },
      "broken",
    ],
  },
  updated_at: "2026-10-26T08:00:00Z",
  cover_id: null,
  cover_width: null,
  cover_height: null,
  cover_variant_widths: null,
  cover_placeholder: null,
  cover_place: null,
  founder_name: "Sujan Sherpa",
  founder_role: "Founder",
  founder_photo_id: "f0000000-0000-4000-8000-000000000001",
  founder_photo_variant_widths: [400, 800],
  founder_photo_placeholder: null,
  story_photos: [
    { id: "p1", width: 1600, height: 1200, variant_widths: [400, 800], placeholder: null, place: "Kyanjin Gompa" },
    { id: "p2", width: 1600, height: 1200, variant_widths: [], placeholder: null, place: null },
  ],
};

describe("toAboutPage", () => {
  const about = toAboutPage(ROW, BASE);

  it("reads the top and Google result, trimmed", () => {
    expect(about.top).toMatchObject({ eyebrow: "About Travel To Nepal", heading: "A Nepali team", seo: { keyword: "Nepali trekking company" } });
    expect(about.top.cover).toBeUndefined();
  });

  it("reads the story saved as paragraphs (before rich text) as paragraphs, and keeps photos that have sizes", () => {
    expect(about.story.body.content.map((block) => (block.type === "paragraph" ? block.content?.[0] : null))).toEqual([
      { type: "text", text: "First paragraph." },
      { type: "text", text: "Second paragraph." },
    ]);
    expect(about.story.photos).toHaveLength(1);
    expect(about.story.photos[0]).toMatchObject({ src: `${BASE}/p1`, alt: expect.stringContaining("Kyanjin Gompa") });
  });

  it("takes the founder's first name and photo from the author", () => {
    expect(about.founder).toMatchObject({ name: "Sujan Sherpa", shortName: "Sujan", role: "Founder" });
    expect(about.founder?.photo?.src).toBe(`${BASE}/f0000000-0000-4000-8000-000000000001`);
  });

  it("reads the founder's story as rich text, and the section headings", () => {
    const storyText = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "In his own words." }] }] };
    expect(toAboutPage({ ...ROW, content: { ...(ROW.content as object), storyText } }, BASE).story.body).toEqual(storyText);
    expect(about.headings).toMatchObject({ promises: { title: "What to expect", text: "" }, team: { title: "", text: "Local guides." } });
  });

  it("has no founder until one is picked", () => {
    expect(toAboutPage({ ...ROW, founder_name: null, founder_role: null }, BASE).founder).toBeUndefined();
  });

  it("leaves out milestones and promises without a title, and replaces an unknown icon", () => {
    expect(about.milestones.map((milestone) => milestone.title)).toEqual(["Founded", "One team"]);
    expect(about.milestones[0]).toMatchObject({ icon: "flag", tone: "saffron" });
    expect(about.promises.map((promise) => [promise.title, promise.icon])).toEqual([
      ["Clear prices", "price_check"],
      ["Safety", "verified"],
    ]);
  });

  it("survives content that is not what it should be", () => {
    const empty = toAboutPage({ ...ROW, content: "nonsense", story_photos: null }, BASE);
    expect(empty).toMatchObject({ trekkersGuided: "", milestones: [], promises: [], story: { photos: [] } });
    expect(empty.story.body).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
  });
});

const member = (overrides: Partial<WebAboutTeamRow>): WebAboutTeamRow => ({
  team_group: "guides",
  id: "id",
  name: "Name",
  role: "Guide",
  place: "Briddim, Rasuwa",
  languages: ["English"],
  sort_group: 1,
  years_guiding: 5,
  cover_id: null,
  cover_width: null,
  cover_height: null,
  cover_variant_widths: null,
  cover_placeholder: null,
  cover_place: null,
  ...overrides,
});

describe("toAboutTeam", () => {
  it("puts the office first, then the most experienced guides", () => {
    const team = toAboutTeam(
      [
        member({ id: "junior", name: "Junior", years_guiding: 3 }),
        member({ id: "office", name: "Office", team_group: "office", sort_group: 0, years_guiding: 0, languages: [] }),
        member({ id: "senior", name: "Senior", years_guiding: 20 }),
      ],
      BASE,
    );
    expect(team.map((person) => person.id)).toEqual(["office", "senior", "junior"]);
    expect(team[0]?.group).toBe("office");
  });
});
