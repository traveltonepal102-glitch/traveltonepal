import { describe, expect, it } from "vitest";

import { LEGAL_DOCS } from "./legalDocs";

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
});
