import type { WebAboutTeamRow, WebSitePageRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toAboutContent, toTeam } from "./aboutRows";

const row = (content: unknown, overrides: Partial<WebSitePageRow> = {}) =>
  ({ heading: "About us", intro: "Who we are", eyebrow: "", seo_title: "", seo_description: "", published_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-05T00:00:00Z", share_id: null, cover_id: null, cover_variant_widths: null, story_photos: [], founder_name: null, founder_role: null, content, ...overrides }) as unknown as WebSitePageRow;

describe("the About page", () => {
  it("still shows what it has when the content is half filled or broken", () => {
    expect(toAboutContent(row({ listen: { heading: "We listen first" } }), "https://photos").listen.heading).toBe("We listen first");
    expect(toAboutContent(row("broken"), "https://photos").honest.heading).toBe("");
  });

  it("falls back to the page's own words for Google", () => {
    expect(toAboutContent(row({}), "https://photos").top.seo).toMatchObject({ title: "About us", description: "Who we are" });
  });

  it("has the founder only with a name, and a stat only with its label", () => {
    expect(toAboutContent(row({}), "https://photos").founder).toBeUndefined();
    expect(toAboutContent(row({}, { founder_name: " Sandip ", founder_role: "Founder" }), "https://photos").founder).toEqual({ name: "Sandip", role: "Founder" });
    expect(toAboutContent(row({ statValue: "All" }), "https://photos").stat).toBeUndefined();
  });

  it("splits typed text into paragraphs at the empty lines", () => {
    expect(toAboutContent(row({ voiceHeading: "Our voice", voiceText: "One.\n\nTwo." }), "https://photos").story.voice.paragraphs).toEqual(["One.", "Two."]);
  });
});

describe("the team", () => {
  const person = (id: string, team_group: "office" | "guides", years = 0) => ({ id, name: id, role: "Role", place: "", languages: [], team_group, sort_group: team_group === "office" ? 0 : 1, years_guiding: years, cover_id: null, cover_variant_widths: null }) as unknown as WebAboutTeamRow;

  it("keeps the office and only the guides on this website's treks, the most experienced first", () => {
    const rows = [person("everest-guide", "guides", 30), person("manaslu-guide", "guides", 5), person("senior-guide", "guides", 20), person("office", "office")];
    expect(toTeam(rows, new Set(["manaslu-guide", "senior-guide"]), "https://photos").map((member) => member.id)).toEqual(["office", "senior-guide", "manaslu-guide"]);
  });
});
