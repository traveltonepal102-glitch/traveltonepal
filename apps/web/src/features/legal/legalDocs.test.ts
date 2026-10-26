import { describe, expect, it } from "vitest";

import { SITE_SETTINGS } from "@/features/site-settings/siteSettings.testData";

import { COOKIES } from "./content/cookies";
import { impressumDoc } from "./content/impressum";
import { privacyDoc } from "./content/privacy";
import { termsDoc } from "./content/terms";

const LEGAL_DOCS = [termsDoc(SITE_SETTINGS), privacyDoc(SITE_SETTINGS), impressumDoc(SITE_SETTINGS), COOKIES];

describe("legal documents", () => {
  it.each(LEGAL_DOCS)("$slug has unique section anchors and well-formed tables", (doc) => {
    const ids = doc.sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of doc.sections) {
      expect(section.paragraphs?.length || section.list?.length || section.table).toBeTruthy();
      for (const row of section.table?.rows ?? []) expect(row).toHaveLength(section.table?.head.length ?? 0);
    }
  });

  it("does not promise tools the site does not use", () => {
    const text = JSON.stringify(LEGAL_DOCS).toLowerCase();
    expect(text).not.toContain("youtube");
    expect(text).not.toContain("click counts");
  });

  it("fills in the company and its registers from Site settings, leaving out numbers not typed in", () => {
    const impressum = impressumDoc(SITE_SETTINGS);
    expect(impressum.sections.find((section) => section.id === "provider")?.paragraphs).toEqual(["Travel To Nepal Pvt. Ltd.", "Thamel, Kathmandu, Nepal"]);
    expect(impressum.sections.find((section) => section.id === "registration")?.table?.rows).toEqual([
      ["Department of Tourism, trekking agency registration", "1234/079"],
      ["TAAN membership", "2001"],
    ]);
    expect(termsDoc(SITE_SETTINGS).sections[0]?.paragraphs?.[0]).toContain("Travel To Nepal Pvt. Ltd., Thamel, Kathmandu, Nepal, registered with the Department of Tourism under no. 1234/079");
  });

  it("shows a visible gap, not an invented name, while the legal name is missing", () => {
    const settings = { ...SITE_SETTINGS, company: { ...SITE_SETTINGS.company, legalName: "", tourismRegistration: "" } };
    expect(termsDoc(settings).sections[0]?.paragraphs?.[0]).toBe('These conditions apply to treks organised by [COMPANY LEGAL NAME], Thamel, Kathmandu, Nepal ("we", "us").');
  });
});
