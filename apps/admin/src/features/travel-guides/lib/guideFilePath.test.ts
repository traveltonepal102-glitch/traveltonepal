import { GUIDE_FILE_PATH } from "@ttn/config/guideFiles";
import { describe, expect, it } from "vitest";

import { guideFilePath } from "./guideFilePath";

const ID = "00000000-0000-4000-8000-000000000001";

describe("guideFilePath", () => {
  it("names the file after the upload, in its own folder, as the website accepts it", () => {
    const path = guideFilePath(ID, "Langtang packing list (2026).PDF", "pdf");
    expect(path).toBe(`guide-files/${ID}/langtang-packing-list-2026.pdf`);
    expect(GUIDE_FILE_PATH.test(path)).toBe(true);
  });

  it("falls back to “download” for a name with no letters or digits, and keeps names short", () => {
    expect(guideFilePath(ID, "—.pdf", "pdf")).toBe(`guide-files/${ID}/download.pdf`);
    const long = guideFilePath(ID, `${"a".repeat(200)}.pdf`, "pdf");
    expect(GUIDE_FILE_PATH.test(long)).toBe(true);
    expect(long.length).toBeLessThan(140);
  });

  it("keeps the checked format's ending, in lower case, for every kind of file", () => {
    expect(guideFilePath(ID, "Trek Prices.XLSX", "xlsx")).toBe(`guide-files/${ID}/trek-prices.xlsx`);
    expect(guideFilePath(ID, "Audio guide.m4a", "m4a")).toBe(`guide-files/${ID}/audio-guide.m4a`);
    expect(GUIDE_FILE_PATH.test(guideFilePath(ID, "maps.7z", "7z"))).toBe(true);
  });

  it("refuses addresses an upload never hands out", () => {
    expect(GUIDE_FILE_PATH.test(`guide-files/${ID}/../secret.pdf`)).toBe(false);
    expect(GUIDE_FILE_PATH.test(`pdf-maps/${ID}.pdf`)).toBe(false);
    expect(GUIDE_FILE_PATH.test(`guide-files/${ID}/notes.html`)).toBe(false);
    expect(GUIDE_FILE_PATH.test(`guide-files/${ID}/setup.exe`)).toBe(false);
    expect(GUIDE_FILE_PATH.test(`guide-files/${ID}/notes.PDF`)).toBe(false);
  });
});
