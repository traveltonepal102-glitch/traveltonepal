import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { storedSection, toStoredSection } from "../services/storedSections";
import type { ArticleSection } from "../types";
import { sectionsField } from "./sectionsSchema";

const ID = "00000000-0000-4000-8000-000000000001";

/** As in the travel guide form, so errors carry their "sections." path. */
const form = z.object({ sections: sectionsField });
const parse = (sections: unknown[]) => form.safeParse({ sections: JSON.stringify(sections) });
const errorsOf = (sections: unknown[]) => {
  const result = parse(sections);
  if (result.success) throw new Error("expected the sections to be rejected");
  return toFieldErrors(result.error);
};

type Table = Extract<ArticleSection, { type: "table" }>;

const table = (patch: Partial<Table> = {}): Table => ({
  id: null,
  type: "table",
  heading: "",
  hasHeader: true,
  hasFooter: false,
  hasRowHeadings: false,
  header: ["Village", "Altitude"],
  rows: [
    ["Lama Hotel", "2,480 m"],
    ["", ""],
  ],
  footer: ["", ""],
  ...patch,
});

describe("table, custom HTML, embed and altitude chart sections", () => {
  it("reads each kind: empty table rows left out, the embed code as its address", () => {
    const result = parse([
      table(),
      { id: null, type: "html", html: " <p>Hello</p> " },
      { id: null, type: "embed", code: '<iframe src="https://www.google.com/maps/d/embed?mid=1AbC" width="640"></iframe>', height: "tall", title: "Route", caption: "" },
      { id: null, type: "altitude", trekId: ID, heading: "" },
    ]);
    expect(result.data?.sections).toMatchObject([
      { type: "table", rows: [["Lama Hotel", "2,480 m"]] },
      { type: "html", html: "<p>Hello</p>" },
      { type: "embed", code: "https://www.google.com/maps/d/embed?mid=1AbC", height: "tall" },
      { type: "altitude", trekId: ID },
    ]);
  });

  it("checks what each kind needs, at the section's number", () => {
    expect(
      errorsOf([
        table({ rows: [["", ""]] }),
        table({ hasFooter: true }),
        table({ rows: [["Lama Hotel"]] }),
        { id: null, type: "html", html: '<p>Map</p><iframe src="https://x.example"></iframe>' },
        { id: null, type: "html", html: '<a href="#" onclick="go()">Go</a>' },
        { id: null, type: "embed", code: "https://example.com/map", height: "medium", title: "", caption: "" },
        { id: null, type: "altitude", trekId: null, heading: "" },
      ]),
    ).toMatchObject({
      "sections.0.rows": "Write in at least one row, or remove this section.",
      "sections.1.footer": "Write the footer row, or switch it off.",
      "sections.2.rows": "The table's rows don't line up. Reload the page and try again.",
      "sections.3.html": "Take out the frame: use an “Embed” section for maps and videos.",
      "sections.4.html": expect.stringContaining("Take out the script"),
      "sections.5.code": "Paste the embed code from Google Maps, Vimeo, Komoot, Wikiloc.",
      "sections.5.title": expect.stringContaining("Write a title"),
      "sections.6.trekId": "Pick the trek.",
    });
  });

  it("saves only the rows that show and cleaned HTML, and reads them back", () => {
    const saved = toStoredSection(table({ header: ["Village", "Altitude"], footer: ["Total", "2"], hasHeader: false, hasFooter: true, hasRowHeadings: true }));
    expect(saved).toMatchObject({ settings: { hasRowHeadings: true }, content: { header: [], footer: ["Total", "2"] } });
    expect(storedSection({ id: "s1", type: "table", trek_id: null, settings: saved.settings }, saved.content)).toMatchObject({
      hasHeader: false,
      hasFooter: true,
      hasRowHeadings: true,
      header: ["", ""],
      footer: ["Total", "2"],
    });

    expect(toStoredSection({ id: null, type: "html", html: '<p style="color: red" onmouseover="x()">Hi</p><b>!</b>' }).content).toEqual({ html: '<p style="color:red">Hi</p><b>!</b>' });

    const embed = toStoredSection({ id: null, type: "embed", code: "https://player.vimeo.com/video/1?dnt=1", height: "short", title: "Trail", caption: "" });
    expect(embed).toMatchObject({ settings: { url: "https://player.vimeo.com/video/1?dnt=1", height: "short" }, content: { title: "Trail" } });
    expect(storedSection({ id: "s2", type: "embed", trek_id: null, settings: embed.settings }, embed.content)).toMatchObject({ code: "https://player.vimeo.com/video/1?dnt=1", height: "short" });

    expect(toStoredSection({ id: null, type: "altitude", trekId: ID, heading: "Nights" })).toMatchObject({ trek_id: ID, content: { heading: "Nights" } });
    expect(storedSection({ id: "s3", type: "altitude", trek_id: ID, settings: {} }, { heading: "Nights" })).toEqual({ id: "s3", type: "altitude", trekId: ID, heading: "Nights" });
  });
});
