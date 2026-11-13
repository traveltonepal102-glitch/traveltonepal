import { describe, expect, it } from "vitest";

import { isGpxFile, isPdfFile } from "./trekFileChecks";

const GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Gaia GPS" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><name>Annapurna Base Camp</name><trkseg><trkpt lat="28.5300" lon="83.8780"><ele>4130</ele></trkpt></trkseg></trk>
</gpx>`;

describe("trek file checks", () => {
  it("knows a GPX track by its content: XML with a <gpx> root, with or without a byte-order mark or the XML line", () => {
    expect(isGpxFile(Buffer.from(GPX))).toBe(true);
    expect(isGpxFile(Buffer.from(`﻿${GPX}`))).toBe(true);
    expect(isGpxFile(Buffer.from('<gpx version="1.1"><trk/></gpx>'))).toBe(true);
    expect(isGpxFile(Buffer.from("  \n<?xml version=\"1.0\"?>\n<gpx>\n</gpx>"))).toBe(true);
  });

  it("refuses files that only look like a track: a KML, a web page, a PDF or a renamed binary", () => {
    expect(isGpxFile(Buffer.from('<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document/></kml>'))).toBe(false);
    expect(isGpxFile(Buffer.from("<!doctype html><html><body>gpx</body></html>"))).toBe(false);
    expect(isGpxFile(Buffer.from("%PDF-1.7 <gpx>"))).toBe(false);
    expect(isGpxFile(Buffer.from([0x89, 0x50, 0x4e, 0x47]))).toBe(false);
    expect(isGpxFile(Buffer.alloc(0))).toBe(false);
  });

  it("knows a PDF by its first bytes only", () => {
    expect(isPdfFile(Buffer.from("%PDF-1.7\n%âãÏÓ"))).toBe(true);
    expect(isPdfFile(Buffer.from(GPX))).toBe(false);
    expect(isPdfFile(Buffer.from("map.pdf"))).toBe(false);
  });
});
