import { describe, expect, it } from "vitest";

import { EMPTY_RICH_TEXT, isSafeHref, normalizeHref, richTextField, richTextToPlainText } from "./richText";
import type { RichTextDoc } from "./richText";

const paragraph = (text: string, marks?: unknown[]) => ({ type: "paragraph", content: [{ type: "text", text, marks }] });
const doc = (...content: unknown[]) => ({ type: "doc", content });
const field = richTextField(50);

describe("isSafeHref", () => {
  it("allows web, email and our own pages", () => {
    for (const href of ["https://www.nepal.gov.np", "http://example.com/a?b=1", "mailto:info@example.com", "/treks/langtang-valley", "/"]) {
      expect(isSafeHref(href)).toBe(true);
    }
  });

  it("blocks scripts, data, other sites without a scheme and spaces", () => {
    for (const href of ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "data:text/html,x", "//evil.example", "example.com", "https://a b", ""]) {
      expect(isSafeHref(href)).toBe(false);
    }
  });
});

describe("normalizeHref", () => {
  it("adds https:// or mailto: to what people type", () => {
    expect(normalizeHref(" nepal.gov.np/visa ")).toBe("https://nepal.gov.np/visa");
    expect(normalizeHref("info@example.com")).toBe("mailto:info@example.com");
    expect(normalizeHref("/treks/langtang-valley")).toBe("/treks/langtang-valley");
    expect(normalizeHref("https://example.com")).toBe("https://example.com");
  });

  it("keeps a typed scheme, so a script link still fails the safety check", () => {
    expect(isSafeHref(normalizeHref("javascript:alert(1)"))).toBe(false);
  });
});

describe("richTextField", () => {
  it("keeps paragraphs, bold, italic, links and lists", () => {
    const input = doc(
      paragraph("Langtang is close.", [{ type: "bold" }, { type: "link", attrs: { href: "/regions/langtang" } }]),
      { type: "bulletList", content: [{ type: "listItem", content: [paragraph("No flights")] }] },
      { type: "orderedList", content: [{ type: "listItem", content: [paragraph("Drive")] }] },
    );
    expect(field.parse(JSON.stringify(input))).toEqual(input);
  });

  it("drops attributes it doesn't know (target, classes, list start)", () => {
    const input = doc(
      paragraph("Map", [{ type: "link", attrs: { href: "https://maps.google.com", target: "_blank", class: "x" } }]),
      { type: "orderedList", attrs: { start: 3 }, content: [{ type: "listItem", content: [paragraph("Go")] }] },
    );
    const result = field.parse(JSON.stringify(input)) as RichTextDoc;
    expect(result.content[0]).toEqual(paragraph("Map", [{ type: "link", attrs: { href: "https://maps.google.com" } }]));
    expect(result.content[1]).not.toHaveProperty("attrs");
  });

  it("rejects formatting that isn't allowed", () => {
    const bad = [
      doc({ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Big" }] }),
      doc({ type: "image", attrs: { src: "https://x.example/a.png" } }),
      doc(paragraph("Click", [{ type: "link", attrs: { href: "javascript:alert(1)" } }])),
      doc(paragraph("Red", [{ type: "textStyle", attrs: { color: "red" } }])),
      { type: "paragraph" },
    ];
    for (const value of bad) expect(field.safeParse(JSON.stringify(value)).success).toBe(false);
    expect(field.safeParse("{not json").success).toBe(false);
  });

  it("counts only the words against the limit", () => {
    const long = paragraph("x".repeat(51));
    expect(field.safeParse(JSON.stringify(doc(long))).error?.issues[0].message).toBe("Use 50 characters or fewer.");
    const bolded = paragraph("x".repeat(50), [{ type: "bold" }, { type: "italic" }]);
    expect(field.safeParse(JSON.stringify(doc(bolded))).success).toBe(true);
  });

  it("turns an empty editor or an empty field into the empty document", () => {
    expect(field.parse("")).toEqual(EMPTY_RICH_TEXT);
    expect(field.parse(JSON.stringify(doc({ type: "paragraph" }, { type: "paragraph" })))).toEqual(EMPTY_RICH_TEXT);
  });
});

describe("richTextToPlainText", () => {
  it("separates paragraphs with an empty line and list items with a line", () => {
    const value = {
      type: "doc",
      content: [
        paragraph("One"),
        { type: "bulletList", content: [{ type: "listItem", content: [paragraph("A")] }, { type: "listItem", content: [paragraph("B")] }] },
      ],
    } as RichTextDoc;
    expect(richTextToPlainText(value)).toBe("One\n\nA\nB");
  });
});
