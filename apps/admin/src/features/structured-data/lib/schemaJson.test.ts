import { describe, expect, it } from "vitest";

import { automaticSchemas } from "../constants";
import { toPageRef } from "./pageRef";
import { formatSchemaJson, mainTypes, parseSchemaJson } from "./schemaJson";

const VIDEO = { "@type": "VideoObject", name: "Langtang Valley in 2 minutes" };

const parsed = (value: unknown) => parseSchemaJson(typeof value === "string" ? value : JSON.stringify(value));

const errorOf = (value: unknown) => {
  const result = parsed(value);
  return result.ok ? null : result.message;
};

describe("parseSchemaJson", () => {
  it("keeps a schema without its @context (the website adds it)", () => {
    expect(parsed({ "@context": "https://schema.org", ...VIDEO })).toEqual({ ok: true, data: VIDEO });
    expect(parsed(VIDEO)).toEqual({ ok: true, data: VIDEO });
  });

  it("takes off a <script> tag pasted around it", () => {
    expect(parsed(`<script type="application/ld+json">\n${JSON.stringify(VIDEO)}\n</script>`)).toEqual({ ok: true, data: VIDEO });
  });

  it("keeps a @graph group, without the items' @context", () => {
    const graph = { "@context": "https://schema.org", "@graph": [{ "@context": "https://schema.org", ...VIDEO }, { "@type": "HowTo", name: "Pack" }] };
    expect(parsed(graph)).toEqual({ ok: true, data: { "@graph": [VIDEO, { "@type": "HowTo", name: "Pack" }] } });
  });

  it("turns a pasted list into a @graph group", () => {
    expect(parsed([VIDEO])).toEqual({ ok: true, data: { "@graph": [VIDEO] } });
  });

  it("explains what is wrong", () => {
    expect(errorOf("")).toBe("Paste the JSON-LD.");
    expect(errorOf('{ "@type": "VideoObject", }')).toMatch(/^This isn't valid JSON/);
    expect(errorOf('"VideoObject"')).toMatch(/one JSON object/);
    expect(errorOf({ name: "No type" })).toMatch(/Add an "@type"/);
    expect(errorOf({ "@context": "https://example.com", ...VIDEO })).toMatch(/schema\.org/);
    expect(errorOf({ "@graph": [] })).toMatch(/list of schemas/);
    expect(errorOf({ "@graph": [VIDEO, { name: "No type" }] })).toMatch(/Every item/);
  });

  it("refuses ratings and reviews, also nested or as a property", () => {
    expect(errorOf({ "@type": "AggregateRating", ratingValue: 5 })).toMatch(/"AggregateRating"/);
    expect(errorOf({ "@type": "Product", offers: [{ "@type": "Offer", review: { "@type": "Review" } }] })).toMatch(/"Review"|"review"/);
    expect(errorOf({ "@type": "TouristTrip", aggregateRating: { ratingValue: 5 } })).toMatch(/"aggregateRating"/);
  });

  it("refuses a schema that is too long", () => {
    expect(errorOf({ ...VIDEO, description: "x".repeat(20_001) })).toMatch(/too long/);
  });
});

describe("mainTypes", () => {
  it("lists the block's own types, or its @graph items' types", () => {
    expect(mainTypes({ "@type": ["Product", "Event"] })).toEqual(["Product", "Event"]);
    expect(mainTypes({ "@graph": [VIDEO, { "@type": "FAQPage" }] })).toEqual(["VideoObject", "FAQPage"]);
  });
});

describe("formatSchemaJson", () => {
  it("shows a saved block as complete JSON-LD that reads back the same", () => {
    const text = formatSchemaJson(VIDEO);
    expect(JSON.parse(text)).toEqual({ "@context": "https://schema.org", ...VIDEO });
    expect(parseSchemaJson(text)).toEqual({ ok: true, data: VIDEO });
  });
});

describe("toPageRef", () => {
  it("accepts fixed pages by slug and items by id", () => {
    expect(toPageRef("page", "about")).toEqual({ kind: "page", key: "about" });
    expect(toPageRef("trek", "6f1c9a2e-4b7d-4e8a-9c3f-2d5b8e1a7c40")).toEqual({ kind: "trek", key: "6f1c9a2e-4b7d-4e8a-9c3f-2d5b8e1a7c40" });
  });

  it("refuses anything else", () => {
    expect(toPageRef("page", "blog")).toBeNull();
    expect(toPageRef("trek", "langtang-valley")).toBeNull();
    expect(toPageRef("author", "6f1c9a2e-4b7d-4e8a-9c3f-2d5b8e1a7c40")).toBeNull();
  });
});

describe("automaticSchemas", () => {
  it("lists what each page already writes, TravelAgency everywhere", () => {
    const types = (kind: "page" | "trek", key: string) => automaticSchemas({ kind, key }).map((schema) => schema.type);
    expect(types("trek", "id")).toEqual(["BreadcrumbList", "TouristTrip", "FAQPage", "TravelAgency"]);
    expect(types("page", "contact")).toEqual(["ContactPage", "BreadcrumbList", "FAQPage", "TravelAgency"]);
    expect(types("page", "home")).toEqual(["WebSite", "TravelAgency"]);
  });
});
