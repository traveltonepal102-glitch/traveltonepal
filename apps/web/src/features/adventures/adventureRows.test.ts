import { describe, expect, it } from "vitest";

import type { WebAdventureRow, WebAdventureSectionRow } from "@/lib/supabase/database.types";

import { toAdventuresSection } from "./adventureRows";

const PHOTOS = "https://photos.example.com";

const section = (overrides: Partial<WebAdventureSectionRow> = {}): WebAdventureSectionRow => ({
  eyebrow: " Beyond the trekking trail ",
  heading: "Tell us your dream Nepal adventure.",
  intro: "Some of Nepal's best experiences aren't online.",
  ask_title: "Something else in mind?",
  ask_text: "Tell us.",
  steps_title: "How it works",
  steps: [
    { title: "Tell us your idea", text: "Send a message." },
    { title: "We check what's possible", text: "We talk to local guides." },
    { title: "We plan it around you", text: "We adjust until it fits." },
  ],
  note: "",
  ...overrides,
});

const adventure = (overrides: Partial<WebAdventureRow> = {}): WebAdventureRow => ({
  id: "a1",
  title: "Rock climbing",
  tag: "Near Kathmandu · Oct–May",
  summary: " Climb limestone crags. ",
  photo_alt: "A climber on a limestone rock face",
  position: 1,
  cover_id: "p1",
  cover_width: 1600,
  cover_height: 1067,
  cover_variant_widths: [480, 960],
  cover_placeholder: null,
  cover_place: null,
  ...overrides,
});

describe("toAdventuresSection", () => {
  it("is null without the section's row", () => {
    expect(toAdventuresSection(null, [adventure()], PHOTOS)).toBeNull();
  });

  it("gives the section's words trimmed, with its steps", () => {
    const result = toAdventuresSection(section(), [], PHOTOS);
    expect(result?.eyebrow).toBe("Beyond the trekking trail");
    expect(result?.steps.map((step) => step.title)).toEqual(["Tell us your idea", "We check what's possible", "We plan it around you"]);
    expect(result?.adventures).toEqual([]);
  });

  it("shows a card with its photo, leaving out a blank tag", () => {
    const [card] = toAdventuresSection(section(), [adventure({ tag: " " })], PHOTOS)?.adventures ?? [];
    expect(card).toEqual({
      id: "a1",
      title: "Rock climbing",
      tag: undefined,
      summary: "Climb limestone crags.",
      photo: { src: `${PHOTOS}/p1`, alt: "A climber on a limestone rock face", variantWidths: [480, 960], placeholder: undefined },
    });
  });

  it("describes the photo by the title when no description is saved", () => {
    const [card] = toAdventuresSection(section(), [adventure({ photo_alt: "" })], PHOTOS)?.adventures ?? [];
    expect(card?.photo.alt).toBe("Rock climbing");
  });

  it("orders the cards by position, then title", () => {
    const rows = [adventure({ id: "c", title: "Rafting", position: 2 }), adventure({ id: "b", title: "Bird watching", position: 1 }), adventure({ id: "a", title: "Abseiling", position: 1 })];
    expect(toAdventuresSection(section(), rows, PHOTOS)?.adventures.map((card) => card.id)).toEqual(["a", "b", "c"]);
  });

  it("leaves out a card whose photo has no sizes", () => {
    expect(toAdventuresSection(section(), [adventure({ cover_variant_widths: [] })], PHOTOS)?.adventures).toEqual([]);
  });

  it("reads the steps leniently: untitled steps and unreadable data are dropped", () => {
    expect(toAdventuresSection(section({ steps: [{ title: " ", text: "x" }, { title: "Plan", text: 3 }] }), [], PHOTOS)?.steps).toEqual([{ title: "Plan", text: "" }]);
    expect(toAdventuresSection(section({ steps: "nope" }), [], PHOTOS)?.steps).toEqual([]);
  });
});
