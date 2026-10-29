import { toEmbed } from "@ttn/config/embeds";
import { cleanCustomHtml } from "@ttn/ui/lib/customHtml";
import { describe, expect, it } from "vitest";

import type { TrekSummary } from "@/features/treks/types";

import { toBlock } from "./guideBlockRows";
import { readSections } from "./guidePageJson";

const trek: TrekSummary = {
  slug: "langtang-valley",
  name: "Langtang Valley trek",
  region: "Langtang",
  regionSlug: "langtang",
  route: [{ slug: "langtang", name: "Langtang" }],
  summary: "",
  days: 10,
  maxAltitudeM: 4773,
  difficulty: "Moderate",
  seasonLabel: "Mar–May, Oct–Nov",
  seasons: ["spring", "autumn"],
  tags: ["classic"],
  isPopular: true,
  hasPage: true,
};

const CONTEXT = { treks: [trek], title: "Best time to trek Langtang", photosBaseUrl: "https://photos.example", hasMonths: false };

/** One section as web_travel_guide_pages sends it, as a block. */
const blockOf = (type: string, content: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
  const [section] = readSections([{ type, settings: {}, content, trek_slug: null, trek_slugs: [], guides: [], photos: [], days: [], ...extra }]);
  return toBlock(section, CONTEXT);
};

const day = (number: number, place: string, altitude: number | null) => ({
  place,
  title: `Day ${number}`,
  subtitle: "",
  duration: "",
  altitude_m: altitude,
  sleep_altitude_m: null,
  is_high_point: false,
  day_number: number,
  description: null,
});

describe("table sections", () => {
  it("makes every row as wide as the widest, leaving out empty rows and an empty header or footer", () => {
    expect(blockOf("table", { heading: "Walking times", header: ["From", "To", ""], rows: [["Syabrubesi", "Lama Hotel"], ["", ""], ["Lama Hotel", "Langtang", "6 h"]], footer: ["", "", ""] }, { settings: { hasRowHeadings: true } })).toEqual({
      type: "table",
      heading: "Walking times",
      header: ["From", "To", ""],
      rows: [
        ["Syabrubesi", "Lama Hotel", ""],
        ["Lama Hotel", "Langtang", "6 h"],
      ],
      footer: [],
      hasRowHeadings: true,
    });
    expect(blockOf("table", { header: ["A"], rows: [[""]], footer: [] })).toBeUndefined();
  });
});

describe("custom HTML", () => {
  it("cleans the HTML again, and leaves out a section with no words left", () => {
    expect(blockOf("html", { html: '<p onclick="steal()">Hi <a href="javascript:alert(1)">there</a></p><script>alert(1)</script>' })).toEqual({ type: "html", html: "<p>Hi <a>there</a></p>" });
    expect(blockOf("html", { html: "<iframe src=\"https://evil.example\"></iframe><img src=x onerror=alert(1)>" })).toBeUndefined();
  });

  it("keeps formatting, tables, details and allowed styles; outside links open in a new tab", () => {
    expect(cleanCustomHtml('<details open><summary>Rooms</summary><table><tr><td colspan="2">Two beds</td></tr></table></details>')).toBe(
      '<details open><summary>Rooms</summary><table><tr><td colspan="2">Two beds</td></tr></table></details>',
    );
    expect(cleanCustomHtml('<div style="color: #1a4d8f; position: fixed; background-color: url(x)">Note</div>')).toBe('<div style="color:#1a4d8f">Note</div>');
    expect(cleanCustomHtml('<a href="https://example.com" target="_self">Map</a> <a href="/treks" target="_blank">Treks</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Map</a> <a href="/treks">Treks</a>',
    );
  });
});

describe("embeds", () => {
  it("takes the iframe code or a page link of an allowed service, as its embed address", () => {
    expect(toEmbed('<iframe src="https://www.google.com/maps/d/embed?mid=1AbC_d-e&amp;ehbc=2E312F" width="640" height="480"></iframe>')?.url).toBe(
      "https://www.google.com/maps/d/embed?mid=1AbC_d-e&ehbc=2E312F",
    );
    expect(toEmbed("https://www.google.com/maps/d/u/0/viewer?mid=1AbC&ll=27.7%2C85.3&z=10#x")?.url).toBe("https://www.google.com/maps/d/embed?mid=1AbC&ll=27.7%2C85.3&z=10");
    expect(toEmbed("https://vimeo.com/76979871")).toMatchObject({ url: "https://player.vimeo.com/video/76979871?dnt=1", provider: { name: "Vimeo", kind: "video" } });
    expect(toEmbed('<iframe src="https://www.komoot.com/tour/123456/embed?profile=1"></iframe>')?.provider.name).toBe("Komoot");
    expect(toEmbed("https://www.wikiloc.com/wikiloc/embedv2.do?id=987&elevation=on")?.provider.name).toBe("Wikiloc");
  });

  it("refuses other sites, plain http and look-alike addresses", () => {
    for (const pasted of ["https://evil.example/maps/embed", "http://www.google.com/maps/embed?pb=1", "https://www.google.com.evil.example/maps/embed", "https://user@www.google.com/maps/embed", "javascript:alert(1)", ""]) {
      expect(toEmbed(pasted)).toBeNull();
    }
  });

  it("checks the saved address again, with its service's plain details and height", () => {
    expect(blockOf("embed", { title: "", caption: "Our route" }, { settings: { url: "https://www.google.com/maps/d/embed?mid=1AbC", height: "tall" } })).toEqual({
      type: "embed",
      url: "https://www.google.com/maps/d/embed?mid=1AbC",
      service: { name: "Google Maps", company: "Google", kind: "map" },
      height: 600,
      title: "Google Maps",
      caption: "Our route",
    });
    expect(blockOf("embed", { title: "Route" }, { settings: { url: "https://evil.example/embed", height: "short" } })).toBeUndefined();
  });
});

describe("altitude chart sections", () => {
  it("shows a published trek's days that have an altitude, two at least", () => {
    const days = [day(1, "Syabrubesi", 1460), day(2, "Lama Hotel", 2480), day(3, "Rest", null), day(4, "Langtang", 3430)];
    const block = blockOf("altitude", { heading: "How high you sleep" }, { trek_slug: "langtang-valley", days });
    expect(block).toMatchObject({ type: "altitude", heading: "How high you sleep", trek: { slug: "langtang-valley" } });
    expect(block?.type === "altitude" && block.days.map((item) => item.place)).toEqual(["Syabrubesi", "Lama Hotel", "Langtang"]);
    expect(blockOf("altitude", {}, { trek_slug: "langtang-valley", days: days.slice(0, 1) })).toBeUndefined();
    expect(blockOf("altitude", {}, { trek_slug: "not-published", days })).toBeUndefined();
  });
});
