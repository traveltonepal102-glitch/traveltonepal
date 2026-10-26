import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { legalWordsChanged } from "../lib/pageContent";
import { legalPagesSchema, readLegalPagesForm } from "./legalPagesSchema";

const body = (heading: string, text: string) =>
  JSON.stringify({
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: heading }] },
      { type: "paragraph", content: [{ type: "text", text }] },
      {
        type: "table",
        content: [
          { type: "tableRow", content: [{ type: "tableHeader", attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [{ type: "paragraph", content: [{ type: "text", text: "When" }] }] }] },
          { type: "tableRow", content: [{ type: "tableCell", attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [{ type: "paragraph", content: [{ type: "text", text: "30 days before" }] }] }] },
        ],
      },
    ],
  });

const page = (slug: string, extra: Record<string, string> = {}): [string, string][] => {
  const fields: Record<string, string> = { heading: "Terms", intro: "Read before you book.", body: body("Who we are", "{company}, {address}."), lastUpdated: "2026-10-20", autoDate: "on", ...extra };
  return Object.entries(fields).map(([field, value]) => [`${slug}.${field}`, value]);
};

const form = (fields: [string, string][]) => {
  const data = new FormData();
  for (const [name, value] of fields) data.append(name, value);
  return data;
};

const all = (extra: Partial<Record<string, Record<string, string>>> = {}) =>
  form(["terms", "privacy", "impressum", "cookies"].flatMap((slug) => page(slug, extra[slug])));

describe("legalPagesSchema", () => {
  it("reads all four pages with their text, tables and switches", () => {
    const result = legalPagesSchema.safeParse(readLegalPagesForm(all({ impressum: { lawyerChecked: "on" } })));
    expect(result.success).toBe(true);
    expect(result.data?.impressum).toMatchObject({ heading: "Terms", lawyerChecked: true, autoDate: true, lastUpdated: "2026-10-20" });
    expect(result.data?.terms.lawyerChecked).toBe(false);
    // Cell sizes are dropped; the table itself is kept.
    expect(JSON.stringify(result.data?.terms.body)).not.toContain("colwidth");
    expect(result.data?.terms.body.content[2]).toMatchObject({ type: "table" });
  });

  it("refuses unsafe links and empty text, and puts the error on its page", () => {
    const unsafe = JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Pay here", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] });
    const result = legalPagesSchema.safeParse(readLegalPagesForm(all({ privacy: { body: unsafe }, cookies: { body: JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }) } })));
    expect(Object.keys(toFieldErrors(result.error!)).sort()).toEqual(["cookies.body", "privacy.body"]);
  });

  it("needs a title and a real date", () => {
    const result = legalPagesSchema.safeParse(readLegalPagesForm(all({ terms: { heading: " ", lastUpdated: "yesterday" } })));
    expect(Object.keys(toFieldErrors(result.error!)).sort()).toEqual(["terms.heading", "terms.lastUpdated"]);
  });
});

describe("legalWordsChanged", () => {
  const values = legalPagesSchema.parse(readLegalPagesForm(all())).terms;

  it("sees a change in the title, intro or text, but not in the switches", () => {
    expect(legalWordsChanged(values, { ...values, lawyerChecked: true, autoDate: false })).toBe(false);
    expect(legalWordsChanged(values, { ...values, intro: "New intro." })).toBe(true);
    expect(legalWordsChanged(values, { ...values, body: { type: "doc", content: [{ type: "paragraph" }] } })).toBe(true);
  });
});
