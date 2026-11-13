import type { WebAdventureRow, WebAdventureSectionRow, WebSitePageRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toHomeAdventures, toHomeCompany } from "./homeCompanyRows";

const about = (overrides: Partial<WebSitePageRow>) => ({ content: {}, founder_name: null, ...overrides }) as unknown as WebSitePageRow;

describe("the company's words on the home page", () => {
  it("reads the story and the promises, and leaves out a promise without a title", () => {
    const company = toHomeCompany(about({ content: { storyTeaser: " Born here. ", promises: [{ title: "Built around you", text: "Your plan" }, { title: "", text: "No title" }] } }), "https://photos");
    expect(company.storyTeaser).toBe("Born here.");
    expect(company.promises).toEqual([{ title: "Built around you", text: "Your plan" }]);
    expect(company.founder).toBeNull();
  });

  it("says nothing when the page has no row", () => {
    expect(toHomeCompany(null, "https://photos")).toEqual({ storyTeaser: "", founder: null, promises: [] });
  });

  it("gives the founder a photo only with its sizes", () => {
    const founder = (widths: number[] | null) => toHomeCompany(about({ founder_name: "Sandip", founder_role: "Founder", founder_photo_id: "abc", founder_photo_variant_widths: widths }), "https://photos").founder;
    expect(founder([400])?.photo?.src).toBe("https://photos/abc");
    expect(founder(null)?.photo).toBeUndefined();
  });
});

describe("the adventure cards", () => {
  it("keeps the admin's order and leaves out a card without a photo", () => {
    const row = (title: string, position: number, cover: string | null) => ({ id: title, title, summary: "", photo_alt: "", position, cover_id: cover, cover_variant_widths: cover ? [400] : null }) as unknown as WebAdventureRow;
    const { cards } = toHomeAdventures(null, [row("Second", 2, "b"), row("No photo", 0, null), row("First", 1, "a")], "https://photos");
    expect(cards.map((card) => card.title)).toEqual(["First", "Second"]);
  });

  it("uses the admin's words, and this design's where they are blank", () => {
    const section = { eyebrow: " ", heading: "Your dream adventure", intro: " Tell us. ", ask_title: "", ask_text: "" } as unknown as WebAdventureSectionRow;
    expect(toHomeAdventures(section, [], "https://photos")).toMatchObject({ eyebrow: "Beyond the trail", heading: "Your dream adventure", intro: "Tell us.", askTitle: "Have your own idea?" });
  });
});
