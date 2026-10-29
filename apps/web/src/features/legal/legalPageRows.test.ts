import { legalTextToPlainText } from "@ttn/ui/lib/legalText";
import type { LegalTextDoc } from "@ttn/ui/lib/legalText";
import { describe, expect, it } from "vitest";

import { SITE_SETTINGS } from "@/features/site-settings/siteSettings.testData";
import type { WebSitePageRow } from "@/lib/supabase/database.types";

import { toLegalDoc } from "./legalPageRows";

const text = (value: string) => [{ type: "text" as const, text: value }];
const p = (value: string) => ({ type: "paragraph" as const, content: text(value) });
const h2 = (value: string) => ({ type: "heading" as const, attrs: { level: 2 as const }, content: text(value) });

const body: LegalTextDoc = {
  type: "doc",
  content: [
    p("Read this first."),
    h2("Who we are"),
    p("{company}, {address}. Registered under no. {registration}. {unknown} stays."),
    h2("Registration"),
    p("{registers}"),
    h2("What we use"),
    p("{cookieTable}"),
    h2("Who we are"),
    { type: "bulletList", content: [{ type: "listItem", content: [p("Email: {email}")] }] },
  ],
};

const row = (content: unknown): WebSitePageRow => ({
  slug: "impressum",
  eyebrow: "",
  heading: " Impressum ",
  intro: "Legal notice.",
  seo_title: "",
  seo_description: "",
  seo_keyword: "",
  share_id: null,
  share_variant_widths: null,
  share_place: null,
  content,
  updated_at: "2026-10-26T08:00:00Z",
  cover_id: null,
  cover_width: null,
  cover_height: null,
  cover_variant_widths: null,
  cover_placeholder: null,
  cover_place: null,
  founder_name: null,
  founder_role: null,
  founder_photo_id: null,
  founder_photo_variant_widths: null,
  founder_photo_placeholder: null,
  story_photos: [],
});

describe("toLegalDoc", () => {
  const doc = toLegalDoc("impressum", row({ body, lawyerChecked: false, lastUpdated: "2026-10-26" }), SITE_SETTINGS);
  const sectionText = (index: number) => legalTextToPlainText({ type: "doc", content: doc.sections[index]?.blocks ?? [] });

  it("splits the text at its section headings, with unique anchors", () => {
    expect(doc.title).toBe("Impressum");
    expect(doc.lead).toEqual([p("Read this first.")]);
    expect(doc.sections.map((section) => [section.id, section.heading])).toEqual([
      ["who-we-are", "Who we are"],
      ["registration", "Registration"],
      ["what-we-use", "What we use"],
      ["who-we-are-2", "Who we are"],
    ]);
  });

  it("fills the company details from Site settings, keeping unknown placeholders", () => {
    expect(sectionText(0)).toBe("Travel To Nepal Pvt. Ltd., Thamel, Kathmandu, Nepal. Registered under no. 1234/079. {unknown} stays.");
    expect(sectionText(3)).toBe("Email: hello@example.com");
  });

  it("puts the registers and the cookie list in as tables", () => {
    expect(doc.sections[1]?.blocks[0]).toMatchObject({ type: "table" });
    expect(sectionText(1)).toContain("Department of Tourism, trekking agency registration\t1234/079");
    expect(sectionText(2)).toContain("ttn-consent");
  });

  it("shows a visible gap for a detail not typed in Site settings, and leaves out an empty registers table", () => {
    const empty = { ...SITE_SETTINGS, company: { ...SITE_SETTINGS.company, legalName: "", tourismRegistration: "", taanNumber: "" } };
    const blank = toLegalDoc("impressum", row({ body }), empty);
    expect(legalTextToPlainText({ type: "doc", content: blank.sections[0]?.blocks ?? [] })).toContain("[COMPANY LEGAL NAME], Thamel, Kathmandu, Nepal. Registered under no. [REGISTRATION NUMBER].");
    expect(blank.sections[1]?.blocks).toEqual([]);
  });

  it("writes the last updated day out, and keeps the owner's note until a lawyer checked it", () => {
    expect(doc.updated).toBe("26 October 2026");
    expect(doc.ownerNote).toBeTruthy();
    const checked = toLegalDoc("impressum", row({ body, lawyerChecked: true, lastUpdated: "" }), SITE_SETTINGS);
    expect(checked.ownerNote).toBeUndefined();
    expect(checked.updated).toBe("");
  });

  it("shows nothing rather than unsafe or broken text", () => {
    const unsafe = { type: "doc", content: [h2("Links"), { type: "paragraph", content: [{ type: "text", text: "Click", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] };
    expect(toLegalDoc("terms", row({ body: unsafe }), SITE_SETTINGS).sections).toEqual([]);
    expect(toLegalDoc("terms", row("nonsense"), SITE_SETTINGS)).toMatchObject({ lead: [{ type: "paragraph" }], sections: [], updated: "" });
  });
});
