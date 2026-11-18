import { GUIDE_FILE_FORMATS, guideFileFormatOf } from "@ttn/config/guideFiles";
import type { GuideFileFormat } from "@ttn/config/guideFiles";
import { describe, expect, it } from "vitest";

import { isGuideFileOf } from "./guideFileChecks";

const formatOf = (extension: string): GuideFileFormat => {
  const format = guideFileFormatOf(`file.${extension}`);
  if (!format) throw new Error(`no format .${extension}`);
  return format;
};
const check = (extension: string, bytes: Buffer | string | number[]) =>
  isGuideFileOf(formatOf(extension), Buffer.isBuffer(bytes) ? bytes : typeof bytes === "string" ? Buffer.from(bytes, "latin1") : Buffer.from(bytes));

/** A ZIP's first entry header, followed by `rest` (entry names are plain text in a ZIP). */
const zip = (rest: string) => Buffer.concat([Buffer.from("PK\x03\x04", "latin1"), Buffer.alloc(26), Buffer.from(rest, "latin1")]);
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0];
const riff = (kind: string) => Buffer.concat([Buffer.from("RIFF"), Buffer.from([0x24, 0, 0, 0]), Buffer.from(kind)]);

/** One real-looking start of a file for each format. */
const SAMPLES: Record<string, Buffer | string | number[]> = {
  pdf: "%PDF-1.7\n",
  doc: OLE,
  xls: OLE,
  ppt: OLE,
  docx: zip("[Content_Types].xml ... word/document.xml"),
  xlsx: zip("[Content_Types].xml ... xl/workbook.xml"),
  pptx: zip("[Content_Types].xml ... ppt/presentation.xml"),
  ods: Buffer.concat([Buffer.from("PK\x03\x04", "latin1"), Buffer.alloc(26), Buffer.from("mimetypeapplication/vnd.oasis.opendocument.spreadsheet")]),
  odp: Buffer.concat([Buffer.from("PK\x03\x04", "latin1"), Buffer.alloc(26), Buffer.from("mimetypeapplication/vnd.oasis.opendocument.presentation")]),
  txt: Buffer.from("Packliste für den Trek\n- Schlafsack\n"),
  csv: Buffer.from("Gruppe,Preis\n1,1450\n2,1290\n"),
  rtf: "{\\rtf1\\ansi Packing list}",
  jpg: [0xff, 0xd8, 0xff, 0xe0, 0, 0x10],
  jpeg: [0xff, 0xd8, 0xff, 0xe1, 0, 0x10],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0],
  webp: riff("WEBPVP8 "),
  gif: "GIF89a\x01\x00\x01\x00",
  svg: '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>',
  mp3: "ID3\x04\x00\x00",
  wav: riff("WAVEfmt "),
  m4a: Buffer.concat([Buffer.from([0, 0, 0, 0x20]), Buffer.from("ftypM4A ")]),
  ogg: "OggS\x00\x02",
  zip: zip("packing-list.pdf"),
  rar: "Rar!\x1a\x07\x01\x00",
  "7z": [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c, 0, 4],
};

describe("guide file checks", () => {
  it("knows every format the guides take by its content", () => {
    expect(Object.keys(SAMPLES).sort()).toEqual(GUIDE_FILE_FORMATS.map((format) => format.extension).sort());
    for (const [extension, bytes] of Object.entries(SAMPLES)) expect(check(extension, bytes), extension).toBe(true);
  });

  it("refuses a file renamed to another ending", () => {
    expect(check("pdf", SAMPLES.png)).toBe(false);
    expect(check("docx", SAMPLES.zip)).toBe(false);
    expect(check("xlsx", SAMPLES.docx)).toBe(false);
    expect(check("ods", SAMPLES.odp)).toBe(false);
    expect(check("jpg", SAMPLES.gif)).toBe(false);
    expect(check("wav", SAMPLES.webp)).toBe(false);
    expect(check("txt", SAMPLES.png)).toBe(false);
    expect(check("mp3", "%PDF-1.7")).toBe(false);
    expect(check("zip", Buffer.alloc(0))).toBe(false);
    expect(check("txt", Buffer.alloc(0))).toBe(false);
  });

  it("refuses an SVG that could run anything once opened", () => {
    const svg = (inside: string) => `<svg xmlns="http://www.w3.org/2000/svg">${inside}</svg>`;
    expect(check("svg", svg("<script>alert(1)</script>"))).toBe(false);
    expect(check("svg", svg('<rect onload="alert(1)"/>'))).toBe(false);
    expect(check("svg", svg('<a href="javascript:alert(1)"><text>x</text></a>'))).toBe(false);
    expect(check("svg", svg("<foreignObject><div/></foreignObject>"))).toBe(false);
    expect(check("svg", '<!DOCTYPE svg [<!ENTITY x "y">]><svg/>')).toBe(false);
    expect(check("svg", "<html><body>not a drawing</body></html>")).toBe(false);
  });

  it("refuses a format with no check of its own", () => {
    expect(isGuideFileOf({ extension: "exe", contentType: "application/octet-stream", label: "EXE", category: "archive", opensInBrowser: false }, Buffer.from("MZ"))).toBe(false);
  });
});
