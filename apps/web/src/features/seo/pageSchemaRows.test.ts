import { describe, expect, it } from "vitest";

import type { WebPageSchemaRow } from "@/lib/supabase/database.types";

import { toPageSchemasJsonLd } from "./pageSchemaRows";

const row = (overrides: Partial<WebPageSchemaRow>): WebPageSchemaRow => ({
  page_kind: "trek",
  page_slug: "langtang-valley",
  position: 1,
  data: { "@type": "VideoObject", name: "Video" },
  ...overrides,
});

describe("toPageSchemasJsonLd", () => {
  it("joins the page's blocks into one graph, in the admin's order", () => {
    const rows = [
      row({ position: 2, data: { "@graph": [{ "@type": "HowTo" }, { "@type": "Event" }] } }),
      row({ position: 1 }),
      row({ page_slug: "everest-base-camp", data: { "@type": "Other" } }),
      row({ page_kind: "page", page_slug: "langtang-valley", data: { "@type": "Other" } }),
    ];
    expect(toPageSchemasJsonLd(rows, { kind: "trek", slug: "langtang-valley" })).toEqual({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "VideoObject", name: "Video" }, { "@type": "HowTo" }, { "@type": "Event" }],
    });
  });

  it("joins several pages' blocks page by page (a region website's Home and its main trek)", () => {
    const rows = [row({ data: { "@type": "VideoObject" } }), row({ page_kind: "page", page_slug: "home", data: { "@type": "Event" } })];
    expect(toPageSchemasJsonLd(rows, { kind: "page", slug: "home" }, { kind: "trek", slug: "langtang-valley" })?.["@graph"]).toEqual([
      { "@type": "Event" },
      { "@type": "VideoObject" },
    ]);
  });

  it("is null for a page without blocks, and skips data that isn't an object", () => {
    expect(toPageSchemasJsonLd([row({})], { kind: "page", slug: "home" })).toBeNull();
    expect(toPageSchemasJsonLd([row({ data: "text" }), row({ data: [1] })], { kind: "trek", slug: "langtang-valley" })).toBeNull();
  });
});
