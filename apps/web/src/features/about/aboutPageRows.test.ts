import { describe, expect, it } from "vitest";

import type { WebAboutTeamRow, WebSitePageRow } from "@/lib/supabase/database.types";

import { toAboutPage, toAboutTeam } from "./aboutPageRows";

const BASE = "https://photos.example/photos";

const ROW: WebSitePageRow = {
  slug: "about",
  eyebrow: " About Travel To Nepal ",
  heading: "Private treks in Nepal",
  intro: "We are a licensed trekking company.",
  seo_title: "About us",
  seo_description: "Meet the team.",
  seo_keyword: "Nepali trekking company",
  content: {
    trekkersGuided: "50+",
    statValue: "All",
    statLabel: "Guides from their own valleys",
    safetyLead: "All four rest on one rule:",
    safetyText: "your safety comes first.",
    listen: {
      eyebrow: "01 · We listen first",
      heading: "We understand you first.",
      body: "First paragraph.\n\n  \n\nSecond paragraph.",
      cardTitle: "We listen first",
      steps: [{ title: "1. We listen", text: "Open questions." }, { title: "", text: "" }, { title: "3. We suggest", text: "" }],
      questions: ["What made you think of Nepal?", "", 42],
      understand: [{ label: "Your interests", value: "Peaks" }, { label: "", value: "" }],
    },
    honest: { heading: "Honest advice", advice: [{ quote: "Langtang may suit you better.", who: "To a first-timer" }, { quote: "", who: "No quote: left out." }] },
    flexible: { heading: "Flexible", photoCaption: "At 4,980 m in Langtang", stages: [{ title: "Before booking", text: "Compare versions." }] },
    openMind: {
      heading: "An open mind",
      more: "One.\n\nTwo.",
      places: [
        { title: "Ghandruk, Annapurna", text: "A Gurung village." },
        { title: "Kyanjin Gompa", text: "Teahouses." },
        { title: "Phu village", text: "No photo: left out." },
      ],
    },
    safety: { heading: "Your safety", facts: [{ title: "Rescue plan", text: "From Kathmandu." }, { title: "", text: "" }] },
    storyHeading: "Why Sandip started Travel To Nepal",
    storyTeaser: "Short story.",
    storyText: "Born in Tanahun.\n\nThree goals.",
    quote: "It's time for Nepal to have its own voice.",
    founderOrigin: "From Tanahun",
    goals: [{ title: "Fair pay", text: "For the trail team." }],
    voiceEyebrow: "Our voice",
    voiceText: "Para one.\n\nPara two.",
    teamIntro: "Local guides.",
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
  founder_name: "Sandip Kshetri",
  founder_role: "Founder",
  founder_photo_id: "f0000000-0000-4000-8000-000000000001",
  founder_photo_variant_widths: [400, 800],
  founder_photo_placeholder: null,
  story_photos: [
    { id: "founder", width: 955, height: 1000, variant_widths: [400, 800], placeholder: null, place: "Tserko Ri", position: 1 },
    { id: "banner", width: 1210, height: 1260, variant_widths: [400, 800], placeholder: null, place: null, position: 2 },
    { id: "ghandruk", width: 1400, height: 788, variant_widths: [400, 800], placeholder: null, place: "Ghandruk", position: 3 },
    { id: "kyanjin", width: 1400, height: 788, variant_widths: [400, 800], placeholder: null, place: null, position: 4 },
    { id: "no-sizes", width: 1400, height: 788, variant_widths: [], placeholder: null, place: null, position: 5 },
  ],
};

describe("toAboutPage", () => {
  const about = toAboutPage(ROW, BASE);

  it("reads the top, the four numbers' parts and the line under the beliefs, trimmed", () => {
    expect(about.top).toMatchObject({ eyebrow: "About Travel To Nepal", heading: "Private treks in Nepal", seo: { keyword: "Nepali trekking company" } });
    expect(about.trekkersGuided).toBe("50+");
    expect(about.stat).toEqual({ value: "All", label: "Guides from their own valleys" });
    expect(about.safetyLine).toEqual({ lead: "All four rest on one rule:", text: "your safety comes first." });
  });

  it("splits a belief's text into paragraphs and keeps its three steps in their places", () => {
    expect(about.listen.paragraphs).toEqual(["First paragraph.", "Second paragraph."]);
    expect(about.listen.card).toEqual({ title: "We listen first", text: "", link: "" });
    expect(about.listen.steps.map((step) => step.title)).toEqual(["1. We listen", "", "3. We suggest"]);
    expect(about.listen.questions).toEqual(["What made you think of Nepal?"]);
    expect(about.listen.understand).toEqual([{ label: "Your interests", value: "Peaks" }]);
  });

  it("leaves out empty items", () => {
    expect(about.honest.advice).toEqual([{ quote: "Langtang may suit you better.", who: "To a first-timer" }]);
    expect(about.safety.facts).toEqual([{ title: "Rescue plan", text: "From Kathmandu." }]);
  });

  it("puts each photo in its place, described by its caption", () => {
    expect(about.story.photo).toMatchObject({ src: `${BASE}/founder`, alt: "Sandip Kshetri, Founder" });
    expect(about.flexible.photo).toMatchObject({ src: `${BASE}/banner`, alt: "At 4,980 m in Langtang" });
    expect(about.openMind.places.map((place) => [place.title, place.photo.src])).toEqual([
      ["Ghandruk, Annapurna", `${BASE}/ghandruk`],
      ["Kyanjin Gompa", `${BASE}/kyanjin`],
    ]);
    expect(about.openMind.more).toEqual(["One.", "Two."]);
  });

  it("reads the story, its goals and our voice", () => {
    expect(about.story).toMatchObject({ heading: "Why Sandip started Travel To Nepal", origin: "From Tanahun", goals: [{ title: "Fair pay", text: "For the trail team." }] });
    expect(about.story.voice).toEqual({ eyebrow: "Our voice", heading: "", paragraphs: ["Para one.", "Para two."] });
    expect(about.story.body.content).toHaveLength(2);
    expect(about.headings.team).toEqual({ title: "", text: "Local guides." });
  });

  it("takes the founder's first name and photo from the author, and has none until one is picked", () => {
    expect(about.founder).toMatchObject({ name: "Sandip Kshetri", shortName: "Sandip", role: "Founder" });
    expect(about.founder?.photo?.src).toBe(`${BASE}/f0000000-0000-4000-8000-000000000001`);
    expect(toAboutPage({ ...ROW, founder_name: null, founder_role: null }, BASE).founder).toBeUndefined();
  });

  it("keeps the trek pages' promises, replacing an unknown icon", () => {
    expect(about.promises.map((promise) => [promise.title, promise.icon])).toEqual([
      ["Clear prices", "price_check"],
      ["Safety", "verified"],
    ]);
  });

  it("survives content that is not what it should be", () => {
    const empty = toAboutPage({ ...ROW, content: "nonsense", story_photos: null }, BASE);
    expect(empty).toMatchObject({ trekkersGuided: "", stat: undefined, promises: [], listen: { heading: "", paragraphs: [], questions: [] } });
    expect(empty.listen.steps).toHaveLength(3);
    expect(empty.openMind.places).toEqual([]);
    expect(empty.story.photo).toBeUndefined();
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
